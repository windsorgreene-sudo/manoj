import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge, Table, tdCls, thCls, trCls } from "@/components/admin/ui";
import { ActionButton } from "@/components/admin/action-button";
import { deleteCourse } from "@/lib/actions/admin/courses";
import { db } from "@/lib/db";

export const metadata = { title: "Courses" };

export default async function AdminCourses() {
  const courses = await db.course.findMany({ orderBy: { createdAt: "asc" }, include: { _count: { select: { enrollments: true, modules: true } } } });
  return (
    <>
      <PageHeader title="Courses" description="Courses → modules → lessons." actions={<Button asChild className="rounded-xl"><Link href="/admin/courses/new"><Plus /> New course</Link></Button>} />
      <Table caption="Courses">
        <thead><tr className={thCls}><th scope="col" className="px-4 py-3">Title</th><th scope="col" className="px-4 py-3">Topic</th><th scope="col" className="px-4 py-3">Modules</th><th scope="col" className="px-4 py-3">Enrolled</th><th scope="col" className="px-4 py-3">Price</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className={trCls}>
              <td className={tdCls}><Link href={`/admin/courses/${c.id}`} className="font-medium hover:text-cyan">{c.title}</Link></td>
              <td className={`${tdCls} text-muted-foreground`}>{c.topic}</td>
              <td className={tdCls}>{c._count.modules}</td>
              <td className={tdCls}>{c._count.enrollments}</td>
              <td className={tdCls}>Free</td>
              <td className={tdCls}><StatusBadge status={c.status} /></td>
              <td className={`${tdCls} text-right`}><ActionButton size="xs" variant="ghost" className="text-danger" action={deleteCourse.bind(null, c.id)} confirm={`Delete “${c.title}”? Enrollments and progress will be removed.`} success="Course deleted">Delete</ActionButton></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
