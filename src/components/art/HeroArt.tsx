// A stylized code-editor illustration for the hero. Inline SVG, theme-aware
// through CSS variables, with a gentle floating motion (disabled for users who
// prefer reduced motion, via the global CSS guard).

export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 360"
      className={className}
      role="img"
      aria-label="Illustration of a code editor with lessons and progress"
      fill="none"
    >
      <defs>
        <linearGradient id="cv-hero-window" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--surface)" />
          <stop offset="1" stopColor="var(--surface-2)" />
        </linearGradient>
        <linearGradient id="cv-hero-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>

      {/* Back card */}
      <g className="cv-float-slow">
        <rect x="250" y="40" width="170" height="120" rx="14" fill="var(--surface)" stroke="var(--border)" />
        <rect x="268" y="60" width="90" height="10" rx="5" fill="var(--primary)" opacity="0.5" />
        <rect x="268" y="80" width="130" height="8" rx="4" fill="var(--border-strong)" />
        <rect x="268" y="96" width="110" height="8" rx="4" fill="var(--border-strong)" />
        <rect x="268" y="120" width="70" height="24" rx="12" fill="url(#cv-hero-accent)" />
      </g>

      {/* Main editor window */}
      <g className="cv-float">
        <rect x="30" y="70" width="290" height="220" rx="16" fill="url(#cv-hero-window)" stroke="var(--border)" />
        {/* Title bar */}
        <rect x="30" y="70" width="290" height="34" rx="16" fill="var(--surface-2)" />
        <circle cx="52" cy="87" r="5" fill="#ff5f57" />
        <circle cx="70" cy="87" r="5" fill="#febc2e" />
        <circle cx="88" cy="87" r="5" fill="#28c840" />
        <rect x="120" y="82" width="90" height="10" rx="5" fill="var(--border-strong)" />

        {/* Code lines */}
        <rect x="52" y="126" width="30" height="9" rx="4.5" fill="var(--primary)" />
        <rect x="90" y="126" width="80" height="9" rx="4.5" fill="var(--text-faint)" />
        <rect x="52" y="148" width="120" height="9" rx="4.5" fill="var(--text-faint)" opacity="0.6" />
        <rect x="70" y="170" width="150" height="9" rx="4.5" fill="var(--accent)" opacity="0.8" />
        <rect x="70" y="192" width="100" height="9" rx="4.5" fill="var(--text-faint)" opacity="0.6" />
        <rect x="52" y="214" width="60" height="9" rx="4.5" fill="var(--primary)" opacity="0.7" />
        <rect x="52" y="246" width="200" height="26" rx="8" fill="url(#cv-hero-accent)" opacity="0.9" />
      </g>

      {/* Floating check badge */}
      <g className="cv-float-fast">
        <circle cx="360" cy="230" r="34" fill="var(--surface)" stroke="var(--border)" />
        <circle cx="360" cy="230" r="34" fill="url(#cv-hero-accent)" opacity="0.12" />
        <path d="M346 230l9 9 18-18" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
