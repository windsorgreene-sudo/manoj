export type NavItem = { href: string; label: string; description?: string };

export const primaryNav: NavItem[] = [
  { href: "/courses", label: "Courses" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/problems", label: "Problems" },
  { href: "/contests", label: "Contests" },
  { href: "/pricing", label: "Pricing" },
];

export const practiceNav: NavItem[] = [
  { href: "/playground", label: "Playground", description: "Online compiler for 6 languages" },
  { href: "/sheets", label: "DSA Sheets", description: "Curated topic & company sheets" },
  { href: "/roadmaps", label: "Roadmaps", description: "Interactive learning paths" },
  { href: "/visualizers", label: "Visualizers", description: "Watch algorithms run step by step" },
  { href: "/lab", label: "3D DS Lab", description: "Explore trees & graphs in 3D" },
  { href: "/quizzes", label: "Quizzes & Mock Tests", description: "Timed tests with analysis" },
  { href: "/doubts", label: "Doubts Forum", description: "Ask, answer, get unstuck" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Learn",
    items: [
      { href: "/courses", label: "Courses" },
      { href: "/tutorials", label: "Tutorials" },
      { href: "/roadmaps", label: "Roadmaps" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Practice",
    items: [
      { href: "/problems", label: "Problems" },
      { href: "/sheets", label: "DSA Sheets" },
      { href: "/playground", label: "Playground" },
      { href: "/visualizers", label: "Visualizers" },
    ],
  },
  {
    title: "Compete",
    items: [
      { href: "/contests", label: "Contests" },
      { href: "/quizzes", label: "Mock Tests" },
      { href: "/doubts", label: "Doubts Forum" },
      { href: "/leaderboard", label: "Leaderboard" },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/write-for-us", label: "Write for Us" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
];
