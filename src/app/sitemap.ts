import type { MetadataRoute } from "next";
import { articles, categories } from "@/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/tutorials",
    "/programming",
    "/web-development",
    "/resources",
    "/exam-preparation",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
  ].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.6,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${SITE.url}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const typePages = [
    "assignment",
    "lab",
    "notes",
    "mcq",
    "test",
    "question-paper",
    "syllabus",
  ].map((t) => ({
    url: `${SITE.url}/type/${t}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const articlePages = articles.map((a) => ({
    url: `${SITE.url}/${a.category}/${a.slug}`,
    lastModified: new Date(a.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...typePages, ...articlePages];
}
