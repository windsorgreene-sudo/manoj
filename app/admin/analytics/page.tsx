import { nowMs } from "@/lib/utils";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { Donut, DropOffFunnel, HBar } from "@/components/admin/charts";
import { db } from "@/lib/db";

export const metadata = { title: "Analytics" };
const WEEK = 7 * 86_400_000;

export default async function Analytics({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const sp = await searchParams;
  const [topArticles, problems, subStats, devices, countries, courses, users, xpEvents] = await Promise.all([
    db.article.findMany({ where: { status: "PUBLISHED" }, orderBy: { views: "desc" }, take: 8, select: { title: true, views: true, slug: true } }),
    db.problem.findMany({ select: { id: true, title: true } }),
    db.submission.groupBy({ by: ["problemId", "verdict"], where: { kind: "SUBMIT", problemId: { not: null } }, _count: true }),
    db.pageView.groupBy({ by: ["device"], _count: true }),
    db.pageView.groupBy({ by: ["country"], _count: true, orderBy: { _count: { country: "desc" } }, take: 8 }),
    db.course.findMany({ select: { id: true, title: true, slug: true } }),
    db.user.findMany({ select: { id: true, createdAt: true } }),
    db.xpEvent.findMany({ where: { createdAt: { gte: new Date(nowMs() - 8 * WEEK) } }, select: { userId: true, createdAt: true } }),
  ]);

  const hardest = problems
    .map((p) => {
      const rows = subStats.filter((s) => s.problemId === p.id);
      const total = rows.reduce((t, r) => t + r._count, 0);
      const ok = rows.filter((r) => r.verdict === "ACCEPTED").reduce((t, r) => t + r._count, 0);
      return { title: p.title, acceptance: total ? Math.round((ok / total) * 100) : 0, total };
    })
    .filter((p) => p.total >= 3)
    .sort((a, b) => a.acceptance - b.acceptance)
    .slice(0, 8);

  const course = courses.find((c) => c.slug === sp.course) ?? courses[0];
  const lessons = course ? await db.lesson.findMany({ where: { module: { courseId: course.id } }, orderBy: [{ module: { order: "asc" } }, { order: "asc" }], select: { id: true, title: true } }) : [];
  const enrolled = course ? await db.enrollment.count({ where: { courseId: course.id } }) : 0;
  const progress = lessons.length ? await db.progress.groupBy({ by: ["lessonId"], where: { completed: true, lessonId: { in: lessons.map((l) => l.id) } }, _count: true }) : [];
  const step = Math.max(1, Math.ceil(lessons.length / 5));
  const funnel = [{ name: `Enrolled (${enrolled})`, value: enrolled }, ...lessons.filter((_, i) => i % step === 0 || i === lessons.length - 1).map((l) => { const v = progress.find((p) => p.lessonId === l.id)?._count ?? 0; return { name: `${l.title.slice(0, 22)} (${v})`, value: v }; })];

  // Retention cohorts: signup week × weeks later with activity
  const now = nowMs();
  const cohorts = Array.from({ length: 6 }, (_, w) => {
    const start = now - (w + 1) * WEEK;
    const cohort = users.filter((u) => u.createdAt.getTime() >= start && u.createdAt.getTime() < start + WEEK).map((u) => u.id);
    const set = new Set(cohort);
    const weeks = Array.from({ length: w + 1 }, (_, k) => {
      const ws = start + k * WEEK;
      const active = new Set(xpEvents.filter((e) => set.has(e.userId) && e.createdAt.getTime() >= ws && e.createdAt.getTime() < ws + WEEK).map((e) => e.userId));
      return cohort.length ? Math.round((active.size / cohort.length) * 100) : null;
    });
    return { label: new Date(start).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), size: cohort.length, weeks };
  }).reverse();

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Content performance, difficulty, funnels, retention and audience." />
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="glass min-w-0 overflow-hidden p-5" aria-labelledby="a1"><h2 id="a1" className="mb-2 font-semibold">Most-read articles</h2><HBar data={topArticles.map((a) => ({ name: a.title.slice(0, 26), views: a.views }))} dataKey="views" nameKey="name" /></section>
        <section className="glass min-w-0 overflow-hidden p-5" aria-labelledby="a2"><h2 id="a2" className="mb-2 font-semibold">Hardest problems (lowest acceptance)</h2><HBar data={hardest.map((h) => ({ name: h.title.slice(0, 26), acceptance: h.acceptance }))} dataKey="acceptance" nameKey="name" unit="%" /></section>
        <section className="glass min-w-0 overflow-hidden p-5" aria-labelledby="a3">
          <div className="mb-2 flex flex-wrap items-center gap-2"><h2 id="a3" className="font-semibold">Course drop-off funnel</h2>
            <nav aria-label="Course" className="ml-auto flex flex-wrap gap-1">{courses.map((c) => <Link key={c.id} href={`/admin/analytics?course=${c.slug}`} aria-current={c.id === course?.id ? "page" : undefined} className={`rounded-lg px-2 py-1 text-xs ${c.id === course?.id ? "bg-brand text-white" : "bg-surface-2 text-muted-foreground"}`}>{c.title.split(" ")[0]}</Link>)}</nav>
          </div>
          <DropOffFunnel data={funnel} />
        </section>
        <section className="glass min-w-0 overflow-hidden p-5" aria-labelledby="a4">
          <h2 id="a4" className="mb-3 font-semibold">Retention cohorts (weekly, % active)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs"><caption className="sr-only">Retention cohorts</caption>
              <thead><tr className="text-muted-foreground"><th scope="col" className="p-1 text-left">Cohort</th><th scope="col" className="p-1">Users</th>{Array.from({ length: 6 }, (_, i) => <th key={i} scope="col" className="p-1">W{i}</th>)}</tr></thead>
              <tbody>{cohorts.map((c) => (
                <tr key={c.label}><td className="p-1">{c.label}</td><td className="p-1 text-center">{c.size}</td>
                  {Array.from({ length: 6 }, (_, i) => { const v = c.weeks[i]; return <td key={i} className="p-1 text-center"><span className="block rounded-md py-1" style={{ background: v === undefined || v === null ? "transparent" : `rgba(124,58,237,${0.15 + (v / 100) * 0.85})` }}>{v === undefined || v === null ? "" : `${v}%`}</span></td>; })}
                </tr>))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="glass min-w-0 overflow-hidden p-5" aria-labelledby="a5"><h2 id="a5" className="mb-2 font-semibold">Devices</h2><Donut data={devices.map((d) => ({ name: d.device, value: d._count }))} /></section>
        <section className="glass min-w-0 overflow-hidden p-5" aria-labelledby="a6"><h2 id="a6" className="mb-2 font-semibold">Top countries</h2><Donut data={countries.map((c) => ({ name: c.country, value: c._count }))} /></section>
      </div>
    </div>
  );
}
