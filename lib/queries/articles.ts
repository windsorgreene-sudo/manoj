import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export type TreeCategory = { slug: string; name: string; articles: { slug: string; title: string; difficulty: "EASY" | "MEDIUM" | "HARD" }[] };

export const getTutorialTree = cache(async (): Promise<TreeCategory[]> => {
  const cats = await db.category.findMany({
    where: { slug: { not: "blog" } },
    orderBy: { order: "asc" },
    select: {
      slug: true,
      name: true,
      articles: { where: { status: "PUBLISHED", isBlog: false }, orderBy: { order: "asc" }, select: { slug: true, title: true, difficulty: true } },
    },
  });
  return cats.filter((c) => c.articles.length > 0);
});

export const getArticleBySlug = cache(async (slug: string) => {
  return db.article.findFirst({
    where: { slug, status: "PUBLISHED", isBlog: false },
    include: {
      author: { select: { name: true, username: true, image: true, profile: { select: { bio: true } } } },
      category: { select: { slug: true, name: true } },
      tags: { select: { slug: true, name: true } },
      quizzes: {
        take: 1,
        select: { id: true, title: true, questions: { orderBy: { order: "asc" }, select: { id: true, prompt: true, options: true } } },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });
});

export async function getRelatedArticles(article: { id: string; categoryId: string | null; tags: { slug: string }[] }) {
  return db.article.findMany({
    where: {
      id: { not: article.id },
      status: "PUBLISHED",
      isBlog: false,
      OR: [{ categoryId: article.categoryId ?? undefined }, { tags: { some: { slug: { in: article.tags.map((t) => t.slug) } } } }],
    },
    orderBy: { views: "desc" },
    take: 4,
    select: { slug: true, title: true, excerpt: true, difficulty: true, readingMins: true },
  });
}

export function prevNext(tree: TreeCategory[], slug: string) {
  const flat = tree.flatMap((c) => c.articles);
  const i = flat.findIndex((a) => a.slug === slug);
  return { prev: i > 0 ? flat[i - 1] : null, next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null };
}
