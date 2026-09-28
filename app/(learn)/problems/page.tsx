import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, CircleDashed, Crown, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { ProblemFilters } from "@/components/practice/problem-filters";
import { getProblemFacets, listProblems, type ProblemFilters as F } from "@/lib/queries/problems";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Problems",
  description: "Practice 30+ curated coding interview problems with topic and company tags, acceptance rates and a 6-language judge.",
  alternates: { canonical: "/problems" },
};

export default async function ProblemsPage({ searchParams }: { searchParams: Promise<F> }) {
  const f = await searchParams;
  const user = await getCurrentUser();
  const [data, facets] = await Promise.all([listProblems(f, user?.id ?? null), getProblemFacets()]);
  const qs = (page: number) => {
    const p = new URLSearchParams(Object.entries(f).filter(([, v]) => typeof v === "string" && v) as [string, string][]);
    p.set("page", String(page));
    return `/problems?${p.toString()}`;
  };
  return (
    <div className="container-cv py-10 md:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Problem set</p>
          <h1 className="mt-2 font-heading text-4xl font-bold">Practice problems</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {facets.total} problems · <span className="text-success">{facets.counts.EASY} Easy</span> · <span className="text-warning">{facets.counts.MEDIUM} Medium</span> · <span className="text-danger">{facets.counts.HARD} Hard</span>
            {user ? <> · You solved <strong className="text-foreground">{data.solvedCount}</strong></> : null}
          </p>
        </div>
        <Button asChild className="rounded-xl" variant="secondary">
          <a href={`/api/problems/random${f.difficulty ? `?difficulty=${f.difficulty}` : ""}`}>
            <Shuffle /> Pick random
          </a>
        </Button>
      </header>
      <div className="mt-6">
        <Suspense fallback={<div className="shimmer h-16 rounded-2xl" />}>
          <ProblemFilters topics={facets.topics} companies={facets.companies} signedIn={Boolean(user)} />
        </Suspense>
      </div>
      {data.problems.length === 0 ? (
        <EmptyState className="mt-6" title="No problems match your filters" description="Try clearing a filter." action={<Button asChild variant="outline" className="rounded-xl"><Link href="/problems">Reset</Link></Button>} />
      ) : (
        <div className="glass mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <caption className="sr-only">Problems</caption>
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="w-12 px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Title</th>
                <th scope="col" className="px-4 py-3">Topics</th>
                <th scope="col" className="px-4 py-3">Companies</th>
                <th scope="col" className="px-4 py-3 text-right">Acceptance</th>
                <th scope="col" className="px-4 py-3 text-right">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {data.problems.map((p) => (
                <tr key={p.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/50">
                  <td className="px-4 py-3">
                    {p.status === "solved" ? <CheckCircle2 className="size-5 text-success" aria-label="Solved" /> : p.status === "attempted" ? <CircleDashed className="size-5 text-warning" aria-label="Attempted" /> : <span className="sr-only">Not attempted</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/problems/${p.slug}`} className="font-medium hover:text-cyan">
                      {p.number}. {p.title}
                    </Link>
                    {p.isPremium ? <Crown className="ml-2 inline size-3.5 text-warning" aria-label="Pro" /> : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.topics.slice(0, 2).map((t) => (
                        <Link key={t} href={`/problems?topic=${encodeURIComponent(t)}`} className="rounded-md bg-surface-2 px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground">{t}</Link>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.companies.slice(0, 2).join(", ")}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.acceptance ? `${p.acceptance}%` : "—"}</td>
                  <td className="px-4 py-3 text-right"><DifficultyBadge difficulty={p.difficulty} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data.pages > 1 ? (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-2">
          {data.page > 1 ? <Button asChild variant="outline" size="sm" className="rounded-xl"><Link href={qs(data.page - 1)}>Previous</Link></Button> : null}
          <span className="text-sm text-muted-foreground">Page {data.page} of {data.pages}</span>
          {data.page < data.pages ? <Button asChild variant="outline" size="sm" className="rounded-xl"><Link href={qs(data.page + 1)}>Next</Link></Button> : null}
        </nav>
      ) : null}
    </div>
  );
}
