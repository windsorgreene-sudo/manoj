import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "My Articles" };

export default async function MyArticlesPage() {
  const user = await requireUser("CONTRIBUTOR", "/dashboard/articles");
  const articles = await db.article.findMany({ where: { authorId: user.id }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, status: true, updatedAt: true, views: true, reviewNote: true } });
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="font-heading text-3xl font-bold">My articles</h1><p className="text-sm text-muted-foreground">Write drafts and submit them for editorial review.</p></div>
        <Button asChild className="rounded-xl"><Link href="/dashboard/articles/new"><Plus /> New article</Link></Button>
      </div>
      {articles.length === 0 ? (
        <EmptyState title="No articles yet" description="Share what you know, your first tutorial could help thousands." action={<Button asChild className="rounded-xl"><Link href="/dashboard/articles/new">Start writing</Link></Button>} />
      ) : (
        <ul className="glass divide-y divide-border">
          {articles.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <Link href={`/dashboard/articles/${a.id}`} className="flex-1 font-medium hover:text-cyan">{a.title}</Link>
              {a.reviewNote && a.status === "CHANGES_REQUESTED" ? <span className="text-xs text-warning">Feedback available</span> : null}
              <StatusBadge status={a.status} />
              <span className="text-xs text-muted-foreground">{a.views} views · {formatDate(a.updatedAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
