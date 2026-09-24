import Link from "next/link";
import { Reveal } from "@/components/Reveal";

interface Node {
  label: string;
  icon: string;
  href: string;
}

// A visual horizontal learning path. Nodes are clickable; on mobile it becomes
// a scrollable row. Connecting lines are drawn with a simple flex layout.
export function Roadmap({ title, nodes }: { title: string; nodes: Node[] }) {
  return (
    <Reveal as="div" className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <p className="mb-4 text-sm font-semibold text-text">{title}</p>
      <div className="no-scrollbar flex items-center gap-0 overflow-x-auto pb-1">
        {nodes.map((n, i) => (
          <div key={n.label} className="flex shrink-0 items-center">
            <Link
              href={n.href}
              className="group flex flex-col items-center gap-1.5"
              title={n.label}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-2 text-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-[var(--shadow-md)]">
                {n.icon}
              </span>
              <span className="text-xs font-medium text-text-muted group-hover:text-primary">
                {n.label}
              </span>
            </Link>
            {i < nodes.length - 1 && (
              <span
                className="mx-2 h-0.5 w-8 shrink-0 rounded-full bg-gradient-to-r from-primary/50 to-accent/50 sm:w-12"
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
