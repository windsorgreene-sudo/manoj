import Link from "next/link";
import type { ReactNode } from "react";

export function SidebarCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-xs)] transition-shadow duration-200 hover:shadow-[var(--shadow-sm)] ${className}`}
    >
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function TopicList({ topics, base }: { topics: string[]; base?: string }) {
  return (
    <ul className="space-y-1.5">
      {topics.map((t) => (
        <li key={t}>
          {base ? (
            <Link href={base} className="text-[13px] text-text-muted hover:text-primary">
              {t}
            </Link>
          ) : (
            <span className="text-[13px] text-text-muted">{t}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
