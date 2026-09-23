import Link from "next/link";

// The CodeVidya logo: an SVG mark (graduation cap + code caret) plus the
// wordmark. Sizes scale via the `size` prop. Mark uses the brand gradient.
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="CodeVidya logo" fill="none">
      <defs>
        <linearGradient id="el-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#el-logo-grad)" />
      {/* graduation cap */}
      <path d="M20 11 8.5 16 20 21l11.5-5L20 11z" fill="#fff" opacity="0.95" />
      <path d="M13.5 18.5V24c0 1.6 2.9 3 6.5 3s6.5-1.4 6.5-3v-5.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" fill="none" />
      <path d="M31 16v6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
      {/* code caret accent */}
      <path d="M17.5 30.5 20 33l2.5-2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
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
