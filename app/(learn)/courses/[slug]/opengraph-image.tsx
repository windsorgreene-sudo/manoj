import { ogCard, OG_SIZE } from "@/lib/og";
import { db } from "@/lib/db";

export const alt = "CodeVerse course";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await db.course.findUnique({ where: { slug }, select: { title: true, subtitle: true, color: true } }).catch(() => null);
  return ogCard({ eyebrow: "Course", title: row?.title ?? "CodeVerse course", subtitle: row?.subtitle, accent: row?.color ?? "#7C3AED" });
}
