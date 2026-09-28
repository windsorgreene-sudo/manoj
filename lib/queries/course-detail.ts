import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getCourseDetail = cache(async (slug: string) => {
  const course = await db.course.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, slug: true, title: true, type: true, durationMins: true, isPreview: true },
          },
        },
      },
      reviews: { orderBy: { createdAt: "desc" }, take: 20, include: { user: { select: { name: true, username: true } } } },
      _count: { select: { enrollments: true } },
    },
  });
  if (!course) return null;
  const agg = await db.review.aggregate({ where: { courseId: course.id }, _avg: { rating: true }, _count: true });
  const dist = await db.review.groupBy({ by: ["rating"], where: { courseId: course.id }, _count: true });
  return {
    ...course,
    rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
    reviewCount: agg._count,
    distribution: [5, 4, 3, 2, 1].map((r) => ({ rating: r, count: dist.find((d) => d.rating === r)?._count ?? 0 })),
    lessonCount: course.modules.reduce((t, m) => t + m.lessons.length, 0),
  };
});

export type CourseDetail = NonNullable<Awaited<ReturnType<typeof getCourseDetail>>>;
