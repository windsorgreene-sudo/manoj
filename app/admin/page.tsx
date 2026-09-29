import { nowMs } from "@/lib/utils";
import Link from "next/link";
import { Activity, Send, UserPlus, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { TrendChart } from "@/components/admin/charts";
import { CountUp } from "@/components/motion/count-up";
import { db } from "@/lib/db";
import { publishDueArticles } from "@/lib/admin";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Overview" };

const DAY = 86_400_000;

export default async function AdminOverview() {
  await publishDueArticles();
  const now = nowMs();
  const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
  const since30 = new Date(now - 30 * DAY);
  const [totalUsers, dau, newSignups, subsToday, users30, subs30, audits, recentUsers, recentSubs, pendingReview, openReports, newMessages, unanswered] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { lastActiveAt: { gte: new Date(now - DAY) } } }),
    db.user.count({ where: { createdAt: { gte: new Date(now - 7 * DAY) } } }),
    db.submission.count({ where: { createdAt: { gte: today } } }),
    db.user.findMany({ where: { createdAt: { gte: since30 } }, select: { createdAt: true } }),
    db.submission.findMany({ where: { createdAt: { gte: since30 } }, select: { createdAt: true, verdict: true } }),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { actor: { select: { name: true } } } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { name: true, createdAt: true, username: true } }),
    db.submission.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { verdict: true, createdAt: true, user: { select: { name: true } }, problem: { select: { title: true } } } }),
    db.article.count({ where: { status: "IN_REVIEW" } }),
    db.report.count({ where: { status: "OPEN" } }),
    db.contactMessage.count({ where: { status: "NEW" } }),
    db.doubt.count({ where: { hidden: false, answers: { none: {} } } }),
  ]);

  const series = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now - (29 - i) * DAY);
    const key = d.toISOString().slice(0, 10);
    return {
      day: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      signups: users30.filter((u) => u.createdAt.toISOString().slice(0, 10) === key).length,
      submissions: subs30.filter((s) => s.createdAt.toISOString().slice(0, 10) === key).length,
      accepted: subs30.filter((s) => s.verdict === "ACCEPTED" && s.createdAt.toISOString().slice(0, 10) === key).length,
    };
  });

  const kpis = [
    { label: "Total users", value: totalUsers, Icon: Users, href: "/admin/users" },
    { label: "Daily active users", value: dau, Icon: Activity, href: "/admin/analytics" },
    { label: "New signups (7d)", value: newSignups, Icon: UserPlus, href: "/admin/users?sort=createdAt&dir=desc" },
    { label: "Submissions today", value: subsToday, Icon: Send, href: "/admin/analytics" },
  ];

  const feed = [
    ...audits.map((a) => ({ at: a.createdAt, text: `${a.actor?.name ?? "System"} · ${a.action} ${a.entityId ? `(${a.entityId})` : ""}`, kind: "Admin" })),
    ...recentUsers.map((u) => ({ at: u.createdAt, text: `${u.name} signed up`, kind: "Signup" })),
    ...recentSubs.map((s) => ({ at: s.createdAt, text: `${s.user.name} → ${s.problem?.title ?? "playground"}: ${s.verdict.replace(/_/g, " ").toLowerCase()}`, kind: "Submission" })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 12);

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="Platform health at a glance." />
      {pendingReview || openReports || newMessages || unanswered ? (
        <div className="flex flex-wrap gap-2 text-sm">
          {pendingReview ? <Link href="/admin/review" className="rounded-xl bg-cyan/15 px-3 py-1.5 text-cyan">{pendingReview} article(s) awaiting review</Link> : null}
          {openReports ? <Link href="/admin/moderation" className="rounded-xl bg-warning/15 px-3 py-1.5 text-warning">{openReports} open report(s)</Link> : null}
          {newMessages ? <Link href="/admin/inbox" className="rounded-xl bg-brand/15 px-3 py-1.5 text-brand-soft">{newMessages} new message(s)</Link> : null}
          {unanswered ? <Link href="/admin/doubts?filter=unanswered" className="rounded-xl bg-accent px-3 py-1.5">{unanswered} unanswered doubt(s)</Link> : null}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="glass hover-glow p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><k.Icon className="size-4 text-cyan" /> {k.label}</p>
            <p className="mt-2 font-heading text-3xl font-bold"><CountUp value={k.value} /></p>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="glass p-5" aria-labelledby="c1"><h2 id="c1" className="mb-3 font-semibold">Signups · last 30 days</h2><TrendChart data={series} keys={[{ key: "signups", label: "Signups", color: "#7C3AED" }]} /></section>
        <section className="glass p-5" aria-labelledby="c2"><h2 id="c2" className="mb-3 font-semibold">Submissions · last 30 days</h2><TrendChart data={series} keys={[{ key: "submissions", label: "Submissions", color: "#06B6D4" }, { key: "accepted", label: "Accepted", color: "#84CC16" }]} /></section>
      </div>
      <section className="glass p-5" aria-labelledby="feed">
        <h2 id="feed" className="mb-3 font-semibold">Recent activity</h2>
        <ul className="divide-y divide-border">
          {feed.map((f, i) => (
            <li key={i} className="flex items-center gap-3 py-2 text-sm">
              <span className="w-24 shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-center text-[11px] text-muted-foreground">{f.kind}</span>
              <span className="flex-1">{f.text}</span>
              <span className="text-xs text-muted-foreground">{timeAgo(f.at)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
