import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { AskDoubtForm } from "@/components/doubts/doubt-forms";

export const metadata: Metadata = { title: "Ask a doubt", robots: { index: false } };

export default async function AskPage() {
  await requireUser("STUDENT", "/doubts/ask");
  const tags = await db.tag.findMany({ orderBy: { doubts: { _count: "desc" } }, take: 12, select: { slug: true } });
  return (
    <div className="container-cv max-w-3xl py-10 md:py-14">
      <Link href="/doubts" className="inline-flex items-center gap-1 py-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Doubts forum</Link>
      <h1 className="mt-4 font-heading text-3xl font-bold md:text-4xl">Ask a doubt</h1>
      <p className="mt-2 mb-8 text-muted-foreground">Clear questions get answered faster. Include what you tried.</p>
      <AskDoubtForm suggestedTags={tags.map((t) => t.slug)} />
    </div>
  );
}
