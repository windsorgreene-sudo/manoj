"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Course } from "@/content/courses";
import { completedLessons } from "@/lib/learning";
import { ClockIcon, CheckIcon } from "@/components/icons";

export function CourseChapters({ course }: { course: Course }) {
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(new Set(completedLessons()));
  }, []);

  return (
    <div className="space-y-4">
      {course.chapters.map((chapter, ci) => (
        <div key={ci} className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border bg-surface-2 px-5 py-3">
            <h3 className="font-display font-bold text-text">
              <span className="mr-2 text-text-faint">{ci + 1}.</span>
              {chapter.title}
            </h3>
            <span className="text-xs text-text-faint">{chapter.lessons.length} lessons</span>
          </div>
          <ul className="divide-y divide-border">
            {chapter.lessons.map((lesson) => {
              const isDone = done.has(`${course.slug}/${lesson.slug}`);
              return (
                <li key={lesson.slug}>
                  <Link
                    href={`/courses/${course.slug}/${lesson.slug}`}
                    className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-2"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                        isDone
                          ? "border-ok bg-ok text-white"
                          : "border-border-strong text-text-faint"
                      }`}
                    >
                      {isDone ? <CheckIcon className="h-3.5 w-3.5" /> : ""}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium text-text group-hover:text-primary">
                      {lesson.title}
                    </span>
                    {lesson.duration && (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-text-faint">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {lesson.duration}m
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
