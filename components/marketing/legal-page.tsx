import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="container-cv max-w-3xl py-16">
      <h1 className="font-heading text-4xl font-bold md:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
      <div className="prose-cv mt-10">{children}</div>
    </article>
  );
}
