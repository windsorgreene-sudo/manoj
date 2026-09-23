import Link from "next/link";
import { subjectTheme } from "@/lib/subjectTheme";

interface MarqueeItem {
  label: string;
  href: string;
  slug: string;
}

// A slow, seamless horizontal ticker of subject chips. Pauses on hover.
// The list is duplicated so the -50% translate loops seamlessly.
export function Marquee({ items }: { items: MarqueeItem[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="group relative overflow-hidden py-1">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
      <div className="marquee gap-3">
        {doubled.map((it, i) => {
          const theme = subjectTheme(it.slug);
          return (
            <Link
              key={`${it.slug}-${i}`}
              href={it.href}
              aria-hidden={i >= items.length}
              tabIndex={i >= items.length ? -1 : 0}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-[var(--shadow-xs)] transition-colors hover:border-primary hover:text-primary"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: theme.color }}
                aria-hidden
              />
              {it.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
