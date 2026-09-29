import Link from "next/link";
import type { Prisma } from "@/lib/generated/prisma/client";
import { ActionButton } from "@/components/admin/action-button";
import { PageHeader, Pagination, SearchForm, StatusBadge, Table, selectCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { deleteDoubt, setDoubtHidden } from "@/lib/actions/admin/community";
import { db } from "@/lib/db";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Doubts" };

type SP = Promise<{ q?: string; filter?: string; page?: string }>;
const PAGE = 25;

export default async function AdminDoubts({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = sp.q?.trim().slice(0, 100);
  const filter = sp.filter === "hidden" || sp.filter === "unanswered" || sp.filter === "reported" ? sp.filter : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const reportedIds = filter === "reported" ? (await db.report.findMany({ where: { targetType: "DOUBT", status: "OPEN" }, select: { targetId: true } })).map((r) => r.targetId) : [];
  const where: Prisma.DoubtWhereInput = {
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { user: { email: { contains: q, mode: "insensitive" } } }] } : {}),
    ...(filter === "hidden" ? { hidden: true } : {}),
    ...(filter === "unanswered" ? { hidden: false, answers: { none: {} } } : {}),
    ...(filter === "reported" ? { id: { in: reportedIds } } : {}),
  };
  const [total, rows, open] = await Promise.all([
    db.doubt.count({ where }),
    db.doubt.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE, include: { user: { select: { name: true, email: true } }, _count: { select: { answers: true } } } }),
    db.doubt.count({ where: { hidden: false, answers: { none: {} } } }),
  ]);
  const params = { q, filter, page: String(page) };
  return (
    <>
      <PageHeader title="Doubts" description={`${total} shown · ${open} still unanswered`} />
      <SearchForm
        base="/admin/doubts"
        params={params}
        placeholder="Search title or author email"
        extra={
          <select name="filter" defaultValue={filter ?? ""} className={selectCls} aria-label="Filter">
            <option value="">All</option>
            <option value="unanswered">Unanswered</option>
            <option value="reported">Reported</option>
            <option value="hidden">Hidden</option>
          </select>
        }
      />
      <div className="mt-4">
        <Table caption="Doubts">
          <thead><tr><th scope="col" className={`${thCls} px-4 py-3`}>Title</th><th scope="col" className={`${thCls} px-4 py-3`}>Author</th><th scope="col" className={`${thCls} px-4 py-3`}>Answers</th><th scope="col" className={`${thCls} px-4 py-3`}>Status</th><th scope="col" className={`${thCls} px-4 py-3`}>Asked</th><th scope="col" className={`${thCls} px-4 py-3`}><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className={trCls}>
                <td className={`${tdCls} max-w-md`}><Link href={`/doubts/${d.id}`} className="line-clamp-2 font-medium hover:text-cyan">{d.title}</Link></td>
                <td className={tdCls}><p>{d.user.name}</p><p className="text-xs text-muted-foreground">{d.user.email}</p></td>
                <td className={`${tdCls} tabular-nums`}>{d._count.answers}{d.acceptedAnswerId ? <span className="ml-1 text-xs text-success">accepted</span> : null}</td>
                <td className={tdCls}><StatusBadge status={d.hidden ? "HIDDEN" : "PUBLISHED"} /></td>
                <td className={`${tdCls} whitespace-nowrap text-muted-foreground`}>{timeAgo(d.createdAt)}</td>
                <td className={`${tdCls} whitespace-nowrap text-right`}>
                  <ActionButton size="xs" variant="ghost" action={setDoubtHidden.bind(null, { id: d.id, hidden: !d.hidden })} success={d.hidden ? "Doubt is visible again" : "Doubt hidden"}>{d.hidden ? "Unhide" : "Hide"}</ActionButton>
                  <ActionButton size="xs" variant="ghost" className="text-danger" action={deleteDoubt.bind(null, d.id)} confirm="Delete this doubt and all its answers? This can't be undone." success="Deleted">Delete</ActionButton>
                </td>
              </tr>
            ))}
            {!rows.length ? <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">Nothing here.</td></tr> : null}
          </tbody>
        </Table>
      </div>
      <Pagination page={page} pages={Math.max(1, Math.ceil(total / PAGE))} base="/admin/doubts" params={params} />
    </>
  );
}
