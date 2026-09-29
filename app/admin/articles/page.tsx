import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Pagination, SearchForm, SortHeader, StatusBadge, Table, selectCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/action-button";
import { deleteArticle } from "@/lib/actions/admin/articles";
import { db } from "@/lib/db";
import { publishDueArticles } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import type { Prisma } from "@/lib/generated/prisma/client";

export const metadata = { title: "Articles" };
type SP = { q?: string; status?: string; sort?: string; dir?: string; page?: string };
const SIZE = 20;

export default async function AdminArticles({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  await publishDueArticles();
  const where: Prisma.ArticleWhereInput = {
    ...(sp.q ? { OR: [{ title: { contains: sp.q, mode: "insensitive" } }, { slug: { contains: sp.q } }] } : {}),
    ...(sp.status ? { status: sp.status as "DRAFT" } : {}),
  };
  const sortField = ["title", "updatedAt", "views", "status"].includes(sp.sort ?? "") ? (sp.sort as string) : "updatedAt";
  const page = Math.max(1, Number(sp.page) || 1);
  const [total, rows] = await Promise.all([
    db.article.count({ where }),
    db.article.findMany({ where, orderBy: { [sortField]: sp.dir === "asc" ? "asc" : "desc" }, skip: (page - 1) * SIZE, take: SIZE, include: { author: { select: { name: true } }, category: { select: { name: true } } } }),
  ]);
  const base = "/admin/articles";
  return (
    <>
      <PageHeader title="Articles" description={`${total} articles`} actions={<Button asChild className="rounded-xl"><Link href="/admin/articles/new"><Plus /> New article</Link></Button>} />
      <SearchForm base={base} params={sp} placeholder="Search title or slug…" extra={
        <select name="status" defaultValue={sp.status ?? ""} className={selectCls} aria-label="Status">
          <option value="">All statuses</option>{["DRAFT", "IN_REVIEW", "CHANGES_REQUESTED", "SCHEDULED", "PUBLISHED", "REJECTED", "ARCHIVED"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>} />
      <Table caption="Articles">
        <thead><tr className={thCls}><SortHeader label="Title" field="title" base={base} params={sp} /><th scope="col" className="px-4 py-3">Category</th><th scope="col" className="px-4 py-3">Author</th><SortHeader label="Status" field="status" base={base} params={sp} /><SortHeader label="Views" field="views" base={base} params={sp} /><SortHeader label="Updated" field="updatedAt" base={base} params={sp} /><th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className={trCls}>
              <td className={tdCls}><Link href={`/admin/articles/${a.id}`} className="font-medium hover:text-cyan">{a.title}</Link>{a.isBlog ? <span className="ml-2 text-[10px] text-muted-foreground">BLOG</span> : null}</td>
              <td className={`${tdCls} text-muted-foreground`}>{a.category?.name ?? "-"}</td>
              <td className={`${tdCls} text-muted-foreground`}>{a.author.name}</td>
              <td className={tdCls}><StatusBadge status={a.status} /></td>
              <td className={`${tdCls} tabular-nums`}>{a.views.toLocaleString("en-IN")}</td>
              <td className={`${tdCls} text-muted-foreground`}>{formatDate(a.updatedAt)}</td>
              <td className={`${tdCls} text-right`}><ActionButton size="xs" variant="ghost" className="text-danger" action={deleteArticle.bind(null, a.id)} confirm={`Delete “${a.title}” permanently?`} success="Article deleted">Delete</ActionButton></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination page={page} pages={Math.ceil(total / SIZE)} base={base} params={sp} />
    </>
  );
}
