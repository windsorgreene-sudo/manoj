export const SITE = {
  name: "CodeVidya",
  tagline: "Learn. Practice. Understand.",
  description:
    "Practical tutorials, notes, assignments, lab work, programming concepts and examination resources for computer science and programming students.",
  url: "https://www.codevidya.in",
  locale: "en_IN",
  author: "Manoj Purohit",
  founded: 2017,
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
