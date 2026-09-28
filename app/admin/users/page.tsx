import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Pagination, SearchForm, SortHeader, StatusBadge, Table, selectCls, tdCls, thCls, trCls, withParams } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { formatDate, timeAgo } from "@/lib/utils";
import type { Prisma } from "@/lib/generated/prisma/client";

export const metadata = { title: "Users" };
type SP = { q?: string; role?: string; sort?: string; dir?: string; page?: string };
const SIZE = 25;

export default async function AdminUsers({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const where: Prisma.UserWhereInput = {
    ...(sp.q ? { OR: [{ name: { contains: sp.q, mode: "insensitive" } }, { email: { contains: sp.q, mode: "insensitive" } }, { username: { contains: sp.q.toLowerCase() } }] } : {}),
    ...(sp.role === "BANNED" ? { banned: true } : sp.role ? { role: sp.role as "STUDENT" } : {}),
  };
  const dir = sp.dir === "asc" ? "asc" : "desc";
  const orderBy: Prisma.UserOrderByWithRelationInput = sp.sort === "name" ? { name: dir } : sp.sort === "xp" ? { profile: { xp: dir } } : sp.sort === "lastActiveAt" ? { lastActiveAt: { sort: dir, nulls: "last" } } : { createdAt: dir };
  const page = Math.max(1, Number(sp.page) || 1);
  const [total, rows] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({ where, orderBy, skip: (page - 1) * SIZE, take: SIZE, select: { id: true, name: true, email: true, role: true, banned: true, isPro: true, createdAt: true, lastActiveAt: true, profile: { select: { xp: true } } } }),
  ]);
  const base = "/admin/users";
  return (
    <>
      <PageHeader title="Users" description={`${total} users`} actions={<Button asChild variant="outline" className="rounded-xl"><a href={withParams("/api/admin/users/export", { q: sp.q, role: sp.role }, {})}><Download /> Export CSV</a></Button>} />
      <SearchForm base={base} params={sp} placeholder="Search name, email or username…" extra={
        <select name="role" defaultValue={sp.role ?? ""} className={selectCls} aria-label="Role"><option value="">All roles</option><option>STUDENT</option><option>CONTRIBUTOR</option><option>ADMIN</option><option value="BANNED">Banned</option></select>} />
      <Table caption="Users">
        <thead><tr className={thCls}><SortHeader label="Name" field="name" base={base} params={sp} /><th scope="col" className="px-4 py-3">Email</th><th scope="col" className="px-4 py-3">Role</th><SortHeader label="XP" field="xp" base={base} params={sp} /><SortHeader label="Joined" field="createdAt" base={base} params={sp} /><SortHeader label="Last active" field="lastActiveAt" base={base} params={sp} /></tr></thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className={trCls}>
              <td className={tdCls}><Link href={`/admin/users/${u.id}`} className="font-medium hover:text-cyan">{u.name}</Link>{u.isPro ? <span className="ml-2 text-[10px] text-warning">PRO</span> : null}</td>
              <td className={`${tdCls} text-muted-foreground`}>{u.email}</td>
              <td className={tdCls}>{u.banned ? <StatusBadge status="BANNED" /> : <span className="text-xs">{u.role}</span>}</td>
              <td className={`${tdCls} tabular-nums`}>{u.profile?.xp ?? 0}</td>
              <td className={`${tdCls} text-muted-foreground`}>{formatDate(u.createdAt)}</td>
              <td className={`${tdCls} text-muted-foreground`}>{u.lastActiveAt ? timeAgo(u.lastActiveAt) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination page={page} pages={Math.ceil(total / SIZE)} base={base} params={sp} />
    </>
  );
}
