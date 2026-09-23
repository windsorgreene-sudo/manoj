import Link from "next/link";

// The CodeVidya logo: an SVG mark (a stylised open book + code caret) plus the
// wordmark. Sizes scale via the `size` prop. Mark uses the brand gradient.
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="CodeVidya logo" fill="none">
      <defs>
        <linearGradient id="cv-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#cv-logo-grad)" />
      {/* open book pages */}
      <path
        d="M20 12c-2.2-1.4-5-2-8-2v14c3 0 5.8.6 8 2 2.2-1.4 5-2 8-2V10c-3 0-5.8.6-8 2z"
        fill="#fff"
        opacity="0.92"
      />
      <path d="M20 12v14" stroke="var(--primary)" strokeWidth="1.4" opacity="0.5" />
      {/* code caret */}
      <path
        d="M15.5 17.5 13.5 19l2 1.5M24.5 17.5l2 1.5-2 1.5"
        stroke="var(--primary)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const mark = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const text = size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2" aria-label="CodeVidya home">
      <LogoMark
        className={`${mark} shadow-[var(--shadow-primary)] rounded-[10px] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}
      />
      <span className={`font-display ${text} font-bold tracking-tight text-text`}>
        Code<span className="text-primary">Vidya</span>
      </span>
    </Link>
  );
}
