import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getTutorialTree } from "@/lib/queries/articles";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Tutorials",
  description: "In-depth tutorials on DSA, Python, JavaScript, Web Development, DBMS and Operating Systems with runnable code in C++, Java, Python and JS.",
  alternates: { canonical: "/tutorials" },
};
export const revalidate = 3600;

export default async function TutorialsPage() {
  const tree = await getTutorialTree();
  return (
    <div className="container-cv py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Learn with runnable examples</h1>
        <p className="mt-3 text-muted-foreground">Every tutorial has code in multiple languages, a “Try it Yourself” editor and a quick check at the end.</p>
      </header>
      {tree.length === 0 ? (
        <EmptyState className="mt-10" title="No tutorials published yet" />
      ) : (
        <div className="mt-10 space-y-12">
          {tree.map((cat) => (
            <section key={cat.slug} id={cat.slug} aria-labelledby={`cat-${cat.slug}`} className="scroll-mt-24">
              <h2 id={`cat-${cat.slug}`} className="flex items-center gap-2 font-heading text-2xl font-bold">
                <BookOpen className="size-5 text-brand-soft" /> {cat.name}
                <span className="text-sm font-normal text-muted-foreground">· {cat.articles.length} tutorials</span>
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cat.articles.map((a, i) => (
                  <Link key={a.slug} href={`/tutorials/${a.slug}`} className="glass hover-glow gradient-border flex items-start gap-3 p-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-2 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{a.title}</span>
                      <DifficultyBadge difficulty={a.difficulty} className="mt-2" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
