export type NavItem = { href: string; label: string; description?: string; key?: string };

export const primaryNav: NavItem[] = [
  { href: "/courses", label: "Courses", key: "courses" },
  { href: "/tutorials", label: "Tutorials", key: "tutorials" },
  { href: "/problems", label: "Problems", key: "problems" },
  { href: "/contests", label: "Contests", key: "contests" },
  { href: "/doubts", label: "Doubts Forum", key: "doubts" },
];

export const practiceNav: NavItem[] = [
  { href: "/playground", label: "Playground", key: "playground", description: "Online compiler for 6 languages" },
  { href: "/sheets", label: "DSA Sheets", key: "sheets", description: "Curated topic & company sheets" },
  { href: "/roadmaps", label: "Roadmaps", key: "roadmaps", description: "Interactive learning paths" },
  { href: "/visualizers", label: "Visualizers", key: "visualizers", description: "Watch algorithms run step by step" },
  { href: "/lab", label: "3D DS Lab", key: "lab", description: "Explore trees & graphs in 3D" },
  { href: "/quizzes", label: "Quizzes & Mock Tests", key: "quizzes", description: "Timed tests with analysis" },
  { href: "/doubts", label: "Doubts Forum", key: "doubts", description: "Ask, answer, get unstuck" },
];

export const footerNav: { title: string; key: string; items: NavItem[] }[] = [
  {
    title: "Learn",
    key: "learn",
    items: [
      { href: "/courses", label: "Courses", key: "courses" },
      { href: "/tutorials", label: "Tutorials", key: "tutorials" },
      { href: "/roadmaps", label: "Roadmaps", key: "roadmaps" },
      { href: "/blog", label: "Blog", key: "blog" },
    ],
  },
  {
    title: "Practice",
    key: "practice",
    items: [
      { href: "/problems", label: "Problems", key: "problems" },
      { href: "/sheets", label: "DSA Sheets", key: "sheets" },
      { href: "/playground", label: "Playground", key: "playground" },
      { href: "/visualizers", label: "Visualizers", key: "visualizers" },
    ],
  },
  {
    title: "Compete",
    key: "compete",
    items: [
      { href: "/contests", label: "Contests", key: "contests" },
      { href: "/quizzes", label: "Mock Tests", key: "mockTests" },
      { href: "/doubts", label: "Doubts Forum", key: "doubts" },
      { href: "/leaderboard", label: "Leaderboard", key: "leaderboard" },
    ],
  },
  {
    title: "Company",
    key: "company",
    items: [
      { href: "/about", label: "About", key: "about" },
      { href: "/contact", label: "Contact", key: "contact" },
      { href: "/write-for-us", label: "Write for Us", key: "writeForUs" },
    ],
  },
];
