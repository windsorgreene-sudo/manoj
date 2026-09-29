import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Radio, Trophy, Users } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { contestPhase, finalizeContestIfEnded } from "@/lib/contests";
import { isFlagEnabled } from "@/lib/flags";
import { Countdown } from "@/components/contests/countdown";
import { RegisterButton } from "@/components/contests/register-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Coding Contests",
  description: "Weekly and monthly rated coding contests with live leaderboards, ICPC-style scoring and Elo ratings.",
  alternates: { canonical: "/contests" },
};

const hours = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 360_000) / 10;

export default async function ContestsPage() {
  if (!(await isFlagEnabled("contests"))) {
    return (
      <div className="container-cv py-16">
        <EmptyState title="Contests are paused" description="Our team has temporarily disabled contests. Check back soon!" />
      </div>
    );
  }
  const [user, contests] = await Promise.all([
    getCurrentUser(),
    db.contest.findMany({
      where: { isPublished: true },
      orderBy: { startsAt: "desc" },
      take: 60,
      include: {
        _count: { select: { participants: true, problems: true } },
        participants: { where: { rank: 1 }, take: 1, select: { user: { select: { name: true } } } },
      },
    }),
  ]);
  const mine = user ? new Set((await db.contestParticipant.findMany({ where: { userId: user.id, contestId: { in: contests.map((c) => c.id) } }, select: { contestId: true } })).map((p) => p.contestId)) : new Set<string>();
  const profile = user ? await db.profile.findUnique({ where: { userId: user.id }, select: { contestRating: true, maxRating: true } }) : null;

  // Lazily finalize contests that ended since the last visit (ratings, ranks, XP).
  await Promise.all(contests.filter((c) => !c.ratingsApplied && contestPhase(c) === "ENDED").map((c) => finalizeContestIfEnded(c.id)));

  const live = contests.filter((c) => contestPhase(c) === "LIVE");
  const upcoming = contests.filter((c) => contestPhase(c) === "UPCOMING").reverse();
  const past = contests.filter((c) => contestPhase(c) === "ENDED");

  return (
    <div className="container-cv py-12 md:py-16">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Contests</h1>
          <p className="mt-3 text-muted-foreground">Rated weekly and monthly rounds. ICPC-style scoring with a 5-minute penalty per wrong attempt, live standings and Elo ratings.</p>
        </div>
        {profile ? (
          <div className="glass flex gap-6 px-6 py-4">
            <div><p className="text-xs text-muted-foreground">Your rating</p><p className="font-heading text-2xl font-bold tabular-nums">{profile.contestRating}</p></div>
            <div><p className="text-xs text-muted-foreground">Max</p><p className="font-heading text-2xl font-bold tabular-nums text-warning">{profile.maxRating}</p></div>
          </div>
        ) : null}
      </header>

      {live.length ? (
        <section aria-labelledby="live-h" className="mt-10 space-y-4">
          <h2 id="live-h" className="flex items-center gap-2 font-heading text-xl font-semibold"><Radio className="size-5 text-danger motion-safe:animate-pulse" /> Live now</h2>
          {live.map((c) => (
            <article key={c.id} className="glass gradient-border flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold"><Link href={`/contests/${c.slug}`} className="hover:text-cyan">{c.title}</Link></h3>
                <p className="mt-1 text-sm text-muted-foreground">{c._count.problems} problems · {c._count.participants} participants</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Countdown target={c.endsAt.toISOString()} label="Ends in" />
                <RegisterButton contestId={c.id} slug={c.slug} registered={mine.has(c.id)} phase="LIVE" signedIn={Boolean(user)} />
                <Button asChild variant="outline" className="rounded-xl"><Link href={`/contests/${c.slug}`}>Enter <ArrowRight /></Link></Button>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      <section aria-labelledby="up-h" className="mt-12">
        <h2 id="up-h" className="flex items-center gap-2 font-heading text-xl font-semibold"><CalendarClock className="size-5 text-cyan" /> Upcoming</h2>
        {upcoming.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {upcoming.map((c) => (
              <article key={c.id} className="glass flex flex-col gap-4 p-6">
                <div>
                  <h3 className="text-lg font-semibold"><Link href={`/contests/${c.slug}`} className="hover:text-cyan">{c.title}</Link></h3>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDate(c.startsAt, { dateStyle: "medium", timeStyle: "short" })} · {hours(c.startsAt, c.endsAt)}h · {c._count.problems} problems</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Users className="size-3.5" /> {c._count.participants} registered</p>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm">Starts in <Countdown compact target={c.startsAt.toISOString()} label="Starts in" /></span>
                  <RegisterButton contestId={c.id} slug={c.slug} registered={mine.has(c.id)} phase="UPCOMING" signedIn={Boolean(user)} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState className="mt-4" title="No upcoming contests" description="New rounds are announced every week, check back soon." />
        )}
      </section>

      <section aria-labelledby="past-h" className="mt-12">
        <h2 id="past-h" className="flex items-center gap-2 font-heading text-xl font-semibold"><Trophy className="size-5 text-warning" /> Past contests</h2>
        {past.length ? (
          <div className="glass mt-4 relative overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="sr-only">Past contests</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-4 py-3">Contest</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3 text-right">Participants</th>
                  <th scope="col" className="px-4 py-3">Winner</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Status</span></th>
                </tr>
              </thead>
              <tbody>
                {past.map((c) => (
                  <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                    <td className="px-4 py-3"><Link href={`/contests/${c.slug}`} className="font-medium hover:text-cyan">{c.title}</Link></td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(c.startsAt)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c._count.participants}</td>
                    <td className="px-4 py-3">{c.participants[0]?.user.name ?? "-"}</td>
                    <td className="px-4 py-3 text-right">{mine.has(c.id) ? <span className="rounded bg-brand/20 px-2 py-0.5 text-xs">Participated</span> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState className="mt-4" title="No past contests yet" />
        )}
      </section>
    </div>
  );
}
