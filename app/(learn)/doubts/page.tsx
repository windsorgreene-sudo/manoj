import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Eye, MessageSquare, Plus, Search } from "lucide-react";
import type { Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Doubts Forum",
  description: "Ask coding questions, answer others and get unstuck — DSA, languages, CS fundamentals and more.",
  alternates: { canonical: "/doubts" },
};

type SP = Promise<{ q?: string; tag?: string; sort?: string; page?: string }>;
const PAGE = 20;

export default async function DoubtsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = sp.q?.trim().slice(0, 100) ?? "";
  const tag = sp.tag?.slice(0, 40);
  const sort = sp.sort === "top" || sp.sort === "unanswered" ? sp.sort : "new";
  const page = Math.max(1, Number(sp.page) || 1);
  const where: Prisma.DoubtWhereInput = {
    hidden: false,
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { body: { contains: q, mode: "insensitive" } }] } : {}),
    ...(tag ? { tags: { some: { slug: tag } } } : {}),
    ...(sort === "unanswered" ? { answers: { none: { hidden: false } } } : {}),
  };
  const [total, doubts, popularTags] = await Promise.all([
    db.doubt.count({ where }),
    db.doubt.findMany({
      where,
      orderBy: sort === "top" ? [{ score: "desc" }, { createdAt: "desc" }] : { createdAt: "desc" },
      skip: (page - 1) * PAGE,
      take: PAGE,
      include: { user: { select: { name: true, username: true } }, tags: { select: { slug: true, name: true } }, _count: { select: { answers: { where: { hidden: false } } } } },
    }),
    db.tag.findMany({ where: { doubts: { some: { hidden: false } } }, orderBy: { doubts: { _count: "desc" } }, take: 15, select: { slug: true, name: true, _count: { select: { doubts: true } } } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const link = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q: q || undefined, tag, sort: sort === "new" ? undefined : sort, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/doubts?${s}` : "/doubts";
  };

  return (
    <div className="container-cv py-12 md:py-16">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Community</p>
          <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Doubts forum</h1>
          <p className="mt-3 text-muted-foreground">Stuck? Ask the community. Help others and earn the Helping Hand badge when your answer is accepted.</p>
        </div>
        <Button asChild size="lg" className="rounded-xl"><Link href="/doubts/ask"><Plus /> Ask a doubt</Link></Button>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <form action="/doubts" method="get" role="search" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input name="q" defaultValue={q} placeholder="Search doubts…" aria-label="Search doubts" className="pl-9" />
            </div>
            {tag ? <input type="hidden" name="tag" value={tag} /> : null}
            {sort !== "new" ? <input type="hidden" name="sort" value={sort} /> : null}
            <Button type="submit" variant="outline" className="rounded-xl">Search</Button>
          </form>
          <nav aria-label="Sort doubts" className="mt-4 flex flex-wrap items-center gap-2">
            {[
              { v: "new", l: "Newest" },
              { v: "top", l: "Top voted" },
              { v: "unanswered", l: "Unanswered" },
            ].map((o) => (
              <Link key={o.v} href={link({ sort: o.v === "new" ? undefined : o.v, page: undefined })} aria-current={sort === o.v ? "page" : undefined} className={cn("rounded-xl border px-3 py-1.5 text-sm", sort === o.v ? "border-brand bg-brand text-white" : "border-border hover:border-brand")}>
                {o.l}
              </Link>
            ))}
            {tag ? <Link href={link({ tag: undefined, page: undefined })} className="rounded-xl bg-cyan/15 px-3 py-1.5 text-sm text-cyan">#{tag} ✕</Link> : null}
            <span className="ml-auto text-sm text-muted-foreground">{total} doubt{total === 1 ? "" : "s"}</span>
          </nav>

          {doubts.length ? (
            <ul className="mt-6 space-y-3">
              {doubts.map((d) => (
                <li key={d.id} className="glass hover-glow flex gap-4 p-5">
                  <div className="hidden w-20 shrink-0 flex-col items-center gap-1.5 text-center text-xs text-muted-foreground sm:flex">
                    <span><b className="block text-base text-foreground tabular-nums">{d.score}</b>votes</span>
                    <span className={cn("w-full rounded-lg px-1 py-1", d.acceptedAnswerId ? "bg-success/15 text-success" : d._count.answers ? "border border-border" : "")}>
                      <b className="tabular-nums">{d._count.answers}</b> ans
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">
                      <Link href={`/doubts/${d.id}`} className="hover:text-cyan">{d.title}</Link>
                      {d.acceptedAnswerId ? <CheckCircle2 className="ml-1.5 inline size-4 text-success" aria-label="Has accepted answer" /> : null}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.body}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {d.tags.map((t) => (
                        <Link key={t.slug} href={link({ tag: t.slug, page: undefined })} className="rounded-md bg-brand/15 px-2 py-0.5 text-brand hover:bg-brand/25">{t.name}</Link>
                      ))}
                      <span className="ml-auto flex items-center gap-3">
                        <span className="flex items-center gap-1 sm:hidden"><MessageSquare className="size-3.5" /> {d._count.answers}</span>
                        <span className="flex items-center gap-1"><Eye className="size-3.5" /> {d.views}</span>
                        <span>{d.user.username ? <Link href={`/u/${d.user.username}`} className="hover:text-foreground">{d.user.name}</Link> : d.user.name} · {timeAgo(d.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-8" title={q || tag ? "No doubts match" : "No doubts yet"} description={q || tag ? "Try different keywords — or ask it yourself!" : "Be the first to ask."} action={<Button asChild className="rounded-xl"><Link href="/doubts/ask">Ask a doubt</Link></Button>} />
          )}

          {pages > 1 ? (
            <nav aria-label="Pages" className="mt-6 flex items-center justify-center gap-2 text-sm">
              {page > 1 ? <Link href={link({ page: String(page - 1) })} className="rounded-lg border border-border px-3 py-1.5 hover:border-brand">Previous</Link> : null}
              <span className="text-muted-foreground tabular-nums">Page {page} of {pages}</span>
              {page < pages ? <Link href={link({ page: String(page + 1) })} className="rounded-lg border border-border px-3 py-1.5 hover:border-brand">Next</Link> : null}
            </nav>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="glass p-5">
            <h2 className="text-sm font-semibold">Popular tags</h2>
            {popularTags.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {popularTags.map((t) => (
                  <Link key={t.slug} href={link({ tag: t.slug, page: undefined })} className={cn("rounded-md px-2 py-0.5 text-xs", tag === t.slug ? "bg-brand text-white" : "bg-muted text-muted-foreground hover:text-foreground")}>
                    {t.name} <span className="opacity-60">{t._count.doubts}</span>
                  </Link>
                ))}
              </div>
            ) : <p className="mt-2 text-xs text-muted-foreground">No tags yet.</p>}
          </div>
          <div className="glass p-5 text-sm text-muted-foreground">
            <h2 className="font-semibold text-foreground">Asking a good doubt</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Summarise the problem in the title.</li>
              <li>Show what you tried and where it breaks.</li>
              <li>Paste the smallest code that reproduces it.</li>
              <li>Accept the answer that helped.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
