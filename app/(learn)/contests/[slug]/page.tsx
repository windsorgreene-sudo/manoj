import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, Lock, Snowflake, XCircle } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { contestPhase, getStandings } from "@/lib/contests";
import { ContestLeaderboard } from "@/components/contests/leaderboard";
import { Countdown } from "@/components/contests/countdown";
import { PodiumStage } from "@/components/contests/podium-stage";
import { RegisterButton } from "@/components/contests/register-button";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { appUrl, cn, formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await db.contest.findUnique({ where: { slug: (await params).slug }, select: { title: true, description: true, slug: true, isPublished: true } });
  if (!c || !c.isPublished) return {};
  return { title: c.title, description: c.description.slice(0, 160), alternates: { canonical: `/contests/${c.slug}` } };
}

const PHASE_STYLE = { UPCOMING: "bg-cyan/15 text-cyan", LIVE: "bg-danger/15 text-danger", ENDED: "bg-muted text-muted-foreground" } as const;

export default async function ContestPage({ params }: Props) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const contest = await db.contest.findUnique({
    where: { slug },
    include: { problems: { orderBy: { order: "asc" }, include: { problem: { select: { id: true, slug: true, title: true, difficulty: true } } } }, _count: { select: { participants: true } } },
  });
  if (!contest || (!contest.isPublished && user?.role !== "ADMIN")) notFound();
  const standings = await getStandings(slug, user?.id ?? null);
  if (!standings) notFound();
  const phase = contestPhase(contest);
  const registered = Boolean(standings.me) || (user ? Boolean(await db.contestParticipant.findUnique({ where: { contestId_userId: { contestId: contest.id, userId: user.id } }, select: { id: true } })) : false);
  const podium = phase === "ENDED" ? standings.rows.slice(0, 3).map((r, i) => ({ rank: i + 1, name: r.name, score: r.score })) : [];
  const url = `${appUrl()}/contests/${contest.slug}`;

  return (
    <div className="container-cv py-10 md:py-14">
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", url: appUrl() }, { name: "Contests", url: `${appUrl()}/contests` }, { name: contest.title, url }]),
          {
            "@context": "https://schema.org",
            "@type": "Event",
            name: contest.title,
            description: contest.description,
            startDate: contest.startsAt.toISOString(),
            endDate: contest.endsAt.toISOString(),
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: { "@type": "VirtualLocation", url },
            organizer: { "@type": "Organization", name: "CodeVerse", url: appUrl() },
            isAccessibleForFree: true,
          },
        ]}
      />
      <Link href="/contests" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All contests</Link>

      <header className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", PHASE_STYLE[phase])}>
            {phase === "LIVE" ? <span className="size-1.5 rounded-full bg-danger motion-safe:animate-pulse" /> : null}
            {phase === "UPCOMING" ? "Upcoming" : phase === "LIVE" ? "Live" : "Ended"}
          </span>
          {standings.frozen ? <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-cyan/15 px-3 py-1 text-xs font-semibold text-cyan"><Snowflake className="size-3" /> Frozen</span> : null}
          <h1 className="mt-3 font-heading text-3xl font-bold md:text-5xl">{contest.title}</h1>
          <p className="mt-3 text-muted-foreground">{contest.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDate(contest.startsAt, { dateStyle: "medium", timeStyle: "short" })} – {formatDate(contest.endsAt, { timeStyle: "short" })} · {contest._count.participants} participants
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          {phase !== "ENDED" ? <Countdown target={(phase === "UPCOMING" ? contest.startsAt : contest.endsAt).toISOString()} label={phase === "UPCOMING" ? "Starts in" : "Ends in"} /> : null}
          <RegisterButton contestId={contest.id} slug={contest.slug} registered={registered} phase={phase} signedIn={Boolean(user)} />
        </div>
      </header>

      {podium.length ? <div className="mt-10"><PodiumStage entries={podium} /></div> : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="problems-h">
            <h2 id="problems-h" className="font-heading text-xl font-semibold">Problems</h2>
            {phase === "UPCOMING" ? (
              <div className="glass mt-4 flex items-center gap-3 p-6 text-sm text-muted-foreground"><Lock className="size-5" /> Problems are revealed when the contest starts.</div>
            ) : (
              <ol className="mt-4 space-y-2">
                {standings.problems.map((p, i) => {
                  const cell = standings.me?.cells[i];
                  const cp = contest.problems[i];
                  const href = phase === "LIVE" && registered ? `/problems/${p.slug}?contest=${contest.id}&from=${contest.slug}` : `/problems/${p.slug}`;
                  return (
                    <li key={p.id}>
                      <Link href={href} className="glass hover-glow flex items-center gap-4 px-5 py-4">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/15 font-mono font-bold text-brand">{p.label}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{p.title}</span>
                          <span className="text-xs text-muted-foreground">{p.points} points</span>
                        </span>
                        {cp ? <DifficultyBadge difficulty={cp.problem.difficulty} /> : null}
                        {cell?.solved ? <CheckCircle2 className="size-5 text-success" aria-label="Solved" /> : cell && cell.attempts > 0 ? <XCircle className="size-5 text-danger" aria-label="Attempted" /> : <Circle className="size-5 text-muted-foreground/40" aria-label="Not attempted" />}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
            {phase === "LIVE" && !registered ? <p className="mt-3 text-sm text-warning">Register to have your submissions count towards the leaderboard.</p> : null}
            {phase === "ENDED" ? <p className="mt-3 text-sm text-muted-foreground">The contest is over — problems are open for practice (not scored).</p> : null}
          </section>

          <ContestLeaderboard slug={contest.slug} initial={standings} />
        </div>

        <aside className="space-y-4">
          {standings.me ? (
            <div className="glass p-5">
              <h2 className="text-sm font-semibold">Your standing</h2>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div><dt className="text-xs text-muted-foreground">Rank</dt><dd className="font-heading text-2xl font-bold tabular-nums">#{standings.me.rank}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Score</dt><dd className="font-heading text-2xl font-bold tabular-nums">{standings.me.live.score}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Solved</dt><dd className="font-heading text-2xl font-bold tabular-nums">{standings.me.live.solved}</dd></div>
              </dl>
              {standings.me.ratingAfter !== null && standings.me.ratingBefore !== null ? (
                <p className="mt-3 text-center text-sm">Rating {standings.me.ratingBefore} → <b>{standings.me.ratingAfter}</b></p>
              ) : null}
            </div>
          ) : null}
          <div className="glass p-5">
            <h2 className="text-sm font-semibold">Rules</h2>
            <Accordion type="single" collapsible className="mt-2">
              <AccordionItem value="scoring">
                <AccordionTrigger className="text-sm">Scoring</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">Each problem is worth the listed points for your first Accepted submission. Ties are broken by penalty: minutes from the start until each accepted solve, plus 5 minutes per earlier wrong attempt (compilation errors are free).</AccordionContent>
              </AccordionItem>
              <AccordionItem value="freeze">
                <AccordionTrigger className="text-sm">Leaderboard freeze</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">Organisers may freeze the public board near the end. You always see your own live score; final standings are revealed when the contest ends.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="rating">
                <AccordionTrigger className="text-sm">Ratings</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">Everyone who submits is rated with an Elo-style system (start at 1500, max change ±150 per round). You also earn XP: 25 for taking part, 15 per solve and 100 for a podium finish.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="conduct">
                <AccordionTrigger className="text-sm">Fair play</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">Solve on your own. Sharing solutions during a live round or using multiple accounts leads to disqualification.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>
      </div>
    </div>
  );
}
