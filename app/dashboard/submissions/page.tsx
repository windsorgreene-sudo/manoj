import { SubmissionHistory } from "@/components/dashboard/submission-history";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Submissions" };

export default async function SubmissionsPage() {
  const user = await requireUser();
  const subs = await db.submission.findMany({
    where: { userId: user.id, kind: "SUBMIT" },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, verdict: true, language: true, runtimeMs: true, memoryKb: true, passed: true, total: true, createdAt: true, code: true, problemId: true, problem: { select: { slug: true, title: true, number: true } } },
  });
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Submission history</h1>
      <SubmissionHistory subs={subs.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() }))} />
    </div>
  );
}
