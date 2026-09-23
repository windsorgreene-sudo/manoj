import Link from "next/link";

const SUGGESTED = [
  { label: "C Programming", href: "/courses/c-programming" },
  { label: "Python", href: "/courses/python-programming" },
  { label: "Data Structures", href: "/courses/data-structures" },
  { label: "All subjects", href: "/courses" },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[600px] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="font-display text-5xl font-bold text-text-faint sm:text-6xl">404</span>
      <h1 className="font-display mt-3 text-2xl font-bold text-text">Page not found</h1>
      <p className="mt-2 text-[15px] text-text-muted">
        The page you are looking for may have been moved, or the link may be out of date.
      </p>
      <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-contrast transition-colors hover:bg-primary-hover"
        >
          Go to homepage
        </Link>
        <Link
          href="/courses"
          className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
        >
          Browse subjects
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
