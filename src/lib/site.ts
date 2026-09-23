export const SITE = {
  name: "EduLearn",
  tagline: "Learn. Code. Build.",
  description:
    "Animated tutorials, a live code editor, and expert-crafted courses for developers at every level. Learn web development, Python, data structures, databases and more, for free.",
  url: "https://codevidya.vercel.app",
  locale: "en",
  author: "EduLearn",
  founded: 2024,
};

// Top-level learning tracks used for the homepage roadmap and quick-picks.
export const PROGRAMMES = [
  { code: "Web Dev", name: "Web Development Path", href: "/courses" },
  { code: "Python", name: "Python & Data", href: "/courses" },
  { code: "DSA", name: "Data Structures & Algorithms", href: "/courses" },
  { code: "Backend", name: "Backend & Databases", href: "/courses" },
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
