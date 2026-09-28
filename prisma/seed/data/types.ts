export type SeedQuizQ = { q: string; options: string[]; answer: number; explanation: string };

export type SeedArticle = {
  slug: string;
  title: string;
  category: "dsa" | "python" | "javascript" | "web-development" | "dbms" | "operating-systems" | "blog";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  excerpt: string;
  tags: string[];
  content: string;
  quiz?: SeedQuizQ[];
};
