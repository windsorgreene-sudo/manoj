import { ogCard, OG_SIZE } from "@/lib/og";
import { db } from "@/lib/db";

export const alt = "CodeVerse quiz";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await db.quiz.findUnique({ where: { slug }, select: { title: true, description: true, isMockTest: true } }).catch(() => null);
  return ogCard({ eyebrow: row?.isMockTest ? "Mock test" : "Quiz", title: row?.title ?? "CodeVerse quiz", subtitle: row?.description, accent: "#06B6D4" });
}
