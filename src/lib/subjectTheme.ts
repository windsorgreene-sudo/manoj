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
  python: { color: "#2563eb", tint: "#e8effd", tintDark: "#16233f", label: "Py" },
  java: { color: "#d1621f", tint: "#fbeee1", tintDark: "#331f10", label: "J" },
  cpp: { color: "#7c3aed", tint: "#f0eafd", tintDark: "#241740", label: "C++" },
  csharp: { color: "#0d9488", tint: "#e0f5f2", tintDark: "#0d2f2b", label: "C#" },
  sql: { color: "#ca8a04", tint: "#faf1d8", tintDark: "#2f2510", label: "SQL" },
  "data-structures": { color: "#0f8a5f", tint: "#e2f5ec", tintDark: "#123123", label: "DS" },
  "computer-science": { color: "#158a6f", tint: "#e2f4f0", tintDark: "#0f2d28", label: "CS" },
  "cyber-security": { color: "#e11d48", tint: "#fce7ec", tintDark: "#33131c", label: "Sec" },
  "software-engineering": { color: "#0891b2", tint: "#e0f3f8", tintDark: "#0f2c33", label: "SE" },
  oose: { color: "#b45309", tint: "#f8ecdc", tintDark: "#2b1f10", label: "OO" },
  oopj: { color: "#c026a6", tint: "#fae7f5", tintDark: "#301a2c", label: "OOPJ" },
};

const FALLBACK: SubjectTheme = {
  color: "#0f8a5f",
  tint: "#e2f5ec",
  tintDark: "#123123",
  label: "CV",
};

export function subjectTheme(slug: string): SubjectTheme {
  return THEMES[slug] ?? FALLBACK;
}
