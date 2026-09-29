import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getStandings } from "@/lib/contests";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Polling endpoint for the live leaderboard (also refetched on Pusher `leaderboard` events). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!rateLimit(`lb:${clientIp(req.headers)}`, 60, 60_000).success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const { slug } = await params;
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1") || 1;
  const user = await getCurrentUser();
  const data = await getStandings(slug.slice(0, 160), user?.id ?? null, page);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
