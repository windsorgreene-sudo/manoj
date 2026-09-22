// Core content model for the CodeVidya learning portal.
// This mirrors a real CMS schema so a full Blogger migration can be
// dropped in later without changing the rendering layer.

export type ContentType =
  | "tutorial"
  | "article"
  | "assignment"
  | "lab"
  | "notes"
  | "question-paper"
  | "mcq"
  | "test"
  | "syllabus"
  | "resource";

export type Difficulty = "beginner" | "intermediate" | "advanced";

/** Supported reading languages. "hi" here means Hinglish (Roman-script Hindi). */
export type Lang = "en" | "hi";

/**
 * A piece of text that may be available in more than one language.
 * A plain string means English-only (Hinglish falls back to it).
 * An object provides English plus an optional Hinglish version.
 */
export type Localized = string | { en: string; hi?: string };

/** Read a Localized value for the requested language, falling back to English. */
export function t(value: Localized, lang: Lang): string {
  if (typeof value === "string") return value;
  if (lang === "hi" && value.hi) return value.hi;
  return value.en;
}

export interface Author {
  id: string;
  name: string;
  role: string;
}

export interface Category {
  /** URL slug, e.g. "python" */
  slug: string;
  /** Display name, e.g. "Python Programming" */
  name: string;
  /** Short label used in compact nav/blocks, e.g. "Python" */
  shortName: string;
  description: string;
  /** Top-level nav group this category belongs to. */
  group: NavGroup;
  /** Ordered list of subcategory slugs for the category landing page. */
  subcategories: Subcategory[];
  /** Popular topic labels shown in sidebars. */
  popularTopics: string[];
  order: number;
}

export interface Subcategory {
  slug: string;
  name: string;
}

export type NavGroup =
  | "tutorials"
  | "programming"
  | "web-development"
  | "computer-science"
  | "cyber-security"
  | "software-engineering"
  | "assignments"
  | "lab-work"
  | "exam-preparation"
  | "notes";

export interface CodeBlock {
  language: string;
  code: string;
  /** Optional caption rendered above the block. */
  caption?: string;
}

export type ContentNode =
  | { type: "heading"; level: 2 | 3; id: string; text: Localized }
  | { type: "paragraph"; text: Localized }
  | { type: "list"; ordered?: boolean; items: Localized[] }
  | { type: "code"; block: CodeBlock }
  | { type: "note"; variant: "info" | "warning" | "tip"; text: Localized }
  | { type: "table"; headers: Localized[]; rows: Localized[][] }
  /** A highlighted key-points / summary box, great for quick revision. */
  | { type: "keypoints"; title?: Localized; items: Localized[] };

export interface Article {
  slug: string;
  title: string;
  /** Optional Hinglish version of the title, shown when Hinglish is selected. */
  titleHi?: string;
  /** SEO/meta description and listing summary. */
  description: string;
  /** Optional Hinglish version of the description. */
  descriptionHi?: string;
  category: string; // Category slug
  subcategory?: string; // Subcategory slug
  contentType: ContentType;
  tags: string[];
  authorId: string;
  publishedDate: string; // ISO date
  updatedDate: string; // ISO date
  difficulty?: Difficulty;
  readingMinutes: number;
  /** Original Blogger URL preserved for redirects/migration. */
  legacyUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  popular?: boolean;
  body: ContentNode[];
}

export interface Resource {
  slug: string;
  title: string;
  description: string;
  contentType: ContentType;
  category: string;
  updatedDate: string;
}
