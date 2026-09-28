import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge, Table, tdCls, thCls, trCls } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/action-button";
import { deleteContest } from "@/lib/actions/admin/catalog";
import { db } from "@/lib/db";

export const metadata = { title: "Contests" };

export default async function Page() {
  const rows = await db.contest.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { participants: true, problems: true } } } });
  return (
    <>
      <PageHeader title="Contests" description={`${rows.length} total`} actions={<Button asChild className="rounded-xl"><Link href="/admin/contests/new"><Plus /> New</Link></Button>} />
      <Table caption="Contests">
        <thead><tr className={thCls}><th scope="col" className="px-4 py-3">Title</th><th scope="col" className="px-4 py-3">Slug</th><th scope="col" className="px-4 py-3">Details</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={trCls}>
              <td className={tdCls}><Link href={`/admin/contests/${r.id}`} className="font-medium hover:text-cyan">{r.title}</Link></td>
              <td className={`${tdCls} font-mono text-xs text-muted-foreground`}>{r.slug}</td>
              <td className={`${tdCls} text-muted-foreground`}>{r._count.problems} problems · {r._count.participants} participants · {r.startsAt.toLocaleString("en-IN")}</td>
              <td className={tdCls}><StatusBadge status={r.isPublished ? "PUBLISHED" : "DRAFT"} /></td>
              <td className={`${tdCls} text-right`}><ActionButton size="xs" variant="ghost" className="text-danger" action={deleteContest.bind(null, r.id)} confirm={`Delete “${r.title}”?`} success="Deleted">Delete</ActionButton></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
