import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { RoadmapGraph, type RoadmapNode } from "@/components/practice/roadmap-graph";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await db.roadmap.findMany({ select: { slug: true } })).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = await db.roadmap.findUnique({ where: { slug: (await params).slug } });
  return r ? { title: r.title, description: r.description, alternates: { canonical: `/roadmaps/${r.slug}` } } : {};
}

export default async function RoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
  const r = await db.roadmap.findUnique({ where: { slug: (await params).slug } });
  if (!r || !r.isPublished) notFound();
  return (
    <div className="container-cv py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Roadmap</p>
      <h1 className="mt-2 font-heading text-4xl font-bold">{r.title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{r.description}</p>
      <RoadmapGraph slug={r.slug} nodes={r.nodes as RoadmapNode[]} edges={r.edges as [string, string][]} />
    </div>
  );
}
