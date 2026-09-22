import { articles, getArticle, getArticlesByCategory, getArticlesByType } from "./articles";
import { categories, getCategory, getCategoriesByGroup, NAV_GROUPS } from "./categories";
import { authors, getAuthor } from "./authors";
import type { Article, ContentType } from "./types";

export { articles, categories, authors, NAV_GROUPS };
export { getArticle, getCategory, getAuthor, getArticlesByCategory, getArticlesByType, getCategoriesByGroup };

const byUpdatedDesc = (a: Article, b: Article) =>
  new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();

const byPublishedDesc = (a: Article, b: Article) =>
  new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();

export function getLatestArticles(limit = 6): Article[] {
  return [...articles].sort(byPublishedDesc).slice(0, limit);
}

export function getRecentlyUpdated(limit = 6): Article[] {
  return [...articles].sort(byUpdatedDesc).slice(0, limit);
}

export function getPopularArticles(limit = 6): Article[] {
  return articles.filter((a) => a.popular).sort(byUpdatedDesc).slice(0, limit);
}

export function getFeaturedArticles(limit = 4): Article[] {
  return articles.filter((a) => a.featured).sort(byUpdatedDesc).slice(0, limit);
}

const EXAM_TYPES: ContentType[] = ["assignment", "lab", "mcq", "test", "question-paper", "syllabus"];

export function getExamAndLabResources(limit = 6): Article[] {
  return articles
    .filter((a) => EXAM_TYPES.includes(a.contentType))
    .sort(byUpdatedDesc)
    .slice(0, limit);
}

/** Related articles: same category first, then shared tags, excluding self. */
export function getRelatedArticles(article: Article, limit = 4): Article[] {
  const scored = articles
    .filter((a) => a.slug !== article.slug)
    .map((a) => {
      let score = 0;
      if (a.category === article.category) score += 3;
      if (a.subcategory && a.subcategory === article.subcategory) score += 2;
      const shared = a.tags.filter((t) => article.tags.includes(t)).length;
      score += shared;
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || byUpdatedDesc(x.a, y.a));
  return scored.slice(0, limit).map((x) => x.a);
}

/** Previous/next within the same category, ordered by published date. */
export function getPrevNext(article: Article): { prev?: Article; next?: Article } {
  const inCategory = getArticlesByCategory(article.category).sort(byPublishedDesc);
  const idx = inCategory.findIndex((a) => a.slug === article.slug);
  return {
    prev: idx > 0 ? inCategory[idx - 1] : undefined,
    next: idx >= 0 && idx < inCategory.length - 1 ? inCategory[idx + 1] : undefined,
  };
}

export function getAllArticleParams(): { category: string; slug: string }[] {
  return articles.map((a) => ({ category: a.category, slug: a.slug }));
}

/** Number of articles in a category (for card counts). */
export function countByCategory(categorySlug: string): number {
  return articles.filter((a) => a.category === categorySlug).length;
}

/** A short beginner-friendly starting path: earliest beginner tutorials. */
export function getStartHereArticles(limit = 4): Article[] {
  const beginner = articles.filter(
    (a) => a.difficulty === "beginner" && (a.contentType === "tutorial" || a.contentType === "article"),
  );
  const pool = beginner.length >= limit ? beginner : articles.filter((a) => a.contentType === "tutorial");
  return pool
    .slice()
    .sort((a, b) => a.readingMinutes - b.readingMinutes)
    .slice(0, limit);
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  tutorial: "Tutorial",
  article: "Article",
  assignment: "Assignment",
  lab: "Lab Program",
  notes: "Notes",
  "question-paper": "Question Paper",
  mcq: "MCQ",
  test: "Test",
  syllabus: "Syllabus",
  resource: "Resource",
};

export interface SearchDoc {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  contentType: ContentType;
  contentTypeLabel: string;
  tags: string[];
  updatedDate: string;
  href: string;
}

export function buildSearchIndex(): SearchDoc[] {
  return articles.map((a) => {
    const cat = getCategory(a.category);
    return {
      slug: a.slug,
      title: a.title,
      description: a.description,
      category: a.category,
      categoryName: cat?.name ?? a.category,
      contentType: a.contentType,
      contentTypeLabel: CONTENT_TYPE_LABELS[a.contentType],
      tags: a.tags,
      updatedDate: a.updatedDate,
      href: `/${a.category}/${a.slug}`,
    };
  });
}
