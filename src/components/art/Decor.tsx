// Lightweight, theme-aware decorative SVG graphics. All inline (no network
// requests), so they are crisp on every screen and cost nothing to load.

// A soft dotted grid used behind hero / section backgrounds.
export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      aria-hidden
      focusable="false"
    >
      <defs>
        <pattern id="cv-dotgrid" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cv-dotgrid)" />
    </svg>
  );
}

// A subtle grid-lines pattern (blueprint feel) for section backgrounds.
export function GridLines({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" aria-hidden focusable="false">
      <defs>
        <pattern id="cv-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cv-grid)" />
    </svg>
  );
}
