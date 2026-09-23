"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLessonComplete, markComplete, toggleComplete } from "@/lib/learning";
import { fireConfetti } from "@/components/ConfettiBurst";
import { CheckIcon } from "@/components/icons";

export function MarkComplete({
  courseSlug,
  lessonSlug,
  nextHref,
}: {
  courseSlug: string;
  lessonSlug: string;
  nextHref?: string;
}) {
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(isLessonComplete(courseSlug, lessonSlug));
  }, [courseSlug, lessonSlug]);

  const onComplete = () => {
    if (done) {
      toggleComplete(courseSlug, lessonSlug);
      setDone(false);
      return;
    }
    const newly = markComplete(courseSlug, lessonSlug);
    setDone(true);
    if (newly) fireConfetti();
    if (nextHref) setTimeout(() => router.push(nextHref), 650);
  };

  return (
    <button
      onClick={onComplete}
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 ${
        done
          ? "border border-ok bg-ok-soft text-ok"
          : "bg-primary text-primary-contrast hover:bg-primary-hover hover:shadow-[var(--shadow-primary)]"
      }`}
    >
      <CheckIcon className="h-4 w-4" />
      {done ? "Completed" : "Mark complete +10 XP"}
    </button>
  );
}
