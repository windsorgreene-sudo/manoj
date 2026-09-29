import { ogCard, OG_SIZE } from "@/lib/og";
import { db } from "@/lib/db";

export const alt = "CodeVerse tutorial";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await db.article.findUnique({ where: { slug }, select: { title: true, excerpt: true } }).catch(() => null);
  return ogCard({ eyebrow: "Tutorial", title: row?.title ?? "CodeVerse tutorial", subtitle: row?.excerpt });
}
