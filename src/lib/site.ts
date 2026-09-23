export const SITE = {
  name: "CodeVidya",
  tagline: "Learn. Practice. Understand.",
  description:
    "Study material for GGSIPU (IP University) students: semester-wise notes, tutorials, lab programs, assignments, previous year questions and exam preparation for BCA, B.Tech and MCA computer subjects.",
  url: "https://codevidya.vercel.app",
  locale: "en_IN",
  author: "Manoj Purohit",
  founded: 2017,
  university: "Guru Gobind Singh Indraprastha University (GGSIPU)",
  universityShort: "GGSIPU",
};

// Programmes CodeVidya organises material around. Used for quick-picks and
// framing content by course. These are the common IPU computer programmes.
export const PROGRAMMES = [
  { code: "BCA", name: "Bachelor of Computer Applications", href: "/tutorials" },
  { code: "B.Tech CSE/IT", name: "B.Tech (CSE / IT)", href: "/tutorials" },
  { code: "MCA", name: "Master of Computer Applications", href: "/tutorials" },
  { code: "B.Sc CS", name: "B.Sc (Computer Science)", href: "/tutorials" },
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
