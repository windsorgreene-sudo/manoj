"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SubjectIcon } from "@/components/SubjectIcon";
import { BookmarkIcon, ClockIcon, ArrowRight } from "@/components/icons";

interface Bookmark {
  slug: string;
  title: string;
  href: string;
}
interface Viewed {
  slug: string;
  title: string;
  href: string;
  category: string;
  categoryName: string;
  viewedAt: number;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const d = Math.floor(hr / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export default function StudentDashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [viewed, setViewed] = useState<Viewed[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookmarks(JSON.parse(localStorage.getItem("cv-bookmarks") || "[]"));
      setViewed(JSON.parse(localStorage.getItem("cv-recently-viewed") || "[]"));
    } catch {}
    setLoaded(true);
  }, []);

  const continueItem = viewed[0];

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6">
      <Breadcrumbs items={[{ label: "My Dashboard" }]} />

      <header className="animate-fade-up mt-4 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary-soft to-surface p-6 shadow-[var(--shadow-sm)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Student portal</p>
        <h1 className="font-display mt-1 text-2xl font-bold text-text sm:text-3xl">My Dashboard</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-text-muted">
          Your bookmarks, recently viewed lessons and quick access to study material. Everything is
          saved on this device.
        </p>
      </header>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Bookmarks", value: bookmarks.length },
          { label: "Lessons viewed", value: viewed.length },
          { label: "Subjects touched", value: new Set(viewed.map((v) => v.category)).size },
          { label: "Streak", value: viewed.length > 0 ? "Active" : "-" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-4 text-center shadow-[var(--shadow-xs)]">
            <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
            <div className="mt-0.5 text-xs text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Continue learning */}
      {loaded && continueItem && (
        <Link
          href={continueItem.href}
          className="hover-lift group mt-6 flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary-soft p-5"
        >
          <SubjectIcon slug={continueItem.category} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Continue learning</p>
            <p className="mt-0.5 truncate text-lg font-bold text-text">{continueItem.title}</p>
            <p className="text-[13px] text-text-muted">{continueItem.categoryName}</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Bookmarks */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 border-b border-border pb-2 text-lg font-bold text-text">
            <BookmarkIcon className="h-4 w-4 text-primary" /> Your Bookmarks
          </h2>
          {loaded && bookmarks.length === 0 ? (
            <EmptyState
              text="No bookmarks yet. Tap the Bookmark button on any lesson to save it here."
              href="/tutorials"
              cta="Browse tutorials"
            />
          ) : (
            <ul className="space-y-2">
              {bookmarks.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={b.href}
                    className="block rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
                  >
                    {b.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recently viewed */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 border-b border-border pb-2 text-lg font-bold text-text">
            <ClockIcon className="h-4 w-4 text-primary" /> Recently Viewed
          </h2>
          {loaded && viewed.length === 0 ? (
            <EmptyState
              text="Lessons you open will appear here so you can pick up where you left off."
              href="/tutorials"
              cta="Start learning"
            />
          ) : (
            <ul className="space-y-2">
              {viewed.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={v.href}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary"
                  >
                    <SubjectIcon slug={v.category} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-text">{v.title}</span>
                      <span className="text-xs text-text-faint">
                        {v.categoryName} · {timeAgo(v.viewedAt)}
                      </span>
                    </span>
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

function EmptyState({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border-strong bg-surface p-6 text-center">
      <p className="text-sm text-text-muted">{text}</p>
      <Link href={href} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
        {cta} →
      </Link>
    </div>
  );
}
