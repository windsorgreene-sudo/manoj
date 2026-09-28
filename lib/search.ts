import "server-only";
import { db } from "@/lib/db";
import { integrations } from "@/lib/env";

export type SearchHit = { type: "article" | "course" | "problem" | "doubt"; title: string; href: string; subtitle?: string };

type Row = { type: SearchHit["type"]; title: string; slug: string; subtitle: string | null; rank: number };

/** Postgres full-text search across articles, courses, problems and doubts (Meilisearch fallback path). */
async function postgresSearch(q: string, limit: number): Promise<SearchHit[]> {
  const rows = await db.$queryRaw<Row[]>`
    WITH query AS (SELECT websearch_to_tsquery('english', ${q}) AS tsq, ${`%${q}%`}::text AS like_q)
    SELECT * FROM (
      SELECT 'article'::text AS type, a.title, a.slug, a.excerpt AS subtitle,
        ts_rank(to_tsvector('english', a.title || ' ' || a.excerpt || ' ' || a.content), query.tsq) + (CASE WHEN a.title ILIKE query.like_q THEN 1 ELSE 0 END) AS rank
      FROM "Article" a, query
      WHERE a.status = 'PUBLISHED' AND (to_tsvector('english', a.title || ' ' || a.excerpt || ' ' || a.content) @@ query.tsq OR a.title ILIKE query.like_q)
      UNION ALL
      SELECT 'course', c.title, c.slug, c.subtitle,
        ts_rank(to_tsvector('english', c.title || ' ' || c.subtitle || ' ' || c.description), query.tsq) + (CASE WHEN c.title ILIKE query.like_q THEN 1.5 ELSE 0 END)
      FROM "Course" c, query
      WHERE c.status = 'PUBLISHED' AND (to_tsvector('english', c.title || ' ' || c.subtitle || ' ' || c.description) @@ query.tsq OR c.title ILIKE query.like_q)
      UNION ALL
      SELECT 'problem', p.title, p.slug, p.difficulty::text,
        ts_rank(to_tsvector('english', p.title || ' ' || p.statement), query.tsq) + (CASE WHEN p.title ILIKE query.like_q THEN 1.2 ELSE 0 END)
      FROM "Problem" p, query
      WHERE p.status = 'PUBLISHED' AND (to_tsvector('english', p.title || ' ' || p.statement) @@ query.tsq OR p.title ILIKE query.like_q)
      UNION ALL
      SELECT 'doubt', d.title, d.id, NULL,
        ts_rank(to_tsvector('english', d.title || ' ' || d.body), query.tsq)
      FROM "Doubt" d, query
      WHERE d.hidden = false AND (to_tsvector('english', d.title || ' ' || d.body) @@ query.tsq OR d.title ILIKE query.like_q)
    ) results
    ORDER BY rank DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({
    type: r.type,
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    href:
      r.type === "article" ? `/tutorials/${r.slug}` : r.type === "course" ? `/courses/${r.slug}` : r.type === "problem" ? `/problems/${r.slug}` : `/doubts/${r.slug}`,
  }));
}

type MeiliHit = { type: SearchHit["type"]; title: string; href: string; subtitle?: string };

async function meiliSearch(q: string, limit: number): Promise<SearchHit[]> {
  const res = await fetch(`${process.env.MEILISEARCH_HOST}/indexes/content/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.MEILISEARCH_API_KEY ? { Authorization: `Bearer ${process.env.MEILISEARCH_API_KEY}` } : {}),
    },
    body: JSON.stringify({ q, limit }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Meilisearch ${res.status}`);
  const json = (await res.json()) as { hits: MeiliHit[] };
  return json.hits;
}

export async function search(q: string, limit = 12): Promise<SearchHit[]> {
  if (integrations.meilisearch()) {
    try {
      return await meiliSearch(q, limit);
    } catch (e) {
      console.warn("[search] Meilisearch failed, falling back to Postgres", e);
    }
  }
  return postgresSearch(q, limit);
}
