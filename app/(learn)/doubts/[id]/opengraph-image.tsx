import { ogCard, OG_SIZE } from "@/lib/og";
import { db } from "@/lib/db";

export const alt = "Kodshala doubt";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.doubt.findUnique({ where: { id: id.slice(0, 40) }, select: { title: true, body: true } }).catch(() => null);
  return ogCard({ eyebrow: "Doubts forum", title: row?.title ?? "Kodshala doubt", subtitle: row?.body });
}
