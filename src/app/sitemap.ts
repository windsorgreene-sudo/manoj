import type { MetadataRoute } from "next";
import { courses, getAllLessonParams } from "@/content/courses";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = ["", "/courses", "/playground", "/about", "/contact", "/privacy", "/terms", "/disclaimer"].map(
    (p) => ({
      url: `${SITE.url}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.6,
    }),
  );

  const coursePages = courses.map((c) => ({
    url: `${SITE.url}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const lessonPages = getAllLessonParams().map((p) => ({
    url: `${SITE.url}/courses/${p.courseSlug}/${p.lessonSlug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...coursePages, ...lessonPages];
}
