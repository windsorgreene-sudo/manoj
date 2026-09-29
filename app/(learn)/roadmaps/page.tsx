import type { Metadata } from "next";
import Link from "next/link";
import { Map } from "lucide-react";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Roadmaps", description: "Interactive roadmaps for DSA, Web Development and AI/ML, every step links to a tutorial or problem.", alternates: { canonical: "/roadmaps" } };
export const revalidate = 3600;

export default async function RoadmapsPage() {
  const maps = await db.roadmap.findMany({ where: { isPublished: true }, orderBy: { createdAt: "asc" } });
  return (
    <div className="container-cv py-12 md:py-16">
      <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Know exactly what to learn next</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {maps.map((m) => (
          <Link key={m.id} href={`/roadmaps/${m.slug}`} className="glass gradient-border hover-glow p-6">
            <Map className="size-8 text-brand-soft" />
            <h2 className="mt-4 text-xl font-semibold">{m.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
            <p className="mt-6 text-xs text-muted-foreground">{(m.nodes as unknown[]).length} steps →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
