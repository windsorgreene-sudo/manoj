// Per-subject visual identity. Each category gets a distinct, muted color so
// students can recognise a subject at a glance. Colors are calm (not neon) and
// each ships a light tint for backgrounds that works in light and dark mode.
//
// `label` is the compact badge text shown inside the colored tile.

export interface SubjectTheme {
  /** Solid accent color (text/background on the tile). */
  color: string;
  /** Very light tint for card backgrounds. */
  tint: string;
  /** Tint for dark mode. */
  tintDark: string;
  /** Short monogram shown in the icon tile, e.g. "Py", "J", "C++". */
  label: string;
}

const THEMES: Record<string, SubjectTheme> = {
  python: { color: "#2f6fb0", tint: "#eaf1f9", tintDark: "#16283a", label: "Py" },
  java: { color: "#c05a2a", tint: "#fbeee5", tintDark: "#331f13", label: "J" },
  cpp: { color: "#7a54c0", tint: "#f0eafa", tintDark: "#241834", label: "C++" },
  csharp: { color: "#118a6f", tint: "#e4f5f0", tintDark: "#0f2f28", label: "C#" },
  sql: { color: "#b07d17", tint: "#faf1dc", tintDark: "#2f2510", label: "SQL" },
  "data-structures": { color: "#1668a8", tint: "#e6f0fa", tintDark: "#132c3f", label: "DS" },
  "computer-science": { color: "#4a5aa8", tint: "#ebedf8", tintDark: "#1b2038", label: "CS" },
  "cyber-security": { color: "#b03a4a", tint: "#fbe9ec", tintDark: "#331519", label: "Sec" },
  "software-engineering": { color: "#2b7d8a", tint: "#e4f2f4", tintDark: "#122b2f", label: "SE" },
  oose: { color: "#8a5a2b", tint: "#f6ede3", tintDark: "#2b2013", label: "OO" },
  oopj: { color: "#a34b8a", tint: "#f8e9f3", tintDark: "#301b2a", label: "OOPJ" },
};

const FALLBACK: SubjectTheme = {
  color: "#1668a8",
  tint: "#e6f0fa",
  tintDark: "#132c3f",
  label: "CV",
};

export function subjectTheme(slug: string): SubjectTheme {
  return THEMES[slug] ?? FALLBACK;
}
