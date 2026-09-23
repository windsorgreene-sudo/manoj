import { courses } from "./data";
import type { Course, LessonRef } from "./types";

export { courses };
export type { Course, Lesson, Chapter, QuizQuestion, LessonRef } from "./types";

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function lessonCount(course: Course): number {
  return course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
}

export function totalMinutes(course: Course): number {
  return course.chapters.reduce(
    (sum, ch) => sum + ch.lessons.reduce((s, l) => s + (l.duration || 0), 0),
    0,
  );
}

/** Flatten every lesson of a course, preserving chapter/lesson positions. */
export function flattenLessons(course: Course): LessonRef[] {
  const refs: LessonRef[] = [];
  course.chapters.forEach((chapter, chapterIndex) => {
    chapter.lessons.forEach((lesson, lessonIndex) => {
      refs.push({ course, chapter, lesson, chapterIndex, lessonIndex });
    });
  });
  return refs;
}

export function getLessonRef(courseSlug: string, lessonSlug: string): LessonRef | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  return flattenLessons(course).find((r) => r.lesson.slug === lessonSlug);
}

export function getPrevNextLesson(courseSlug: string, lessonSlug: string): {
  prev?: { course: string; slug: string; title: string };
  next?: { course: string; slug: string; title: string };
} {
  const course = getCourse(courseSlug);
  if (!course) return {};
  const flat = flattenLessons(course);
  const idx = flat.findIndex((r) => r.lesson.slug === lessonSlug);
  const toLink = (r?: LessonRef) =>
    r ? { course: courseSlug, slug: r.lesson.slug, title: r.lesson.title } : undefined;
  return {
    prev: idx > 0 ? toLink(flat[idx - 1]) : undefined,
    next: idx >= 0 && idx < flat.length - 1 ? toLink(flat[idx + 1]) : undefined,
  };
}

export function getAllLessonParams(): { courseSlug: string; lessonSlug: string }[] {
  const params: { courseSlug: string; lessonSlug: string }[] = [];
  courses.forEach((c) =>
    c.chapters.forEach((ch) =>
      ch.lessons.forEach((l) => params.push({ courseSlug: c.slug, lessonSlug: l.slug })),
    ),
  );
  return params;
}

export function getRelatedCourses(course: Course, limit = 3): Course[] {
  return courses
    .filter((c) => c.slug !== course.slug)
    .map((c) => ({
      c,
      score: c.category === course.category ? 2 : 0 + c.tags.filter((t) => course.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.c);
}

export const CATEGORIES = Array.from(new Set(courses.map((c) => c.category)));

// Total lessons across all courses (for homepage stats).
export function totalLessons(): number {
  return courses.reduce((s, c) => s + lessonCount(c), 0);
}
