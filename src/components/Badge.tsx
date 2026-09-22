import type { ContentType, Difficulty } from "@/content/types";
import { CONTENT_TYPE_LABELS } from "@/content";

// Subtle content-type label. Deliberately understated — no loud colors.
export function TypeBadge({ type }: { type: ContentType }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-tag-bg px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-tag-text">
      {CONTENT_TYPE_LABELS[type]}
    </span>
  );
}

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  beginner: "text-emerald-700 dark:text-emerald-400",
  intermediate: "text-amber-700 dark:text-amber-400",
  advanced: "text-rose-700 dark:text-rose-400",
};

export function DifficultyLabel({ level }: { level: Difficulty }) {
  return (
    <span className={`text-xs font-medium capitalize ${DIFFICULTY_STYLE[level]}`}>
      {level}
    </span>
  );
}
