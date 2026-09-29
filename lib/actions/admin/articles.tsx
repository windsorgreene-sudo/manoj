"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminAction, audit, slugSchema } from "@/lib/admin";
import { hasRole } from "@/lib/session";
import { readingTimeMins } from "@/lib/mdx";
import { MdxContent } from "@/components/content/mdx-content";

const articleSchema = z.object({
  id: z.string().max(40).optional(),
  title: z.string().trim().min(4).max(160),
  slug: slugSchema,
  excerpt: z.string().trim().min(10).max(400),
  content: z.string().min(20).max(200_000),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  categoryId: z.string().max(40).nullable().optional(),
  tags: z.array(z.string().trim().toLowerCase().max(40)).max(12).default([]),
  isBlog: z.boolean().default(false),
  seoTitle: z.string().max(160).optional().default(""),
  seoDescription: z.string().max(320).optional().default(""),
  ogImage: z.union([z.url(), z.string().regex(/^\/uploads\//), z.literal("")]).optional().default(""),
  status: z.enum(["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  scheduledAt: z.string().datetime({ offset: true }).nullable().optional(),
  message: z.string().max(200).optional().default(""),
});
export type ArticleInput = z.input<typeof articleSchema>;

function revalidateArticle(slug: string) {
  revalidatePath(`/tutorials/${slug}`);
  revalidatePath("/tutorials");
  revalidatePath("/blog");
}

export async function saveArticle(input: ArticleInput) {
  return adminAction(async (actor) => {
    const d = articleSchema.parse(input);
    const isAdmin = hasRole(actor, "ADMIN");
    if (!isAdmin && !["DRAFT", "IN_REVIEW"].includes(d.status)) throw new Error("USER:Contributors can save drafts or submit for review. An editor will publish it.");
    if (d.status === "SCHEDULED" && !d.scheduledAt) throw new Error("USER:Pick a date and time to schedule publishing.");
    const existing = d.id ? await db.article.findUnique({ where: { id: d.id }, select: { id: true, authorId: true, status: true, publishedAt: true, _count: { select: { revisions: true } } } }) : null;
    if (d.id && !existing) throw new Error("USER:Article not found");
    if (existing && !isAdmin && existing.authorId !== actor.id) throw new Error("USER:You can only edit your own articles.");
    if (existing && !isAdmin && existing.status === "PUBLISHED") throw new Error("USER:Published articles can only be edited by editors. Use “Improve this article” instead.");

    const tagIds = [];
    for (const t of d.tags) {
      const slug = t.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (!slug) continue;
      tagIds.push((await db.tag.upsert({ where: { slug }, update: {}, create: { slug, name: t } })).id);
    }
    const data = {
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt,
      content: d.content,
      difficulty: d.difficulty,
      categoryId: d.categoryId || null,
      isBlog: d.isBlog,
      seoTitle: d.seoTitle || null,
      seoDescription: d.seoDescription || null,
      ogImage: d.ogImage || null,
      status: d.status,
      scheduledAt: d.status === "SCHEDULED" && d.scheduledAt ? new Date(d.scheduledAt) : null,
      publishedAt: d.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt ?? null,
      readingMins: readingTimeMins(d.content),
      reviewerId: d.status === "PUBLISHED" && isAdmin ? actor.id : undefined,
      tags: { set: tagIds.map((id) => ({ id })) },
    };
    const article = existing
      ? await db.article.update({ where: { id: existing.id }, data })
      : await db.article.create({ data: { ...data, authorId: actor.id, tags: { connect: tagIds.map((id) => ({ id })) } } });
    const version = (existing?._count.revisions ?? 0) + 1;
    await db.articleRevision.create({ data: { articleId: article.id, authorId: actor.id, title: d.title, content: d.content, version, message: d.message || (existing ? "Update" : "Created") } });
    await audit(actor, existing ? "article.update" : "article.create", "Article", article.slug, { status: d.status, version });
    if (d.status === "IN_REVIEW" && existing?.status !== "IN_REVIEW") {
      const admins = await db.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
      await db.notification.createMany({ data: admins.map((a) => ({ userId: a.id, type: "REVIEW" as const, title: "New article awaiting review", body: `${actor.name} submitted “${d.title}”.`, link: "/admin/review" })) });
    }
    revalidateArticle(article.slug);
    return { id: article.id, slug: article.slug, version };
  }, "CONTRIBUTOR");
}

export async function restoreRevision(revisionId: string) {
  return adminAction(async (actor) => {
    const rev = await db.articleRevision.findUnique({ where: { id: z.string().max(40).parse(revisionId) }, include: { article: { select: { id: true, slug: true, authorId: true, _count: { select: { revisions: true } } } } } });
    if (!rev) throw new Error("USER:Revision not found");
    if (!hasRole(actor, "ADMIN") && rev.article.authorId !== actor.id) throw new Error("USER:Not your article");
    await db.article.update({ where: { id: rev.articleId }, data: { title: rev.title, content: rev.content, readingMins: readingTimeMins(rev.content) } });
    await db.articleRevision.create({ data: { articleId: rev.articleId, authorId: actor.id, title: rev.title, content: rev.content, version: rev.article._count.revisions + 1, message: `Restored v${rev.version}` } });
    await audit(actor, "article.restore", "Article", rev.article.slug, { from: rev.version });
    revalidateArticle(rev.article.slug);
    return null;
  }, "CONTRIBUTOR");
}

export async function deleteArticle(id: string) {
  return adminAction(async (actor) => {
    const a = await db.article.delete({ where: { id: z.string().max(40).parse(id) } });
    await audit(actor, "article.delete", "Article", a.slug);
    revalidateArticle(a.slug);
    return null;
  });
}

export async function reviewArticle(input: { id: string; decision: "approve" | "changes" | "reject"; note?: string }) {
  return adminAction(async (actor) => {
    const d = z.object({ id: z.string().max(40), decision: z.enum(["approve", "changes", "reject"]), note: z.string().max(2000).optional() }).parse(input);
    if (d.decision !== "approve" && !d.note?.trim()) throw new Error("USER:Add a comment for the author.");
    const status = d.decision === "approve" ? "PUBLISHED" : d.decision === "changes" ? "CHANGES_REQUESTED" : "REJECTED";
    const a = await db.article.update({
      where: { id: d.id },
      data: { status, reviewNote: d.note ?? null, reviewerId: actor.id, ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}) },
    });
    await db.notification.create({
      data: {
        userId: a.authorId,
        type: "REVIEW",
        title: d.decision === "approve" ? `“${a.title}” is published!` : d.decision === "changes" ? `Changes requested on “${a.title}”` : `“${a.title}” was not accepted`,
        body: d.note ?? "Thanks for contributing to Kodshala.",
        link: d.decision === "approve" ? `/tutorials/${a.slug}` : `/dashboard/articles/${a.id}`,
      },
    });
    await audit(actor, `article.review.${d.decision}`, "Article", a.slug, { note: d.note ?? null });
    revalidateArticle(a.slug);
    return null;
  });
}

/** Live MDX preview, returns a rendered React tree from the server. */
export async function previewMdx(content: string) {
  const r = await adminAction(async () => z.string().max(200_000).parse(content), "CONTRIBUTOR");
  if (!r.ok) return null;
  try {
    return await MdxContent({ content: r.data, tryIt: false, staticCode: true });
  } catch (e) {
    return <p className="text-sm text-danger">MDX error: {e instanceof Error ? e.message.slice(0, 300) : "invalid syntax"}</p>;
  }
}
