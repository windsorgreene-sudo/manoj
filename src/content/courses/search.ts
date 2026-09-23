import { courses } from "./index";

// A flat search index over courses and their lessons. Each entry links to the
// course overview or a specific lesson. Kind is shown as a subtle label.
export interface SearchDoc {
  title: string;
  description: string;
  courseTitle: string;
  kind: "Course" | "Lesson";
  tags: string[];
  href: string;
}

export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const course of courses) {
    docs.push({
      title: course.title,
      description: course.description,
      courseTitle: course.title,
      kind: "Course",
      tags: course.tags,
      href: `/courses/${course.slug}`,
    });

    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        docs.push({
          title: lesson.title,
          description: lesson.description,
          courseTitle: course.title,
          kind: "Lesson",
          tags: course.tags,
          href: `/courses/${course.slug}/${lesson.slug}`,
        });
      }
    }
  }

  return docs;
}
