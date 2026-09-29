import Link from "next/link";
import { Award, Download, ExternalLink, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { db } from "@/lib/db";
import { issueCertificate, verifyUrl } from "@/lib/certificates";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Certificates" };

export default async function CertificatesPage() {
  const user = await requireUser("STUDENT", "/dashboard/certificates");
  // Backfill: any completed course without a certificate gets one now.
  const missing = await db.enrollment.findMany({ where: { userId: user.id, completedAt: { not: null }, course: { certificates: { none: { userId: user.id } } } }, select: { courseId: true } });
  for (const m of missing) await issueCertificate(user.id, m.courseId);

  const [certs, inProgress] = await Promise.all([
    db.certificate.findMany({ where: { userId: user.id }, orderBy: { issuedAt: "desc" }, include: { course: { select: { title: true, slug: true, color: true, level: true } } } }),
    db.enrollment.findMany({ where: { userId: user.id, completedAt: null }, orderBy: { progressPct: "desc" }, take: 4, include: { course: { select: { title: true, slug: true } } } }),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-3xl font-bold">Certificates</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every certificate has a unique ID and a QR code that links to a public verification page — add them to LinkedIn or your résumé.</p>
      </header>
      {certs.length ? (
        <ul className="grid gap-5 md:grid-cols-2">
          {certs.map((c) => (
            <li key={c.id} className="glass gradient-border overflow-hidden">
              <div className="relative p-6" style={{ background: `linear-gradient(135deg, ${c.course.color}33, transparent 70%)` }}>
                <Award className="size-10 text-warning" aria-hidden />
                <h2 className="mt-3 text-lg font-semibold">{c.course.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">Issued {formatDate(c.issuedAt)} · ID <span className="font-mono">{c.code}</span></p>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border p-4">
                <Button asChild size="sm" className="rounded-lg"><a href={`/api/certificates/${c.code}`} download><Download /> PDF</a></Button>
                <Button asChild size="sm" variant="outline" className="rounded-lg"><Link href={`/verify/${c.code}`}><ExternalLink /> Verification page</Link></Button>
                <CopyLinkButton url={verifyUrl(c.code)} />
                <Button asChild size="sm" variant="ghost" className="rounded-lg">
                  <a
                    href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(c.course.title)}&organizationName=CodeVerse&issueYear=${c.issuedAt.getFullYear()}&issueMonth=${c.issuedAt.getMonth() + 1}&certUrl=${encodeURIComponent(verifyUrl(c.code))}&certId=${c.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Add to LinkedIn
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No certificates yet"
          description="Complete every lesson in a course to earn a verifiable certificate."
          action={<Button asChild className="rounded-xl"><Link href="/dashboard/courses">Go to my courses</Link></Button>}
        />
      )}
      {inProgress.length ? (
        <section aria-labelledby="almost-h">
          <h2 id="almost-h" className="mb-3 flex items-center gap-2 font-semibold"><GraduationCap className="size-5 text-cyan" /> Almost there</h2>
          <ul className="glass divide-y divide-border">
            {inProgress.map((e) => (
              <li key={e.id} className="flex items-center gap-4 px-4 py-3 text-sm">
                <Link href={`/courses/${e.course.slug}`} className="flex-1 font-medium hover:text-cyan">{e.course.title}</Link>
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={e.progressPct} aria-valuemin={0} aria-valuemax={100} aria-label={`${e.course.title} progress`}>
                  <div className="h-full bg-brand" style={{ width: `${e.progressPct}%` }} />
                </div>
                <span className="w-10 text-right tabular-nums text-muted-foreground">{e.progressPct}%</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
