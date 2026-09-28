import Link from "next/link";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/action-button";
import { EmptyState } from "@/components/ui/empty-state";
import { resolveReport, toggleHidden } from "@/lib/actions/admin/platform";
import { db } from "@/lib/db";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Moderation" };

export default async function Moderation() {
  const [reports, comments, doubts] = await Promise.all([
    db.report.findMany({ where: { status: "OPEN" }, orderBy: { createdAt: "asc" }, include: { reporter: { select: { name: true } } } }),
    db.comment.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { user: { select: { name: true } }, article: { select: { slug: true, title: true } }, problem: { select: { slug: true, title: true } } } }),
    db.doubt.findMany({ orderBy: { createdAt: "desc" }, take: 15, include: { user: { select: { name: true } }, _count: { select: { answers: true } } } }),
  ]);
  const targets = new Map<string, string>();
  for (const r of reports) {
    if (r.targetType === "COMMENT") targets.set(r.id, (await db.comment.findUnique({ where: { id: r.targetId }, select: { body: true } }))?.body ?? "(deleted)");
    else if (r.targetType === "ARTICLE") targets.set(r.id, (await db.article.findUnique({ where: { id: r.targetId }, select: { title: true } }))?.title ?? "(deleted)");
    else if (r.targetType === "DOUBT") targets.set(r.id, (await db.doubt.findUnique({ where: { id: r.targetId }, select: { title: true } }))?.title ?? "(deleted)");
  }
  return (
    <>
      <PageHeader title="Moderation" description="Reported content, recent comments and doubts." />
      <section className="space-y-3" aria-labelledby="rep">
        <h2 id="rep" className="font-semibold">Open reports ({reports.length})</h2>
        {reports.length ? reports.map((r) => (
          <article key={r.id} className="glass space-y-2 p-4 text-sm">
            <p className="flex flex-wrap items-center gap-2"><StatusBadge status={r.status} /> <strong>{r.targetType}</strong> · {r.reason} · by {r.reporter.name} · {timeAgo(r.createdAt)}</p>
            {r.details ? <p className="text-muted-foreground">{r.details}</p> : null}
            <blockquote className="rounded-xl bg-surface-2 p-3 text-xs">{targets.get(r.id)}</blockquote>
            <div className="flex flex-wrap gap-2">
              {["COMMENT", "DOUBT", "ANSWER"].includes(r.targetType) ? <ActionButton size="sm" variant="destructive" className="rounded-xl" action={resolveReport.bind(null, { id: r.id, action: "resolve", hideTarget: true })} success="Hidden & resolved">Hide content & resolve</ActionButton> : null}
              <ActionButton size="sm" className="rounded-xl" action={resolveReport.bind(null, { id: r.id, action: "resolve" })} success="Resolved">Mark resolved</ActionButton>
              <ActionButton size="sm" variant="ghost" className="rounded-xl" action={resolveReport.bind(null, { id: r.id, action: "dismiss" })} success="Dismissed">Dismiss</ActionButton>
              {r.targetType === "ARTICLE" ? <Link href={`/admin/articles/${r.targetId}`} className="self-center text-xs text-cyan underline">Open article</Link> : null}
            </div>
          </article>
        )) : <EmptyState title="No open reports" />}
      </section>
      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="com"><h2 id="com" className="mb-2 font-semibold">Recent comments</h2>
          <ul className="glass divide-y divide-border">{comments.map((c) => (
            <li key={c.id} className="flex items-start gap-3 p-3 text-sm">
              <div className="min-w-0 flex-1"><p className="line-clamp-2">{c.body}</p><p className="text-xs text-muted-foreground">{c.user.name} on {c.article ? <Link className="underline" href={`/tutorials/${c.article.slug}`}>{c.article.title}</Link> : c.problem ? <Link className="underline" href={`/problems/${c.problem.slug}`}>{c.problem.title}</Link> : "—"} · {timeAgo(c.createdAt)}</p></div>
              <ActionButton size="xs" variant={c.hidden ? "outline" : "ghost"} action={toggleHidden.bind(null, { type: "COMMENT", id: c.id, hidden: !c.hidden })} success={c.hidden ? "Unhidden" : "Hidden"}>{c.hidden ? "Unhide" : "Hide"}</ActionButton>
            </li>))}
          </ul>
        </section>
        <section aria-labelledby="dou"><h2 id="dou" className="mb-2 font-semibold">Recent doubts</h2>
          <ul className="glass divide-y divide-border">{doubts.map((d) => (
            <li key={d.id} className="flex items-start gap-3 p-3 text-sm">
              <div className="min-w-0 flex-1"><Link href={`/doubts/${d.id}`} className="font-medium hover:text-cyan">{d.title}</Link><p className="text-xs text-muted-foreground">{d.user.name} · {d._count.answers} answers · {timeAgo(d.createdAt)}</p></div>
              <ActionButton size="xs" variant={d.hidden ? "outline" : "ghost"} action={toggleHidden.bind(null, { type: "DOUBT", id: d.id, hidden: !d.hidden })} success={d.hidden ? "Unhidden" : "Hidden"}>{d.hidden ? "Unhide" : "Hide"}</ActionButton>
            </li>))}
          </ul>
        </section>
      </div>
    </>
  );
}
