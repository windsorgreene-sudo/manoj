import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { problemRunSchema } from "@/lib/validators/code";
import { isJudge0Configured, JUDGE0_MISSING_MESSAGE } from "@/lib/judge0";
import { runSamples } from "@/lib/judge-service";
import { assertSameOrigin } from "@/lib/csrf";
import { getCurrentUser } from "@/lib/session";
import { clientIp, limits, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!assertSameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const user = await getCurrentUser();
  if (!rateLimit(`prun:${user?.id ?? clientIp(req.headers)}`, user ? limits.codeRun.limit : 6, limits.codeRun.windowMs).success) {
    return NextResponse.json({ error: "Too many runs, wait a few seconds." }, { status: 429 });
  }
  const parsed = problemRunSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  if (!isJudge0Configured()) return NextResponse.json({ error: JUDGE0_MISSING_MESSAGE, code: "JUDGE0_MISSING" }, { status: 503 });
  const problem = await db.problem.findFirst({ where: { slug: (await params).slug, status: "PUBLISHED" }, select: { id: true } });
  if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  try {
    const result = await runSamples(problem.id, parsed.data.language, parsed.data.code, parsed.data.customInput);
    return NextResponse.json({ result });
  } catch (e) {
    console.error("[problems/run]", e);
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}
