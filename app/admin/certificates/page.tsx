import Link from "next/link";
import type { Prisma } from "@/lib/generated/prisma/client";
import { ActionButton } from "@/components/admin/action-button";
import { IssueCertificateForm } from "@/components/admin/community-forms";
import { PageHeader, Pagination, SearchForm, Table, tdCls, thCls, trCls } from "@/components/admin/ui";
import { revokeCertificate } from "@/lib/actions/admin/community";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Certificates" };

type SP = Promise<{ q?: string; page?: string }>;
const PAGE = 25;

export default async function AdminCertificates({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = sp.q?.trim().slice(0, 100);
  const page = Math.max(1, Number(sp.page) || 1);
  const where: Prisma.CertificateWhereInput = q
    ? { OR: [{ code: { contains: q.toUpperCase() } }, { user: { email: { contains: q, mode: "insensitive" } } }, { user: { name: { contains: q, mode: "insensitive" } } }, { course: { title: { contains: q, mode: "insensitive" } } }] }
    : {};
  const [total, rows, courses] = await Promise.all([
    db.certificate.count({ where }),
    db.certificate.findMany({ where, orderBy: { issuedAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE, include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } } }),
    db.course.findMany({ orderBy: { title: "asc" }, select: { slug: true, title: true } }),
  ]);
  const params = { q, page: String(page) };
  return (
    <>
      <PageHeader title="Certificates" description={`${total} issued`} />
      <IssueCertificateForm courses={courses} />
      <div className="mt-6"><SearchForm base="/admin/certificates" params={params} placeholder="Search ID, name, email or course" /></div>
      <div className="mt-4">
        <Table caption="Certificates">
          <thead><tr><th scope="col" className={`${thCls} px-4 py-3`}>ID</th><th scope="col" className={`${thCls} px-4 py-3`}>Learner</th><th scope="col" className={`${thCls} px-4 py-3`}>Course</th><th scope="col" className={`${thCls} px-4 py-3`}>Issued</th><th scope="col" className={`${thCls} px-4 py-3`}><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className={trCls}>
                <td className={`${tdCls} font-mono text-xs`}><Link href={`/verify/${c.code}`} className="hover:text-cyan">{c.code}</Link></td>
                <td className={tdCls}><p>{c.user.name}</p><p className="text-xs text-muted-foreground">{c.user.email}</p></td>
                <td className={tdCls}>{c.course.title}</td>
                <td className={`${tdCls} text-muted-foreground`}>{formatDate(c.issuedAt)}</td>
                <td className={`${tdCls} whitespace-nowrap text-right`}>
                  <a href={`/api/certificates/${c.code}`} className="mr-3 text-xs underline">PDF</a>
                  <ActionButton size="xs" variant="ghost" className="text-danger" action={revokeCertificate.bind(null, c.id)} confirm={`Revoke ${c.code}? The verification page will show "not found".`} success="Certificate revoked">Revoke</ActionButton>
                </td>
              </tr>
            ))}
            {!rows.length ? <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">No certificates match.</td></tr> : null}
          </tbody>
        </Table>
      </div>
      <Pagination page={page} pages={Math.max(1, Math.ceil(total / PAGE))} base="/admin/certificates" params={params} />
    </>
  );
}
