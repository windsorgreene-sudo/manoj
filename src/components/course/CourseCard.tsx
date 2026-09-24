"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Course } from "@/content/courses";
import { lessonCount, totalMinutes } from "@/content/courses";
import { courseCompletedCount } from "@/lib/learning";
import { CourseArt } from "./CourseArt";
import { ClockIcon } from "@/components/icons";

const DIFF_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function CourseCard({ course }: { course: Course }) {
  const total = lessonCount(course);
  const mins = totalMinutes(course);
  const [done, setDone] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(courseCompletedCount(course.slug));
  }, [course.slug]);

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const started = done > 0;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="sheen hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
    >
      {/* Gradient header */}
      <div
        className="relative flex h-24 items-center justify-between overflow-hidden px-5"
        style={{
          background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)`,
        }}
      >
        <CourseArt color={course.color} className="pointer-events-none absolute inset-0 h-full w-full" />
        <span className="relative text-4xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
          {course.icon}
        </span>
        <span className="relative rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
          {DIFF_LABEL[course.difficulty]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-text transition-colors group-hover:text-primary">
          {course.title}
        </h3>
        <p className="clamp-2 mt-1 flex-1 text-sm text-text-muted">{course.description}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-text-faint">
          <span>{total} lessons</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            {Math.max(1, Math.round(mins / 60))} hr
          </span>
        </div>

        {started ? (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-primary">{pct}% complete</span>
              <span className="text-text-faint">
                {done}/{total}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Start learning
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        )}
      </div>
    </Link>
  );
}
