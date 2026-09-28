import { cn } from "@/lib/utils";

export const VERDICT_LABEL: Record<string, string> = {
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
  RUNTIME_ERROR: "Runtime Error",
  COMPILATION_ERROR: "Compilation Error",
  INTERNAL_ERROR: "Judge Error",
  PENDING: "Pending",
};

export function VerdictText({ verdict, className }: { verdict: string; className?: string }) {
  return <span className={cn("font-semibold", verdict === "ACCEPTED" ? "text-success" : verdict === "PENDING" ? "text-muted-foreground" : "text-danger", className)}>{VERDICT_LABEL[verdict] ?? verdict}</span>;
}
