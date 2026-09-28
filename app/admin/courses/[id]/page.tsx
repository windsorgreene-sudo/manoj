import { notFound } from "next/navigation";
import { CourseEditor } from "@/components/admin/course-editor";
import { db } from "@/lib/db";
import type { CourseInput } from "@/lib/actions/admin/courses";

export const metadata = { title: "Edit course" };

export default async function AdminCourseEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [articles, problems, quizzes] = await Promise.all([
    db.article.findMany({ where: { isBlog: false }, select: { slug: true }, orderBy: { slug: "asc" } }),
    db.problem.findMany({ select: { slug: true }, orderBy: { number: "asc" } }),
    db.quiz.findMany({ select: { slug: true }, orderBy: { slug: "asc" } }),
  ]);
  const refs = { articles: articles.map((a) => a.slug), problems: problems.map((p) => p.slug), quizzes: quizzes.map((q) => q.slug) };
  if (id === "new") {
    const blank: CourseInput = { slug: "", title: "", subtitle: "", description: "", topic: "", level: "BEGINNER", language: "English", isPro: false, priceInr: 0, color: "#7C3AED", featured: false, status: "DRAFT", outcomes: [] };
    return <CourseEditor course={blank} modules={[]} refs={refs} />;
  }
  const c = await db.course.findUnique({
    where: { id },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" }, include: { article: { select: { slug: true } }, problem: { select: { slug: true } }, quiz: { select: { slug: true } } } } } } },
  });
  if (!c) notFound();
  const course: CourseInput = { id: c.id, slug: c.slug, title: c.title, subtitle: c.subtitle, description: c.description, topic: c.topic, level: c.level, language: c.language, isPro: c.isPro, priceInr: c.priceInr, color: c.color, featured: c.featured, status: c.status === "PUBLISHED" || c.status === "ARCHIVED" ? c.status : "DRAFT", outcomes: c.outcomes };
  const modules = c.modules.map((m) => ({
    id: m.id,
    title: m.title,
    lessons: m.lessons.map((l) => ({ id: l.id, title: l.title, slug: l.slug, type: l.type, isPreview: l.isPreview, durationMins: l.durationMins, refSlug: l.article?.slug ?? l.problem?.slug ?? l.quiz?.slug ?? "", videoUrl: l.videoUrl ?? "" })),
  }));
  return <CourseEditor course={course} modules={modules} refs={refs} />;
}
