import { notFound } from "next/navigation";
import { SheetEditor } from "@/components/admin/catalog-editors";
import { db } from "@/lib/db";

export const metadata = { title: "Edit sheet" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slugs = (await db.problem.findMany({ select: { slug: true }, orderBy: { number: "asc" } })).map((p) => p.slug);
  if (id === "new") return <SheetEditor problemSlugs={slugs} initial={{ slug: "", title: "", description: "", kind: "TOPIC", company: "", isPublished: true, items: [] }} />;
  const s = await db.sheet.findUnique({ where: { id }, include: { items: { orderBy: { order: "asc" }, include: { problem: { select: { slug: true } } } } } });
  if (!s) notFound();
  return <SheetEditor problemSlugs={slugs} initial={{ id: s.id, slug: s.slug, title: s.title, description: s.description, kind: s.kind, company: s.company ?? "", isPublished: s.isPublished, items: s.items.map((i) => ({ problemSlug: i.problem.slug, section: i.section })) }} />;
}
