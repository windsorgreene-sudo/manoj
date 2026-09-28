import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { RemoveBookmarkButton } from "@/components/dashboard/remove-bookmark";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const user = await requireUser();
  const items = await db.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { article: { select: { slug: true, title: true, difficulty: true, readingMins: true } }, problem: { select: { slug: true, title: true, difficulty: true, number: true } } },
  });
  const articles = items.filter((i) => i.article);
  const problems = items.filter((i) => i.problem);
  if (!items.length)
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-3xl font-bold">Bookmarks</h1>
        <EmptyState title="Nothing saved yet" description="Bookmark tutorials and problems to find them here." action={<Button asChild className="rounded-xl"><Link href="/tutorials">Explore tutorials</Link></Button>} />
      </div>
    );
  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-bold">Bookmarks</h1>
      {[{ title: "Tutorials", list: articles }, { title: "Problems", list: problems }].map((g) => (
        <section key={g.title} aria-labelledby={`bm-${g.title}`}>
          <h2 id={`bm-${g.title}`} className="mb-3 font-semibold">{g.title} ({g.list.length})</h2>
          <ul className="glass divide-y divide-border">
            {g.list.map((b) => {
              const t = b.article ?? b.problem;
              if (!t) return null;
              const href = b.article ? `/tutorials/${b.article.slug}` : `/problems/${b.problem?.slug}`;
              return (
                <li key={b.id} className="flex items-center gap-3 px-4 py-3">
                  <Link href={href} className="flex-1 text-sm font-medium hover:text-cyan">{b.problem ? `${b.problem.number}. ` : ""}{t.title}</Link>
                  <DifficultyBadge difficulty={t.difficulty} />
                  <RemoveBookmarkButton id={b.id} />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
