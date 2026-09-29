import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SheetView } from "@/components/practice/sheet-view";

export const revalidate = 600;

export async function generateStaticParams() {
  return (await db.sheet.findMany({ select: { slug: true } })).map((s) => ({ slug: s.slug }));
}

async function getSheet(slug: string) {
  return db.sheet.findFirst({
    where: { slug, isPublished: true },
    include: { items: { orderBy: { order: "asc" }, include: { problem: { select: { id: true, slug: true, title: true, number: true, difficulty: true, topics: true } } } } },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = await getSheet((await params).slug);
  return s ? { title: s.title, description: s.description, alternates: { canonical: `/sheets/${s.slug}` } } : {};
}

export default async function SheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const sheet = await getSheet((await params).slug);
  if (!sheet) notFound();
  const sections = [...new Set(sheet.items.map((i) => i.section))].map((name) => ({ name, items: sheet.items.filter((i) => i.section === name).map((i) => i.problem) }));
  return (
    <div className="container-cv max-w-5xl py-12">
      <h1 className="mt-3 font-heading text-4xl font-bold">{sheet.title}</h1>
      <p className="mt-2 text-muted-foreground">{sheet.description}</p>
      <SheetView sheetId={sheet.id} sections={sections} />
    </div>
  );
}
