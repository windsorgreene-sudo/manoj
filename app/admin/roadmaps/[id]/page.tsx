import { notFound } from "next/navigation";
import { RoadmapEditor } from "@/components/admin/catalog-editors";
import type { RoadmapInput } from "@/lib/actions/admin/catalog";
import { db } from "@/lib/db";

export const metadata = { title: "Edit roadmap" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") return <RoadmapEditor initial={{ slug: "", title: "", description: "", isPublished: false, nodes: [{ id: "start", label: "Start here", x: 0, y: 0, href: "/tutorials", kind: "core" }], edges: [] }} />;
  const r = await db.roadmap.findUnique({ where: { id } });
  if (!r) notFound();
  return <RoadmapEditor initial={{ id: r.id, slug: r.slug, title: r.title, description: r.description, isPublished: r.isPublished, nodes: r.nodes as RoadmapInput["nodes"], edges: r.edges as RoadmapInput["edges"] }} />;
}
