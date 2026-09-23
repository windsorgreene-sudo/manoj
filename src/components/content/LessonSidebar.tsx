"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Course } from "@/content/courses";
import { lessonCount } from "@/content/courses";
import { completedLessons } from "@/lib/learning";
import { CheckIcon } from "@/components/icons";

export function LessonSidebar({
  course,
  currentSlug,
}: {
  course: Course;
  currentSlug: string;
}) {
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(new Set(completedLessons()));
  }, []);

  const total = lessonCount(course);
  const doneCount = Array.from(done).filter((k) => k.startsWith(`${course.slug}/`)).length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="flex h-full flex-col">
      <Link
        href={`/courses/${course.slug}`}
        className="flex items-center gap-2 text-sm font-semibold text-text hover:text-primary"
      >
        <span aria-hidden>←</span>
        <span className="truncate">{course.title}</span>
      </Link>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-text-muted">
          <span>{doneCount} of {total} done</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <nav className="mt-4 space-y-4 overflow-y-auto pr-1">
        {course.chapters.map((chapter, ci) => (
          <div key={ci}>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-faint">
              {chapter.title}
            </p>
            <ul className="space-y-0.5">
              {chapter.lessons.map((lesson) => {
                const isCurrent = lesson.slug === currentSlug;
                const isDone = done.has(`${course.slug}/${lesson.slug}`);
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/courses/${course.slug}/${lesson.slug}`}
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        isCurrent
                          ? "bg-primary-soft font-semibold text-primary"
                          : "text-text-muted hover:bg-surface-2 hover:text-text"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                          isDone ? "border-ok bg-ok text-white" : isCurrent ? "border-primary" : "border-border-strong"
                        }`}
                      >
                        {isDone ? <CheckIcon className="h-2.5 w-2.5" /> : ""}
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">{lesson.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
