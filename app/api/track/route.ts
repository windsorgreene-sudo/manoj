import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { assertSameOrigin } from "@/lib/csrf";

const schema = z.object({ path: z.string().startsWith("/").max(300) });

/** First-party, cookie-less page-view counter for the admin analytics. */
export async function POST(req: NextRequest) {
  if (!assertSameOrigin(req)) return new NextResponse(null, { status: 204 });
  if (!rateLimit(`track:${clientIp(req.headers)}`, 60, 60_000).success) return new NextResponse(null, { status: 204 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 204 });
  const ua = req.headers.get("user-agent") ?? "";
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
  const country = (req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? "IN").slice(0, 2).toUpperCase();
  await db.pageView.create({ data: { path: parsed.data.path.split("?")[0], device, country } }).catch(() => undefined);
  return new NextResponse(null, { status: 204 });
}
