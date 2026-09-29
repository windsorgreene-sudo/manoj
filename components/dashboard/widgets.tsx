"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CalendarClock, CheckCircle2, Flame, Snowflake, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { ProgressRing } from "@/components/learn/course-enroll";
import { cn, formatDate } from "@/lib/utils";

export function XpBar({ level, current, needed, pct, xp }: { level: number; current: number; needed: number; pct: number; xp: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">Level {level}</span>
        <span className="text-xs text-muted-foreground">
          {current} / {needed} XP · {xp.toLocaleString("en-IN")} total
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Level ${level} progress`}>
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-r from-brand via-brand-soft to-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%]" />
        </motion.div>
      </div>
    </div>
  );
}

export function StreakCard({ current, longest, freezes, activeToday, atRisk }: { current: number; longest: number; freezes: number; activeToday: boolean; atRisk: boolean }) {
  return (
    <div className="glass flex h-full flex-col p-5">
      <p className="text-sm text-muted-foreground">Daily streak</p>
      <div className="mt-2 flex items-center gap-3">
        <Flame className={cn("size-12", current > 0 ? "flame text-warning" : "text-muted-foreground")} aria-hidden />
        <div>
          <p className="font-heading text-4xl font-bold">{current}</p>
          <p className="text-xs text-muted-foreground">days · best {longest}</p>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-cyan">
        <Snowflake className="size-3.5" /> {freezes} streak freeze{freezes === 1 ? "" : "s"} available
      </p>
      <p className={cn("mt-auto pt-3 text-xs", activeToday ? "text-success" : atRisk ? "text-warning" : "text-muted-foreground")}>
        {activeToday ? "✓ You've practised today" : atRisk ? "Solve or read something today to keep your streak!" : "Start a new streak today."}
      </p>
    </div>
  );
}

function useCountdown(to: string) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(to).getTime() - Date.now()));
    const first = window.setTimeout(tick, 0);
    const t = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(t);
    };
  }, [to]);
  const h = Math.floor(left / 3_600_000),
    m = Math.floor((left % 3_600_000) / 60_000),
    s = Math.floor((left % 60_000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function PotdCard({ potd }: { potd: { slug: string; title: string; difficulty: "EASY" | "MEDIUM" | "HARD"; topics: string[]; number: number; endsAt: string; solved: boolean } | null }) {
  const left = useCountdown(potd?.endsAt ?? new Date().toISOString());
  if (!potd) return null;
  return (
    <div className="glass gradient-border flex h-full flex-col p-5">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Target className="size-4 text-cyan" /> Problem of the Day
      </p>
      <h3 className="mt-2 text-lg font-semibold">
        {potd.number}. {potd.title}
      </h3>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={potd.difficulty} />
        <span className="text-xs text-muted-foreground">{potd.topics.slice(0, 2).join(" · ")}</span>
      </div>
      <p className="mt-3 flex items-center gap-1.5 font-mono text-sm" aria-label="Time remaining">
        <CalendarClock className="size-4 text-warning" /> {left} left
      </p>
      <div className="mt-auto pt-4">
        {potd.solved ? (
          <p className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="size-4" /> Solved today, nice!
          </p>
        ) : (
          <Button asChild className="w-full rounded-xl">
            <Link href={`/problems/${potd.slug}`}>Solve now</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export function ContinueCard({ items }: { items: { slug: string; title: string; color: string; pct: number; nextLesson: { slug: string; title: string } | null }[] }) {
  if (!items.length)
    return (
      <div className="glass flex h-full flex-col items-start justify-center gap-3 p-5">
        <p className="font-semibold">Start your first course</p>
        <p className="text-sm text-muted-foreground">Structured paths with progress tracking and certificates.</p>
        <Button asChild className="rounded-xl">
          <Link href="/courses">Browse courses</Link>
        </Button>
      </div>
    );
  const [first, ...rest] = items;
  return (
    <div className="glass flex h-full flex-col p-5">
      <p className="text-sm text-muted-foreground">Continue learning</p>
      <div className="mt-3 flex items-center gap-4">
        <ProgressRing pct={first.pct} size={72} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{first.title}</p>
          {first.nextLesson ? <p className="truncate text-sm text-muted-foreground">Next: {first.nextLesson.title}</p> : null}
        </div>
      </div>
      <Button asChild className="mt-4 rounded-xl">
        <Link href={first.nextLesson ? `/courses/${first.slug}/learn/${first.nextLesson.slug}` : `/courses/${first.slug}`}>Resume</Link>
      </Button>
      {rest.length ? (
        <ul className="mt-4 space-y-2 border-t border-border pt-3">
          {rest.map((c) => (
            <li key={c.slug}>
              <Link href={`/courses/${c.slug}`} className="flex items-center gap-3 text-sm hover:text-cyan">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <span className="block h-full bg-cyan" style={{ width: `${c.pct}%` }} />
                </span>
                <span className="w-40 truncate">{c.title}</span>
                <span className="w-9 text-right text-xs text-muted-foreground">{c.pct}%</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ContestsCard({ contests }: { contests: { slug: string; title: string; startsAt: string; endsAt: string; participants: number }[] }) {
  return (
    <div className="glass h-full p-5">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Trophy className="size-4 text-warning" /> Upcoming contests
      </p>
      {contests.length ? (
        <ul className="mt-3 space-y-3">
          {contests.map((c) => {
            const live = new Date(c.startsAt) <= new Date();
            return (
              <li key={c.slug}>
                <Link href={`/contests/${c.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-accent">
                  <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold", live ? "bg-danger text-white" : "bg-surface-2 text-muted-foreground")}>{live ? "LIVE" : "SOON"}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{c.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(c.startsAt, { dateStyle: "medium", timeStyle: "short" })} · {c.participants} registered
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No contests scheduled. Check back soon!</p>
      )}
    </div>
  );
}
