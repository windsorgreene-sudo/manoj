import { cn } from "@/lib/utils";

const STYLES = {
  EASY: "bg-success/15 text-success",
  MEDIUM: "bg-warning/15 text-warning",
  HARD: "bg-danger/15 text-danger",
} as const;
const LABEL = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" } as const;

export function DifficultyBadge({ difficulty, className }: { difficulty: keyof typeof STYLES; className?: string }) {
  return <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-semibold", STYLES[difficulty], className)}>{LABEL[difficulty]}</span>;
}
