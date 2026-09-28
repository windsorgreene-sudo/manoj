import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";

export const metadata = { title: "Search" };

export default async function AdminSearch({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);
  const ins = { contains: q, mode: "insensitive" as const };
  const [users, articles, problems, courses] = q
    ? await Promise.all([
        db.user.findMany({ where: { OR: [{ name: ins }, { email: ins }] }, take: 8, select: { id: true, name: true, email: true } }),
        db.article.findMany({ where: { title: ins }, take: 8, select: { id: true, title: true, status: true } }),
        db.problem.findMany({ where: { title: ins }, take: 8, select: { id: true, title: true, number: true } }),
        db.course.findMany({ where: { title: ins }, take: 8, select: { id: true, title: true } }),
      ])
    : [[], [], [], []];
  const groups = [
    { title: "Users", items: users.map((u) => ({ href: `/admin/users/${u.id}`, label: `${u.name} · ${u.email}` })) },
    { title: "Articles", items: articles.map((a) => ({ href: `/admin/articles/${a.id}`, label: `${a.title} · ${a.status}` })) },
    { title: "Problems", items: problems.map((p) => ({ href: `/admin/problems/${p.id}`, label: `${p.number}. ${p.title}` })) },
    { title: "Courses", items: courses.map((c) => ({ href: `/admin/courses/${c.id}`, label: c.title })) },
  ];
  const total = groups.reduce((t, g) => t + g.items.length, 0);
  return (
    <>
      <PageHeader title={q ? `Results for “${q}”` : "Search"} description={q ? `${total} results` : "Use the search box in the top bar."} />
      {q && total === 0 ? <EmptyState title="No results" /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.filter((g) => g.items.length).map((g) => (
            <section key={g.title} className="glass p-4" aria-labelledby={`g-${g.title}`}>
              <h2 id={`g-${g.title}`} className="mb-2 font-semibold">{g.title}</h2>
              <ul className="space-y-1 text-sm">{g.items.map((i) => <li key={i.href}><Link href={i.href} className="hover:text-cyan">{i.label}</Link></li>)}</ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
