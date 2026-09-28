import type { ReactNode } from "react";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = {
  tip: { Icon: Lightbulb, cls: "border-success/40 bg-success/10", label: "Tip" },
  info: { Icon: Info, cls: "border-cyan/40 bg-cyan/10", label: "Note" },
  warning: { Icon: AlertTriangle, cls: "border-warning/40 bg-warning/10", label: "Warning" },
} as const;

export function Callout({ type = "info", children }: { type?: keyof typeof STYLES; children: ReactNode }) {
  const s = STYLES[type] ?? STYLES.info;
  return (
    <aside className={cn("my-6 flex gap-3 rounded-2xl border p-4 text-[0.95rem] [&>div>p]:my-0", s.cls)} role="note" aria-label={s.label}>
      <s.Icon className="mt-1 size-5 shrink-0" aria-hidden />
      <div>{children}</div>
    </aside>
  );
}
