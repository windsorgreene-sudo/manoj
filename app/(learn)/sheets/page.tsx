import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ListChecks } from "lucide-react";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "DSA Sheets", description: "Curated topic-wise and company-wise DSA problem sheets with progress tracking.", alternates: { canonical: "/sheets" } };
export const revalidate = 600;

export default async function SheetsPage() {
  const sheets = await db.sheet.findMany({ where: { isPublished: true }, orderBy: { createdAt: "asc" }, include: { _count: { select: { items: true } } } });
  return (
    <div className="container-cv py-12 md:py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">DSA sheets</p>
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Follow a proven problem list</h1>
        <p className="mt-3 text-muted-foreground">Topic-wise and company-wise sheets. Your progress updates automatically when you get Accepted.</p>
      </header>
      {sheets.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {sheets.map((s) => (
            <Link key={s.id} href={`/sheets/${s.slug}`} className="glass gradient-border hover-glow flex flex-col p-6">
              {s.kind === "COMPANY" ? <Building2 className="size-8 text-warning" /> : <ListChecks className="size-8 text-cyan" />}
              <h2 className="mt-4 text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-6 text-xs text-muted-foreground">{s._count.items} problems · {s.kind === "COMPANY" ? `Company: ${s.company}` : "Topic-wise"}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState className="mt-10" title="No sheets yet" />
      )}
    </div>
  );
}
