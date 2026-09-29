"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminAction, audit, slugSchema } from "@/lib/admin";

const id = z.string().min(1).max(40);

const courseSchema = z.object({
  id: id.optional(),
  slug: slugSchema,
  title: z.string().trim().min(3).max(120),
  subtitle: z.string().trim().min(5).max(200),
  description: z.string().trim().min(20).max(5000),
  topic: z.string().trim().min(2).max(60),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  language: z.string().trim().min(2).max(40),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  featured: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  outcomes: z.array(z.string().trim().min(2).max(160)).max(12),
});
export type CourseInput = z.infer<typeof courseSchema>;

const touch = (slug?: string) => {
  revalidatePath("/courses");
  revalidatePath("/");
  if (slug) revalidatePath(`/courses/${slug}`);
};

async function courseSlugOfModule(moduleId: string) {
  const m = await db.module.findUnique({ where: { id: moduleId }, select: { course: { select: { slug: true } } } });
  return m?.course.slug;
}

export async function saveCourse(input: CourseInput) {
  return adminAction(async (actor) => {
    const d = courseSchema.parse(input);
    const { id: cid, ...data } = d;
    const c = cid ? await db.course.update({ where: { id: cid }, data }) : await db.course.create({ data });
    await audit(actor, cid ? "course.update" : "course.create", "Course", c.slug);
    touch(c.slug);
    return { id: c.id };
  });
}

export async function deleteCourse(courseId: string) {
  return adminAction(async (actor) => {
    const c = await db.course.delete({ where: { id: id.parse(courseId) } });
    await audit(actor, "course.delete", "Course", c.slug);
    touch(c.slug);
    return null;
  });
}

export async function addModule(input: { courseId: string; title: string }) {
  return adminAction(async (actor) => {
    const d = z.object({ courseId: id, title: z.string().trim().min(2).max(120) }).parse(input);
    const count = await db.module.count({ where: { courseId: d.courseId } });
    const m = await db.module.create({ data: { courseId: d.courseId, title: d.title, order: count } });
    await audit(actor, "module.create", "Module", m.id);
    touch(await courseSlugOfModule(m.id));
    return { id: m.id };
  });
}

export async function renameModule(input: { id: string; title: string }) {
  return adminAction(async (actor) => {
    const d = z.object({ id, title: z.string().trim().min(2).max(120) }).parse(input);
    await db.module.update({ where: { id: d.id }, data: { title: d.title } });
    await audit(actor, "module.rename", "Module", d.id);
    touch(await courseSlugOfModule(d.id));
    return null;
  });
}

export async function deleteModule(moduleId: string) {
  return adminAction(async (actor) => {
    const slug = await courseSlugOfModule(id.parse(moduleId));
    await db.module.delete({ where: { id: moduleId } });
    await audit(actor, "module.delete", "Module", moduleId);
    touch(slug);
    return null;
  });
}

export async function reorderModules(input: { courseId: string; ids: string[] }) {
  return adminAction(async (actor) => {
    const d = z.object({ courseId: id, ids: z.array(id).max(200) }).parse(input);
    await db.$transaction(d.ids.map((mid, order) => db.module.update({ where: { id: mid, courseId: d.courseId }, data: { order } })));
    await audit(actor, "module.reorder", "Course", d.courseId);
    const c = await db.course.findUnique({ where: { id: d.courseId }, select: { slug: true } });
    touch(c?.slug);
    return null;
  });
}

const lessonSchema = z.object({
  id: id.optional(),
  moduleId: id,
  title: z.string().trim().min(2).max(160),
  slug: slugSchema,
  type: z.enum(["ARTICLE", "PROBLEM", "QUIZ", "VIDEO"]),
  refSlug: z.string().max(160).optional().default(""),
  videoUrl: z.union([z.url(), z.literal("")]).optional().default(""),
  isPreview: z.boolean(),
  durationMins: z.number().int().min(1).max(600),
});
export type LessonInput = z.input<typeof lessonSchema>;

export async function saveLesson(input: LessonInput) {
  return adminAction(async (actor) => {
    const d = lessonSchema.parse(input);
    let articleId: string | null = null,
      problemId: string | null = null,
      quizId: string | null = null;
    if (d.type === "ARTICLE") articleId = (await db.article.findUnique({ where: { slug: d.refSlug }, select: { id: true } }))?.id ?? null;
    if (d.type === "PROBLEM") problemId = (await db.problem.findUnique({ where: { slug: d.refSlug }, select: { id: true } }))?.id ?? null;
    if (d.type === "QUIZ") quizId = (await db.quiz.findUnique({ where: { slug: d.refSlug }, select: { id: true } }))?.id ?? null;
    if (d.type !== "VIDEO" && !articleId && !problemId && !quizId) throw new Error(`USER:No ${d.type.toLowerCase()} found with slug “${d.refSlug}”.`);
    const data = { title: d.title, slug: d.slug, type: d.type, isPreview: d.isPreview, durationMins: d.durationMins, articleId, problemId, quizId, videoUrl: d.videoUrl || null };
    const l = d.id
      ? await db.lesson.update({ where: { id: d.id }, data })
      : await db.lesson.create({ data: { ...data, moduleId: d.moduleId, order: await db.lesson.count({ where: { moduleId: d.moduleId } }) } });
    await audit(actor, d.id ? "lesson.update" : "lesson.create", "Lesson", l.id);
    touch(await courseSlugOfModule(d.moduleId));
    return { id: l.id };
  });
}

export async function deleteLesson(lessonId: string) {
  return adminAction(async (actor) => {
    const l = await db.lesson.delete({ where: { id: id.parse(lessonId) } });
    await audit(actor, "lesson.delete", "Lesson", l.id);
    touch(await courseSlugOfModule(l.moduleId));
    return null;
  });
}

export async function reorderLessons(input: { moduleId: string; ids: string[] }) {
  return adminAction(async (actor) => {
    const d = z.object({ moduleId: id, ids: z.array(id).max(500) }).parse(input);
    await db.$transaction(d.ids.map((lid, order) => db.lesson.update({ where: { id: lid }, data: { order, moduleId: d.moduleId } })));
    await audit(actor, "lesson.reorder", "Module", d.moduleId);
    touch(await courseSlugOfModule(d.moduleId));
    return null;
  });
}
