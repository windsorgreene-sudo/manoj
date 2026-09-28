import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Visualizer } from "@/components/practice/visualizer";
import { VISUALIZERS, type VisualizerSlug } from "@/lib/visualizers/algorithms";

export function generateStaticParams() {
  return VISUALIZERS.map((v) => ({ algo: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ algo: string }> }): Promise<Metadata> {
  const { algo } = await params;
  const v = VISUALIZERS.find((x) => x.slug === algo);
  return v ? { title: `${v.title} Visualizer`, description: v.description, alternates: { canonical: `/visualizers/${v.slug}` } } : {};
}

export default async function VisualizerPage({ params }: { params: Promise<{ algo: string }> }) {
  const { algo } = await params;
  const v = VISUALIZERS.find((x) => x.slug === algo);
  if (!v) notFound();
  return (
    <div className="container-cv py-10">
      <Link href="/visualizers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All visualizers</Link>
      <h1 className="mt-4 font-heading text-3xl font-bold md:text-4xl">{v.title}</h1>
      <p className="mt-2 mb-6 text-muted-foreground">{v.description}</p>
      <Visualizer slug={v.slug as VisualizerSlug} />
    </div>
  );
}
