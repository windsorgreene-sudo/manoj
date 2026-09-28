import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "My Sheets" };

export default async function MySheetsPage() {
  const user = await requireUser();
  const [sheets, solved] = await Promise.all([
    db.sheet.findMany({ where: { isPublished: true }, include: { items: { select: { problemId: true } } }, orderBy: { createdAt: "asc" } }),
    db.submission.findMany({ where: { userId: user.id, verdict: "ACCEPTED" }, select: { problemId: true }, distinct: ["problemId"] }),
  ]);
  const set = new Set(solved.map((s) => s.problemId));
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">My sheets</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {sheets.map((s) => {
          const done = s.items.filter((i) => set.has(i.problemId)).length;
          const pct = Math.round((done / Math.max(1, s.items.length)) * 100);
          return (
            <Link key={s.id} href={`/sheets/${s.slug}`} className="glass hover-glow p-5">
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{done}/{s.items.length} solved</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.title} progress`}>
                <div className="h-full bg-gradient-to-r from-brand to-success" style={{ width: `${pct}%` }} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
