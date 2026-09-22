import type { ContentType, Difficulty } from "@/content/types";
import { CONTENT_TYPE_LABELS } from "@/content";

// Content-type label. Kept subtle, but resource types (assignment/lab/mcq) get a
// faint warm tint so students can spot practice material quickly.
const PRACTICE: ContentType[] = ["assignment", "lab", "mcq", "test", "question-paper"];

export function TypeBadge({ type }: { type: ContentType }) {
  const isPractice = PRACTICE.includes(type);
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
        isPractice
          ? "bg-accent-soft text-accent"
          : "bg-tag-bg text-tag-text"
      }`}
    >
      {CONTENT_TYPE_LABELS[type]}
    </span>
  );
}

const DIFFICULTY: Record<Difficulty, { label: string; dot: string; text: string }> = {
  beginner: { label: "Beginner", dot: "bg-ok", text: "text-ok" },
  intermediate: { label: "Intermediate", dot: "bg-warn", text: "text-warn" },
  advanced: { label: "Advanced", dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
};

export function DifficultyLabel({ level }: { level: Difficulty }) {
  const d = DIFFICULTY[level];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${d.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${d.dot}`} aria-hidden />
      {d.label}
    </span>
  );
}
