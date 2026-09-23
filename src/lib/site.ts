export const SITE = {
  name: "CodeVidya",
  tagline: "Learn. Practice. Ace your exams.",
  description:
    "Free exam-ready notes, tutorials, code examples, solved programs and MCQs for GGSIPU (IP University) BCA, B.Tech and MCA computer science subjects. Learn with a live code editor.",
  url: "https://codevidya.vercel.app",
  locale: "en_IN",
  author: "CodeVidya",
  founded: 2024,
  university: "Guru Gobind Singh Indraprastha University (GGSIPU)",
  universityShort: "GGSIPU",
};

// IPU programmes used for the homepage framing and quick-picks.
export const PROGRAMMES = [
  { code: "BCA", name: "Bachelor of Computer Applications", href: "/courses" },
  { code: "B.Tech CSE/IT", name: "B.Tech Computer Science / IT", href: "/courses" },
  { code: "MCA", name: "Master of Computer Applications", href: "/courses" },
  { code: "B.Sc CS", name: "B.Sc Computer Science", href: "/courses" },
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
