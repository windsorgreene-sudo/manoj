"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Crown, Medal, RefreshCw, Snowflake } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Standings, StandingRow } from "@/lib/contests";
import { cn } from "@/lib/utils";

const POLL_MS = 15_000;

async function fetchStandings(slug: string, page: number): Promise<Standings> {
  const res = await fetch(`/api/contests/${slug}/leaderboard?page=${page}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Standings;
}

function RankCell({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="size-5 text-warning" aria-label="Rank 1" />;
  if (rank <= 3) return <Medal className={cn("size-5", rank === 2 ? "text-slate-300" : "text-amber-700")} aria-label={`Rank ${rank}`} />;
  return <span className="tabular-nums">{rank}</span>;
}

function Delta({ before, after }: { before: number | null; after: number | null }) {
  if (before === null || after === null) return <span className="text-muted-foreground">-</span>;
  const d = after - before;
  return (
    <span className="tabular-nums">
      {after} <span className={cn("text-xs", d >= 0 ? "text-success" : "text-danger")}>({d >= 0 ? "+" : ""}{d})</span>
    </span>
  );
}

function Row({ r, problems, me, ended }: { r: StandingRow; problems: Standings["problems"]; me: boolean; ended: boolean }) {
  return (
    <tr className={cn("border-b border-border/60 last:border-0", me && "bg-brand/10")}>
      <td className="px-3 py-2.5 font-semibold"><RankCell rank={r.rank} /></td>
      <td className="px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="size-7">
            {r.image ? <AvatarImage src={r.image} alt="" /> : null}
            <AvatarFallback className="bg-brand/20 text-[10px]">{r.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</AvatarFallback>
          </Avatar>
          {r.username ? <Link href={`/u/${r.username}`} className="truncate font-medium hover:text-cyan">{r.name}</Link> : <span className="truncate font-medium">{r.name}</span>}
          {me ? <span className="rounded bg-brand px-1.5 text-[10px] text-white">You</span> : null}
        </div>
      </td>
      <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{r.score}</td>
      <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{r.penalty}</td>
      {problems.map((p, i) => {
        const c = r.cells[i];
        return (
          <td key={p.id} className="px-2 py-2.5 text-center text-xs">
            {c?.solved ? (
              <span className="inline-block rounded-md bg-success/15 px-1.5 py-0.5 font-mono text-success" title={`Solved at ${c.minute} min after ${c.attempts} attempt(s)`}>
                +{c.attempts > 1 ? c.attempts - 1 : ""}
                <span className="block text-[10px] opacity-80">{c.minute}m</span>
              </span>
            ) : c && c.attempts > 0 ? (
              <span className="inline-block rounded-md bg-danger/15 px-1.5 py-0.5 font-mono text-danger" title={`${c.attempts} wrong attempt(s)`}>−{c.attempts}</span>
            ) : (
              <span className="text-muted-foreground/50">·</span>
            )}
          </td>
        );
      })}
      {ended ? <td className="px-3 py-2.5 text-right"><Delta before={r.ratingBefore} after={r.ratingAfter} /></td> : null}
    </tr>
  );
}

/** Contest leaderboard: realtime via Pusher when configured, otherwise polls every 15s while live. */
export function ContestLeaderboard({ slug, initial }: { slug: string; initial: Standings }) {
  const qc = useQueryClient();
  const [page, setPage] = useState(initial.page);
  const hasPusher = Boolean(process.env.NEXT_PUBLIC_PUSHER_KEY);
  const live = initial.phase === "LIVE";
  const q = useQuery({
    queryKey: ["contest-standings", slug, page],
    queryFn: () => fetchStandings(slug, page),
    initialData: page === initial.page ? initial : undefined,
    placeholderData: keepPreviousData,
    refetchInterval: live && !hasPusher ? POLL_MS : false,
    staleTime: 5_000,
  });

  useEffect(() => {
    if (!hasPusher || !live) return;
    let cleanup = () => {};
    void import("pusher-js").then(({ default: Pusher }) => {
      const p = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string });
      p.subscribe(`contest-${slug}`).bind("leaderboard", () => void qc.invalidateQueries({ queryKey: ["contest-standings", slug] }));
      cleanup = () => p.disconnect();
    });
    return () => cleanup();
  }, [hasPusher, live, qc, slug]);

  if (q.isError && !q.data) return <ErrorState title="Couldn't load the leaderboard" onRetry={() => void q.refetch()} />;
  if (!q.data) return <LeaderboardSkeleton />;
  const d = q.data;
  const ended = d.phase === "ENDED";
  const meOnPage = d.me ? d.rows.some((r) => r.userId === d.me?.userId) : false;

  return (
    <section aria-labelledby="lb-title" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="lb-title" className="font-heading text-xl font-semibold">Leaderboard <span className="text-sm font-normal text-muted-foreground">· {d.total} participants</span></h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {live ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:hidden" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span>
              {hasPusher ? "Live" : "Auto-refreshing every 15s"}
            </span>
          ) : null}
          <Button variant="ghost" size="icon" className="size-8 rounded-lg" aria-label="Refresh leaderboard" onClick={() => void q.refetch()} disabled={q.isFetching}>
            <RefreshCw className={cn("size-4", q.isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>
      {d.frozen ? (
        <p className="flex items-center gap-2 rounded-xl border border-cyan/30 bg-cyan/10 px-4 py-2.5 text-sm text-cyan" role="status">
          <Snowflake className="size-4" /> The leaderboard is frozen{d.freezeAt ? ` since ${new Date(d.freezeAt).toLocaleTimeString()}` : ""}. Final standings are revealed when the contest ends.
          {d.me ? <span className="ml-auto text-foreground">Your live score: <b>{d.me.live.score}</b> ({d.me.live.solved} solved)</span> : null}
        </p>
      ) : null}
      {d.rows.length === 0 ? (
        <EmptyState title="No participants yet" description={d.phase === "UPCOMING" ? "Register now to secure your spot on the board." : "Nobody competed in this contest."} />
      ) : (
        <div className="glass relative overflow-x-auto" aria-busy={q.isFetching}>
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">Contest standings, page {d.page} of {d.pages}</caption>
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="w-14 px-3 py-3">#</th>
                <th scope="col" className="px-3 py-3">Participant</th>
                <th scope="col" className="px-3 py-3 text-right">Score</th>
                <th scope="col" className="px-3 py-3 text-right" title="Penalty minutes">Penalty</th>
                {d.problems.map((p) => (
                  <th key={p.id} scope="col" className="px-2 py-3 text-center" title={`${p.title} (${p.points} pts)`}>{p.label}</th>
                ))}
                {ended ? <th scope="col" className="px-3 py-3 text-right">Rating</th> : null}
              </tr>
            </thead>
            <tbody>
              {d.rows.map((r) => (
                <Row key={r.userId} r={r} problems={d.problems} me={r.userId === d.me?.userId} ended={ended} />
              ))}
              {d.me && !meOnPage ? (
                <>
                  <tr aria-hidden><td colSpan={4 + d.problems.length + (ended ? 1 : 0)} className="py-1 text-center text-xs text-muted-foreground">⋯</td></tr>
                  <Row r={d.me} problems={d.problems} me ended={ended} />
                </>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
      {d.pages > 1 ? (
        <nav aria-label="Leaderboard pages" className="flex items-center justify-end gap-2 text-sm">
          <Button variant="outline" size="sm" className="rounded-lg" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft /> Prev</Button>
          <span className="tabular-nums text-muted-foreground">{d.page} / {d.pages}</span>
          <Button variant="outline" size="sm" className="rounded-lg" disabled={page >= d.pages} onClick={() => setPage((p) => p + 1)}>Next <ChevronRight /></Button>
        </nav>
      ) : null}
    </section>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="glass space-y-2 p-4" aria-busy="true" aria-label="Loading leaderboard">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-9 w-full rounded-lg" />
      ))}
    </div>
  );
}
