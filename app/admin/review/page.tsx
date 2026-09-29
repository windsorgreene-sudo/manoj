import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/admin/ui";
import { ReviewCard } from "@/components/admin/review-card";
import { ActionButton } from "@/components/admin/action-button";
import { decideApplication } from "@/lib/actions/admin/platform";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Review queue" };

export default async function ReviewQueue() {
  const [articles, apps] = await Promise.all([
    db.article.findMany({ where: { status: "IN_REVIEW" }, orderBy: { updatedAt: "asc" }, include: { author: { select: { name: true, email: true } }, category: { select: { name: true } } } }),
    db.contributorApplication.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" }, include: { user: { select: { name: true, email: true } } } }),
  ]);
  return (
    <>
      <PageHeader title="Contributor review queue" description="Approve, request changes with comments, or reject." />
      <section className="space-y-3" aria-labelledby="art">
        <h2 id="art" className="font-semibold">Articles awaiting review ({articles.length})</h2>
        {articles.length ? articles.map((a) => (
          <ReviewCard key={a.id} id={a.id} title={a.title} meta={`${a.author.name} · ${a.category?.name ?? "Uncategorised"} · submitted ${formatDate(a.updatedAt)}`} excerpt={a.excerpt} editHref={`/admin/articles/${a.id}`} />
        )) : <EmptyState title="Inbox zero" description="No articles are waiting for review." />}
      </section>
      <section className="mt-10 space-y-3" aria-labelledby="apps">
        <h2 id="apps" className="font-semibold">Contributor applications ({apps.length})</h2>
        {apps.length ? apps.map((a) => (
          <article key={a.id} className="glass space-y-2 p-5">
            <p className="font-semibold">{a.user.name} <span className="text-sm font-normal text-muted-foreground">· {a.user.email} · {formatDate(a.createdAt)}</span></p>
            <p className="text-sm"><strong>Expertise:</strong> {a.expertise}</p>
            {a.portfolio ? <p className="text-sm"><strong>Portfolio:</strong> <Link href={a.portfolio} target="_blank" rel="noopener noreferrer nofollow" className="text-cyan underline">{a.portfolio}</Link></p> : null}
            <details className="text-sm"><summary className="cursor-pointer text-muted-foreground">Writing sample</summary><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-surface-2 p-3 text-xs">{a.sample}</pre></details>
            <div className="flex gap-2">
              <ActionButton size="sm" className="rounded-xl" action={decideApplication.bind(null, { id: a.id, approve: true })} success="Approved, user is now a contributor">Approve</ActionButton>
              <ActionButton size="sm" variant="outline" className="rounded-xl" action={decideApplication.bind(null, { id: a.id, approve: false })} confirm="Reject this application?" success="Rejected">Reject</ActionButton>
            </div>
          </article>
        )) : <p className="text-sm text-muted-foreground">No pending applications.</p>}
      </section>
    </>
  );
}
