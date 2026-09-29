import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { problemRunSchema } from "@/lib/validators/code";
import { isJudge0Configured, JUDGE0_MISSING_MESSAGE } from "@/lib/judge0";
import { submitSolution } from "@/lib/judge-service";
import { assertSameOrigin } from "@/lib/csrf";
import { getCurrentUser } from "@/lib/session";
import { limits, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!assertSameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Log in to submit your solution." }, { status: 401 });
  if (!rateLimit(`psub:${user.id}`, limits.submit.limit, limits.submit.windowMs).success) {
    return NextResponse.json({ error: "Too many submissions — wait a moment." }, { status: 429 });
  }
  const parsed = problemRunSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  if (!isJudge0Configured()) return NextResponse.json({ error: JUDGE0_MISSING_MESSAGE, code: "JUDGE0_MISSING" }, { status: 503 });
  const problem = await db.problem.findFirst({ where: { slug: (await params).slug, status: "PUBLISHED" }, select: { id: true } });
  if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  try {
    const outcome = await submitSolution({ userId: user.id, problemId: problem.id, language: parsed.data.language, code: parsed.data.code, contestId: parsed.data.contestId });
    return NextResponse.json({ result: outcome });
  } catch (e) {
    console.error("[problems/submit]", e);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
