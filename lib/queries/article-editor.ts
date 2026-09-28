import "server-only";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import type { SessionUser } from "@/lib/session";
import type { ArticleInput } from "@/lib/actions/admin/articles";

export async function loadArticleEditor(id: string | null, actor: SessionUser) {
  const categories = await db.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } });
  if (!id) {
    const initial: ArticleInput = { title: "", slug: "", excerpt: "", content: "## Introduction\n\nStart writing…\n", difficulty: "EASY", categoryId: categories[0]?.id ?? null, tags: [], isBlog: false, seoTitle: "", seoDescription: "", ogImage: "", status: "DRAFT", scheduledAt: null };
    return { initial, categories, revisions: [], reviewNote: null };
  }
  const a = await db.article.findUnique({
    where: { id },
    include: { tags: { select: { name: true } }, revisions: { orderBy: { version: "desc" }, take: 30, include: { author: { select: { name: true } } } } },
  });
  if (!a) notFound();
  if (actor.role !== "ADMIN" && a.authorId !== actor.id) notFound();
  return {
    categories,
    reviewNote: a.reviewNote,
    revisions: a.revisions.map((r) => ({ id: r.id, version: r.version, message: r.message, createdAt: r.createdAt.toISOString(), author: r.author.name })),
    initial: {
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      difficulty: a.difficulty,
      categoryId: a.categoryId,
      tags: a.tags.map((t) => t.name),
      isBlog: a.isBlog,
      seoTitle: a.seoTitle ?? "",
      seoDescription: a.seoDescription ?? "",
      ogImage: a.ogImage ?? "",
      status: a.status as ArticleInput["status"],
      scheduledAt: a.scheduledAt?.toISOString() ?? null,
    } as ArticleInput & { status: ArticleInput["status"] | "CHANGES_REQUESTED" | "REJECTED" },
  };
}
