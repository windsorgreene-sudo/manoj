import { PageHeader, Pagination, SearchForm, Table, tdCls, thCls, trCls } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Audit log" };
const SIZE = 40;

export default async function Audit({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const where = sp.q ? { OR: [{ action: { contains: sp.q } }, { entity: { contains: sp.q } }, { entityId: { contains: sp.q } }, { actor: { name: { contains: sp.q, mode: "insensitive" as const } } }] } : {};
  const page = Math.max(1, Number(sp.page) || 1);
  const [total, rows] = await Promise.all([db.auditLog.count({ where }), db.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * SIZE, take: SIZE, include: { actor: { select: { name: true, email: true } } } })]);
  return (
    <>
      <PageHeader title="Audit log" description={`${total} admin actions recorded`} />
      <SearchForm base="/admin/audit" params={sp} placeholder="Filter by action, entity or admin…" />
      <Table caption="Audit log">
        <thead><tr className={thCls}><th scope="col" className="px-4 py-3">When</th><th scope="col" className="px-4 py-3">Actor</th><th scope="col" className="px-4 py-3">Action</th><th scope="col" className="px-4 py-3">Entity</th><th scope="col" className="px-4 py-3">Details</th><th scope="col" className="px-4 py-3">IP</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={trCls}>
              <td className={`${tdCls} whitespace-nowrap text-muted-foreground`}>{formatDate(r.createdAt, { dateStyle: "medium", timeStyle: "short" })}</td>
              <td className={tdCls}>{r.actor?.name ?? "System"}</td>
              <td className={`${tdCls} font-mono text-xs`}>{r.action}</td>
              <td className={tdCls}>{r.entity}{r.entityId ? <span className="text-muted-foreground"> · {r.entityId}</span> : null}</td>
              <td className={`${tdCls} max-w-xs truncate font-mono text-[11px] text-muted-foreground`}>{r.meta ? JSON.stringify(r.meta) : ""}</td>
              <td className={`${tdCls} text-xs text-muted-foreground`}>{r.ip ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination page={page} pages={Math.ceil(total / SIZE)} base="/admin/audit" params={sp} />
    </>
  );
}
