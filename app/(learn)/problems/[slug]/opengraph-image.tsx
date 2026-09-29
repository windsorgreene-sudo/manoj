import { ogCard, OG_SIZE } from "@/lib/og";
import { db } from "@/lib/db";

export const alt = "CodeVerse coding problem";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await db.problem.findUnique({ where: { slug }, select: { title: true, number: true, difficulty: true, topics: true } }).catch(() => null);
  return ogCard({ eyebrow: row ? `Problem ${row.number} · ${row.difficulty.toLowerCase()}` : "Problem", title: row?.title ?? "Coding problem", subtitle: row?.topics.join(" · "), accent: row?.difficulty === "HARD" ? "#EF4444" : row?.difficulty === "MEDIUM" ? "#F59E0B" : "#84CC16" });
}
