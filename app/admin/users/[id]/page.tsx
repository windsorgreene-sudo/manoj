import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { UserControls } from "@/components/admin/user-controls";
import { UserTools } from "@/components/admin/community-forms";
import { VerdictText } from "@/components/practice/verdict";
import { db } from "@/lib/db";
import { formatDate, timeAgo } from "@/lib/utils";

export const metadata = { title: "User" };

export default async function AdminUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = await db.user.findUnique({
    where: { id },
    include: {
      profile: true, streak: true,
      submissions: { orderBy: { createdAt: "desc" }, take: 10, include: { problem: { select: { title: true, slug: true } } } },
      enrollments: { include: { course: { select: { title: true } } } },
      _count: { select: { submissions: true, comments: true, doubts: true, articles: true, reports: true } },
    },
  });
  if (!u) notFound();
  const [allBadges, ownedBadges] = await Promise.all([db.badge.findMany({ orderBy: { name: "asc" }, select: { id: true, slug: true, name: true } }), db.userBadge.findMany({ where: { userId: u.id }, select: { badgeId: true } })]);
  const owned = new Set(ownedBadges.map((b) => b.badgeId));
  const logs = await db.auditLog.findMany({ where: { OR: [{ actorId: u.id }, { entityId: u.email }] }, orderBy: { createdAt: "desc" }, take: 10, include: { actor: { select: { name: true } } } });
  return (
    <>
      <PageHeader title={u.name} description={`${u.email} · joined ${formatDate(u.createdAt)}`} actions={u.username ? <Link href={`/u/${u.username}`} className="text-sm text-cyan underline">Public profile</Link> : null} />
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            {[["XP", u.profile?.xp ?? 0], ["Rating", u.profile?.contestRating ?? 1500], ["Streak", u.streak?.current ?? 0], ["Submissions", u._count.submissions]].map(([l, v]) => (
              <div key={String(l)} className="glass p-4"><p className="text-xs text-muted-foreground">{l}</p><p className="font-heading text-2xl font-bold">{v}</p></div>
            ))}
          </div>
          <section className="glass p-5" aria-labelledby="subs"><h2 id="subs" className="mb-2 font-semibold">Recent submissions</h2>
            <ul className="divide-y divide-border text-sm">{u.submissions.map((s) => <li key={s.id} className="flex gap-3 py-2"><VerdictText verdict={s.verdict} /><span className="flex-1">{s.problem?.title ?? "-"}</span><span className="text-xs text-muted-foreground">{timeAgo(s.createdAt)}</span></li>)}</ul>
          </section>
          <section className="glass p-5" aria-labelledby="enr"><h2 id="enr" className="mb-2 font-semibold">Enrollments</h2>
            <ul className="space-y-1 text-sm">{u.enrollments.map((e) => <li key={e.id} className="flex justify-between"><span>{e.course.title}</span><span className="text-muted-foreground">{e.progressPct}%</span></li>)}</ul>
          </section>
          <section className="glass p-5" aria-labelledby="act"><h2 id="act" className="mb-2 font-semibold">Audit trail</h2>
            {logs.length ? <ul className="space-y-1 text-sm">{logs.map((l) => <li key={l.id} className="flex justify-between gap-2"><span>{l.actor?.name ?? "System"} · {l.action}</span><span className="text-xs text-muted-foreground">{timeAgo(l.createdAt)}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No admin activity.</p>}
          </section>
        </div>
        <aside className="space-y-4">
          <div className="glass space-y-2 p-5 text-sm">
            <p className="flex items-center gap-2">Status: {u.banned ? <StatusBadge status="BANNED" /> : <StatusBadge status="ACTIVE" />}</p>
            {u.banned ? <p className="text-muted-foreground">Reason: {u.banReason} {u.banExpires ? `· until ${formatDate(u.banExpires)}` : "· permanent"}</p> : null}
            <p>Email verified: {u.emailVerified ? "yes" : "no"}</p>
            <p>Comments {u._count.comments} · Doubts {u._count.doubts} · Articles {u._count.articles}</p>
            <p>College: {u.profile?.college ?? "-"}</p>
          </div>
          <UserControls userId={u.id} role={u.role} banned={u.banned} />
          <UserTools userId={u.id} emailVerified={u.emailVerified} badges={allBadges.map((b) => ({ slug: b.slug, name: b.name, owned: owned.has(b.id) }))} />
        </aside>
      </div>
    </>
  );
}
