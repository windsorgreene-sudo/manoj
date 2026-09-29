import { ogCard, OG_SIZE } from "@/lib/og";
import { db } from "@/lib/db";

export const alt = "Kodshala contest";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await db.contest.findUnique({ where: { slug }, select: { title: true, description: true } }).catch(() => null);
  return ogCard({ eyebrow: "Contest", title: row?.title ?? "Kodshala contest", subtitle: row?.description, accent: "#F59E0B" });
}
