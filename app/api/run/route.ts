import { NextResponse, type NextRequest } from "next/server";
import { runSchema } from "@/lib/validators/code";
import { Judge0NotConfiguredError, isJudge0Configured, JUDGE0_MISSING_MESSAGE, runCode } from "@/lib/judge0";
import { clientIp, limits, rateLimit } from "@/lib/rate-limit";
import { assertSameOrigin } from "@/lib/csrf";
import { getCurrentUser } from "@/lib/session";

/** Free-form code execution (playground + "Try it Yourself"). */
export async function POST(req: NextRequest) {
  if (!assertSameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const user = await getCurrentUser();
  const key = `run:${user?.id ?? clientIp(req.headers)}`;
  const rl = rateLimit(key, user ? limits.codeRun.limit : 8, limits.codeRun.windowMs);
  if (!rl.success) return NextResponse.json({ error: "You're running code too fast. Wait a few seconds and try again." }, { status: 429 });

  const parsed = runSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });

  if (!isJudge0Configured()) return NextResponse.json({ error: JUDGE0_MISSING_MESSAGE, code: "JUDGE0_MISSING" }, { status: 503 });
  try {
    const result = await runCode({ ...parsed.data, timeLimitMs: 5000 });
    return NextResponse.json({ result });
  } catch (e) {
    if (e instanceof Judge0NotConfiguredError) return NextResponse.json({ error: e.message, code: "JUDGE0_MISSING" }, { status: 503 });
    console.error("[api/run]", e);
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}
