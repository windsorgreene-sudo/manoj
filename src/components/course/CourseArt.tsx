// Decorative SVG artwork for course headers. A soft, on-brand illustration
// (concentric rings + code glyphs) tinted with the course colour. Inline SVG,
// so it is crisp and needs no network request.
export function CourseArt({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 240 160"
      className={className}
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`ca-${color.replace("#", "")}`} cx="70%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#ca-${color.replace("#", "")})`} />
      {/* concentric rings */}
      <circle cx="196" cy="40" r="70" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" />
      <circle cx="196" cy="40" r="46" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" />
      <circle cx="196" cy="40" r="24" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2" />
      {/* code glyphs */}
      <path
        d="M28 112l-12 10 12 10M64 112l12 10-12 10M52 106l-16 40"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* dots */}
      <circle cx="120" cy="28" r="3" fill="#ffffff" fillOpacity="0.5" />
      <circle cx="150" cy="120" r="3" fill="#ffffff" fillOpacity="0.4" />
      <circle cx="96" cy="70" r="2.5" fill="#ffffff" fillOpacity="0.45" />
    </svg>
  );
}
