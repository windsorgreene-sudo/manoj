import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 60;

/** Public site status: active banner announcement, maintenance mode and branding. */
export async function GET() {
  try {
    const now = new Date();
    const [banner, flags] = await Promise.all([
      db.announcement.findFirst({ where: { isActive: true, isBanner: true, startsAt: { lte: now }, OR: [{ endsAt: null }, { endsAt: { gte: now } }] }, orderBy: { createdAt: "desc" }, select: { id: true, title: true, body: true, link: true, variant: true } }),
      db.featureFlag.findMany({ where: { key: { in: ["maintenance_mode", "branding", "ai_tutor", "contests"] } } }),
    ]);
    const flag = (k: string) => flags.find((f) => f.key === k);
    return NextResponse.json({ banner, maintenance: Boolean(flag("maintenance_mode")?.enabled), aiTutor: flag("ai_tutor")?.enabled ?? true, branding: flag("branding")?.value ?? null });
  } catch {
    return NextResponse.json({ banner: null, maintenance: false, aiTutor: true, branding: null });
  }
}
