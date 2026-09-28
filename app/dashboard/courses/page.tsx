import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressRing } from "@/components/learn/course-enroll";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "My Courses" };

export default async function MyCoursesPage() {
  const user = await requireUser();
  const enrollments = await db.enrollment.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, include: { course: { select: { slug: true, title: true, subtitle: true, color: true } } } });
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">My courses</h1>
      {enrollments.length === 0 ? (
        <EmptyState title="You haven't enrolled yet" description="Pick a course to get structured lessons and a certificate." action={<Button asChild className="rounded-xl"><Link href="/courses">Browse courses</Link></Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enrollments.map((e) => (
            <Link key={e.id} href={`/courses/${e.course.slug}`} className="glass hover-glow flex items-center gap-4 p-5">
              <ProgressRing pct={e.progressPct} size={64} />
              <div className="min-w-0">
                <p className="font-semibold">{e.course.title}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{e.course.subtitle}</p>
                <p className="mt-1 text-xs text-muted-foreground">{e.completedAt ? `Completed ${formatDate(e.completedAt)} 🎓` : `Enrolled ${formatDate(e.createdAt)}`}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
