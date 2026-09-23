import Link from "next/link";

const SUGGESTED = [
  { label: "Python", href: "/python" },
  { label: "Java", href: "/java" },
  { label: "Data Structures", href: "/data-structures" },
  { label: "Study Resources", href: "/resources" },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[600px] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="font-display animate-fade-up bg-gradient-to-r from-primary to-accent bg-clip-text text-6xl font-extrabold text-transparent sm:text-7xl">
        404
      </span>
      <h1 className="font-display animate-fade-up mt-3 text-2xl font-bold text-text" style={{ animationDelay: "60ms" }}>
        Page not found
      </h1>
      <p className="animate-fade-up mt-2 text-[15px] text-text-muted" style={{ animationDelay: "120ms" }}>
        The page you are looking for may have been moved, or the link may be out of date.
      </p>
      <div className="animate-fade-up mt-6 flex w-full flex-col justify-center gap-3 sm:flex-row" style={{ animationDelay: "180ms" }}>
        <Link
          href="/"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-contrast shadow-[var(--shadow-sm)] transition-all hover:bg-primary-hover hover:shadow-[var(--shadow-primary)]"
        >
          Go to homepage
        </Link>
        <Link
          href="/tutorials"
          className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
        >
          Browse tutorials
        </Link>
      </div>
      <div className="mt-8 w-full">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-faint">
          Popular sections
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-full border border-border bg-surface px-3 py-1 text-[13px] font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
