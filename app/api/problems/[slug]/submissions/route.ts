import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

/** The signed-in user's submissions + solved state for a problem. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ signedIn: false, submissions: [], solved: false });
  const problem = await db.problem.findFirst({ where: { slug: (await params).slug }, select: { id: true } });
  if (!problem) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [submissions, bookmark] = await Promise.all([
    db.submission.findMany({
      where: { userId: user.id, problemId: problem.id, kind: "SUBMIT" },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, verdict: true, language: true, runtimeMs: true, memoryKb: true, passed: true, total: true, createdAt: true, code: true },
    }),
    db.bookmark.findUnique({ where: { userId_problemId: { userId: user.id, problemId: problem.id } } }),
  ]);
  return NextResponse.json({ signedIn: true, submissions, solved: submissions.some((s) => s.verdict === "ACCEPTED"), bookmarked: Boolean(bookmark) });
}
