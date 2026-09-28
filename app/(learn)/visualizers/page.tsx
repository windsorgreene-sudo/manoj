import type { Metadata } from "next";
import Link from "next/link";
import { Wand2 } from "lucide-react";
import { VISUALIZERS } from "@/lib/visualizers/algorithms";

export const metadata: Metadata = { title: "Algorithm Visualizers", description: "Step through sorting, binary search, linked lists, stacks, queues, BSTs, BFS/DFS and Dijkstra with pseudocode highlighting.", alternates: { canonical: "/visualizers" } };

export default function VisualizersPage() {
  return (
    <div className="container-cv py-12 md:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Visualizers</p>
      <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">See algorithms think</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Play, pause, step and change speed while the pseudocode highlights the line being executed.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VISUALIZERS.map((v) => (
          <Link key={v.slug} href={`/visualizers/${v.slug}`} className="glass gradient-border hover-glow p-6">
            <Wand2 className="size-7 text-cyan" />
            <p className="mt-4 text-xs text-muted-foreground">{v.tag}</p>
            <h2 className="text-lg font-semibold">{v.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
          </Link>
        ))}
        <Link href="/lab" className="glass gradient-border hover-glow p-6">
          <Wand2 className="size-7 text-brand-soft" />
          <p className="mt-4 text-xs text-muted-foreground">3D</p>
          <h2 className="text-lg font-semibold">3D Data Structure Lab</h2>
          <p className="mt-1 text-sm text-muted-foreground">Orbit, zoom and click nodes of trees and graphs in 3D.</p>
        </Link>
      </div>
    </div>
  );
}
