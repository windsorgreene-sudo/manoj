import { nowMs } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ContestEditor } from "@/components/admin/catalog-editors";
import { db } from "@/lib/db";

export const metadata = { title: "Edit contest" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slugs = (await db.problem.findMany({ select: { slug: true }, orderBy: { number: "asc" } })).map((p) => p.slug);
  if (id === "new") {
    const start = new Date(nowMs() + 7 * 86_400_000);
    start.setUTCHours(14, 30, 0, 0);
    return <ContestEditor problemSlugs={slugs} standings={[]} frozen={false} initial={{ slug: "", title: "", description: "", startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 2 * 3_600_000).toISOString(), isPublished: true, problems: [{ problemSlug: "", points: 100 }] }} />;
  }
  const c = await db.contest.findUnique({ where: { id }, include: { problems: { orderBy: { order: "asc" }, include: { problem: { select: { slug: true } } } }, participants: { orderBy: [{ score: "desc" }, { penaltyMins: "asc" }], include: { user: { select: { name: true } } } } } });
  if (!c) notFound();
  return (
    <ContestEditor
      problemSlugs={slugs}
      frozen={c.frozen}
      standings={c.participants.map((p, i) => ({ rank: p.rank ?? i + 1, name: p.user.name, score: p.score, solved: p.solved, penaltyMins: p.penaltyMins }))}
      initial={{ id: c.id, slug: c.slug, title: c.title, description: c.description, startsAt: c.startsAt.toISOString(), endsAt: c.endsAt.toISOString(), isPublished: c.isPublished, problems: c.problems.map((p) => ({ problemSlug: p.problem.slug, points: p.points })) }}
    />
  );
}
