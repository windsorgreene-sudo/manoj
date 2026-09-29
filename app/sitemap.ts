import type { MetadataRoute } from "next";
import { db, hasDatabase } from "@/lib/db";
import { appUrl } from "@/lib/utils";

export const revalidate = 3600;

const STATIC = ["", "/courses", "/tutorials", "/problems", "/contests", "/quizzes", "/doubts", "/sheets", "/roadmaps", "/visualizers", "/lab", "/playground", "/leaderboard", "/pricing", "/about", "/contact", "/blog", "/write-for-us", "/privacy", "/terms", "/verify"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = appUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: p === "" ? "daily" : "weekly", priority: p === "" ? 1 : 0.7 }));
  if (!hasDatabase()) return entries;
  try {
    const [articles, courses, problems, contests, quizzes, sheets, roadmaps, doubts] = await Promise.all([
      db.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, isBlog: true, updatedAt: true } }),
      db.course.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      db.problem.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      db.contest.findMany({ where: { isPublished: true }, select: { slug: true, createdAt: true } }),
      db.quiz.findMany({ where: { isPublished: true, articleId: null }, select: { slug: true, createdAt: true } }),
      db.sheet.findMany({ where: { isPublished: true }, select: { slug: true, createdAt: true } }),
      db.roadmap.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      db.doubt.findMany({ where: { hidden: false }, orderBy: { createdAt: "desc" }, take: 5000, select: { id: true, updatedAt: true } }),
    ]);
    const add = (path: string, lastModified: Date, priority = 0.6) => entries.push({ url: `${base}${path}`, lastModified, priority });
    for (const a of articles) add(a.isBlog ? `/blog/${a.slug}` : `/tutorials/${a.slug}`, a.updatedAt, 0.8);
    for (const c of courses) add(`/courses/${c.slug}`, c.updatedAt, 0.9);
    for (const p of problems) add(`/problems/${p.slug}`, p.updatedAt, 0.7);
    for (const c of contests) add(`/contests/${c.slug}`, c.createdAt);
    for (const q of quizzes) add(`/quizzes/${q.slug}`, q.createdAt);
    for (const s of sheets) add(`/sheets/${s.slug}`, s.createdAt);
    for (const r of roadmaps) add(`/roadmaps/${r.slug}`, r.updatedAt);
    for (const d of doubts) add(`/doubts/${d.id}`, d.updatedAt, 0.5);
  } catch (e) {
    console.warn("[sitemap] database unavailable, serving static entries only", e);
  }
  return entries;
}
