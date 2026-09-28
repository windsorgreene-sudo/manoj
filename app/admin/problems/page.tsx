import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Pagination, SearchForm, SortHeader, StatusBadge, Table, selectCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/action-button";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { deleteProblem } from "@/lib/actions/admin/problems";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export const metadata = { title: "Problems" };
type SP = { q?: string; difficulty?: string; sort?: string; dir?: string; page?: string };
const SIZE = 25;

export default async function AdminProblems({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const where: Prisma.ProblemWhereInput = { ...(sp.q ? { title: { contains: sp.q, mode: "insensitive" } } : {}), ...(sp.difficulty ? { difficulty: sp.difficulty as "EASY" } : {}) };
  const sort = ["number", "title", "totalSubmissions"].includes(sp.sort ?? "") ? (sp.sort as string) : "number";
  const page = Math.max(1, Number(sp.page) || 1);
  const [total, rows] = await Promise.all([
    db.problem.count({ where }),
    db.problem.findMany({ where, orderBy: { [sort]: sp.dir === "desc" ? "desc" : "asc" }, skip: (page - 1) * SIZE, take: SIZE, include: { _count: { select: { testCases: true, submissions: true } } } }),
  ]);
  const base = "/admin/problems";
  return (
    <>
      <PageHeader title="Problems" description={`${total} problems`} actions={<Button asChild className="rounded-xl"><Link href="/admin/problems/new"><Plus /> New problem</Link></Button>} />
      <SearchForm base={base} params={sp} placeholder="Search problems…" extra={<select name="difficulty" defaultValue={sp.difficulty ?? ""} className={selectCls} aria-label="Difficulty"><option value="">Any difficulty</option><option>EASY</option><option>MEDIUM</option><option>HARD</option></select>} />
      <Table caption="Problems">
        <thead><tr className={thCls}><SortHeader label="#" field="number" base={base} params={sp} /><SortHeader label="Title" field="title" base={base} params={sp} /><th scope="col" className="px-4 py-3">Difficulty</th><th scope="col" className="px-4 py-3">Tests</th><th scope="col" className="px-4 py-3">Submissions</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className={trCls}>
              <td className={`${tdCls} tabular-nums`}>{p.number}</td>
              <td className={tdCls}><Link href={`/admin/problems/${p.id}`} className="font-medium hover:text-cyan">{p.title}</Link></td>
              <td className={tdCls}><DifficultyBadge difficulty={p.difficulty} /></td>
              <td className={tdCls}>{p._count.testCases}</td>
              <td className={tdCls}>{p._count.submissions}</td>
              <td className={tdCls}><StatusBadge status={p.status} /></td>
              <td className={`${tdCls} text-right`}><ActionButton size="xs" variant="ghost" className="text-danger" action={deleteProblem.bind(null, p.id)} confirm={`Delete “${p.title}” and all its submissions?`} success="Problem deleted">Delete</ActionButton></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination page={page} pages={Math.ceil(total / SIZE)} base={base} params={sp} />
    </>
  );
}
