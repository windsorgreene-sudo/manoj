"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  completedLessons,
  getXP,
  levelForXP,
  recentCourses,
  type RecentCourse,
} from "@/lib/learning";
import { ArrowRight } from "@/components/icons";

interface Bookmark {
  slug: string;
  title: string;
  href: string;
}

const BADGES = [
  { icon: "🔥", name: "First Flame", need: 1, desc: "Complete your first lesson" },
  { icon: "📚", name: "Bookworm", need: 10, desc: "Complete 10 lessons" },
  { icon: "🎯", name: "Focused", need: 20, desc: "Complete 20 lessons" },
  { icon: "🏆", name: "Champion", need: 40, desc: "Complete 40 lessons" },
];

export default function StudentDashboard() {
  const [xp, setXp] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [recent, setRecent] = useState<RecentCourse[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setXp(getXP());
    setDoneCount(completedLessons().length);
    setRecent(recentCourses());
    try {
      setBookmarks(JSON.parse(localStorage.getItem("cv-bookmarks") || "[]"));
    } catch {}
    setLoaded(true);
  }, []);

  const { level, next, progress } = levelForXP(xp);
  const continueCourse = recent[0];

  const stats = [
    { label: "Lessons done", value: doneCount },
    { label: "Total XP", value: xp },
    { label: "Level", value: `${level.icon} ${level.name}` },
    { label: "Courses touched", value: recent.length },
  ];

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6">
      <Breadcrumbs items={[{ label: "Dashboard" }]} />

      {/* Welcome + level */}
      <header className="animate-fade-up mt-4 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-soft to-surface p-6 shadow-[var(--shadow-sm)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Your dashboard</p>
        <h1 className="font-display mt-1 text-2xl font-extrabold text-text sm:text-3xl">
          Welcome back, learner {level.icon}
        </h1>
        <div className="mt-4 max-w-md">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-semibold text-text">
              {level.name} · {xp} XP
            </span>
            {next && <span className="text-text-muted">Next: {next.icon} {next.name}</span>}
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 text-center shadow-[var(--shadow-xs)]">
            <div className="font-display text-xl font-bold text-primary">{s.value}</div>
            <div className="mt-0.5 text-xs text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Continue learning */}
      {loaded && continueCourse && (
        <Link
          href={`/courses/${continueCourse.slug}`}
          className="hover-lift group mt-6 flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary-soft p-5"
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl text-white"
            style={{ background: continueCourse.color }}
          >
            {continueCourse.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Continue learning</p>
            <p className="mt-0.5 truncate text-lg font-bold text-text">{continueCourse.title}</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Badges */}
        <section>
          <h2 className="font-display mb-3 border-b border-border pb-2 text-lg font-bold text-text">
            Achievements
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {BADGES.map((b) => {
              const earned = doneCount >= b.need;
              return (
                <div
                  key={b.name}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    earned
                      ? "border-primary/40 bg-surface animate-pop"
                      : "border-border bg-surface-2 opacity-60"
                  }`}
                  title={b.desc}
                >
                  <div className={`text-3xl ${earned ? "" : "grayscale"}`}>{earned ? b.icon : "🔒"}</div>
                  <div className="mt-1 text-sm font-semibold text-text">{b.name}</div>
                  <div className="text-[11px] text-text-faint">{b.desc}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bookmarks */}
        <section id="bookmarks" className="scroll-mt-24">
          <h2 className="font-display mb-3 border-b border-border pb-2 text-lg font-bold text-text">
            Bookmarks
          </h2>
          {loaded && bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-6 text-center text-sm text-text-muted">
              No bookmarks yet. Save lessons to find them here.
            </div>
          ) : (
            <ul className="space-y-2">
              {bookmarks.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={b.href}
                    className="block rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
                  >
                    {b.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
