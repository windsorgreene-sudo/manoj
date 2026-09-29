import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export const courseCardSelect = {
  id: true,
  slug: true,
  title: true,
  subtitle: true,
  subtitleHinglish: true,
  topic: true,
  level: true,
  color: true,
  durationMins: true,
  language: true,
  featured: true,
  createdAt: true,
  _count: { select: { enrollments: true, reviews: true } },
  modules: { select: { _count: { select: { lessons: true } } } },
} satisfies Prisma.CourseSelect;

export type CourseCardData = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  subtitleHinglish: string | null;
  topic: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  color: string;
  durationMins: number;
  language: string;
  students: number;
  lessons: number;
  rating: number;
  reviews: number;
};

type Row = Prisma.CourseGetPayload<{ select: typeof courseCardSelect }>;

export async function withRatings(rows: Row[]): Promise<CourseCardData[]> {
  const ratings = await db.review.groupBy({ by: ["courseId"], _avg: { rating: true }, where: { courseId: { in: rows.map((r) => r.id) } } });
  const map = new Map(ratings.map((r) => [r.courseId, r._avg.rating ?? 0]));
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle,
    subtitleHinglish: r.subtitleHinglish,
    topic: r.topic,
    level: r.level,
    color: r.color,
    durationMins: r.durationMins,
    language: r.language,
    students: r._count.enrollments,
    reviews: r._count.reviews,
    lessons: r.modules.reduce((t, m) => t + m._count.lessons, 0),
    rating: Math.round((map.get(r.id) ?? 0) * 10) / 10,
  }));
}

export async function getFeaturedCourses() {
  const rows = await db.course.findMany({ where: { status: "PUBLISHED" }, select: courseCardSelect, orderBy: [{ featured: "desc" }, { createdAt: "asc" }], take: 6 });
  return withRatings(rows);
}

export type CatalogFilters = { q?: string; topic?: string; level?: string; language?: string; sort?: string };

export async function getCatalog(f: CatalogFilters) {
  const where: Prisma.CourseWhereInput = { status: "PUBLISHED" };
  if (f.q) where.OR = [{ title: { contains: f.q, mode: "insensitive" } }, { subtitle: { contains: f.q, mode: "insensitive" } }, { description: { contains: f.q, mode: "insensitive" } }];
  if (f.topic) where.topic = f.topic;
  if (f.level && ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(f.level)) where.level = f.level as Row["level"];
  if (f.language) where.language = f.language;
  const orderBy: Prisma.CourseOrderByWithRelationInput[] =
    f.sort === "newest"
      ? [{ createdAt: "desc" }]
      : f.sort === "title"
        ? [{ title: "asc" }]
        : f.sort === "popular"
          ? [{ enrollments: { _count: "desc" } }]
          : [{ featured: "desc" }, { createdAt: "asc" }];
  const rows = await db.course.findMany({ where, select: courseCardSelect, orderBy });
  let courses = await withRatings(rows);
  if (f.sort === "rating") courses = courses.sort((a, b) => b.rating - a.rating);
  return courses;
}

export async function getCatalogFacets() {
  const [topics, languages] = await Promise.all([
    db.course.findMany({ where: { status: "PUBLISHED" }, select: { topic: true }, distinct: ["topic"], orderBy: { topic: "asc" } }),
    db.course.findMany({ where: { status: "PUBLISHED" }, select: { language: true }, distinct: ["language"] }),
  ]);
  return { topics: topics.map((t) => t.topic), languages: languages.map((l) => l.language) };
}

export async function getPlatformStats() {
  const [learners, problems, articles, submissions, contests] = await Promise.all([
    db.user.count(),
    db.problem.count({ where: { status: "PUBLISHED" } }),
    db.article.count({ where: { status: "PUBLISHED" } }),
    db.submission.count(),
    db.contest.count(),
  ]);
  return { learners, problems, articles, submissions, contests };
}
