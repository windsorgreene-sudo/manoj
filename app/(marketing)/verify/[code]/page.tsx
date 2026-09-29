import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Download, ShieldX } from "lucide-react";
import { getCertificate } from "@/lib/certificates";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { appUrl, formatDate } from "@/lib/utils";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cert = await getCertificate((await params).code.toUpperCase());
  if (!cert) return { title: "Certificate not found", robots: { index: false } };
  return { title: `${cert.user.name} — ${cert.course.title} certificate`, description: `Verified CodeVerse certificate ${cert.code} issued to ${cert.user.name} for completing ${cert.course.title}.`, robots: { index: false, follow: true } };
}

export default async function VerifyCodePage({ params }: Props) {
  const code = (await params).code.toUpperCase();
  const cert = await getCertificate(code);
  if (!cert) {
    return (
      <div className="container-cv flex min-h-[60vh] items-center justify-center py-16">
        <div className="glass max-w-md p-8 text-center" role="alert">
          <ShieldX className="mx-auto size-12 text-danger" aria-hidden />
          <h1 className="mt-4 font-heading text-2xl font-bold">Certificate not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">No certificate matches <span className="font-mono">{code.slice(0, 30)}</span>. Check the ID for typos — it looks like <span className="font-mono">CV-XX-2026-XXXX</span>.</p>
          <Button asChild variant="outline" className="mt-6 rounded-xl"><Link href="/verify">Try another ID</Link></Button>
        </div>
      </div>
    );
  }
  return (
    <div className="container-cv flex min-h-[60vh] items-center justify-center py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOccupationalCredential",
          name: `${cert.course.title} — Certificate of Completion`,
          credentialCategory: "certificate",
          identifier: cert.code,
          dateCreated: cert.issuedAt.toISOString(),
          recognizedBy: { "@type": "Organization", name: "CodeVerse", url: appUrl() },
          about: { "@type": "Course", name: cert.course.title, url: `${appUrl()}/courses/${cert.course.slug}` },
        }}
      />
      <article className="glass gradient-border w-full max-w-xl p-8 text-center">
        <BadgeCheck className="mx-auto size-14 text-success" aria-hidden />
        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-success">Verified certificate</p>
        <h1 className="mt-4 font-heading text-3xl font-bold">{cert.user.name}</h1>
        <p className="mt-2 text-muted-foreground">successfully completed</p>
        <p className="mt-2 text-xl font-semibold">
          <Link href={`/courses/${cert.course.slug}`} className="hover:text-cyan">{cert.course.title}</Link>
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-4 text-left text-sm">
          <div className="rounded-xl border border-border p-3"><dt className="text-xs text-muted-foreground">Certificate ID</dt><dd className="mt-1 font-mono">{cert.code}</dd></div>
          <div className="rounded-xl border border-border p-3"><dt className="text-xs text-muted-foreground">Issued</dt><dd className="mt-1">{formatDate(cert.issuedAt, { dateStyle: "long" })}</dd></div>
          <div className="rounded-xl border border-border p-3"><dt className="text-xs text-muted-foreground">Level</dt><dd className="mt-1 capitalize">{cert.course.level.toLowerCase()}</dd></div>
          <div className="rounded-xl border border-border p-3"><dt className="text-xs text-muted-foreground">Issuer</dt><dd className="mt-1">CodeVerse Learning Pvt. Ltd.</dd></div>
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-xl"><a href={`/api/certificates/${cert.code}?inline=1`} target="_blank" rel="noopener noreferrer"><Download /> View PDF</a></Button>
          {cert.user.username ? <Button asChild variant="outline" className="rounded-xl"><Link href={`/u/${cert.user.username}`}>View profile</Link></Button> : null}
        </div>
      </article>
    </div>
  );
}
