import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { search } from "@/lib/search";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({ q: z.string().trim().min(2).max(100) });

export async function GET(req: NextRequest) {
  const parsed = schema.safeParse({ q: req.nextUrl.searchParams.get("q") ?? "" });
  if (!parsed.success) return NextResponse.json({ hits: [] });
  const rl = rateLimit(`search:${clientIp(req.headers)}`, 60, 60_000);
  if (!rl.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  try {
    const hits = await search(parsed.data.q);
    return NextResponse.json({ hits });
  } catch (e) {
    console.error("[api/search]", e);
    return NextResponse.json({ error: "Search unavailable" }, { status: 500 });
  }
}
