import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Blog", description: "Engineering stories, career advice and product updates from Kodshala.", alternates: { canonical: "/blog" } };
export const revalidate = 600;

export default async function BlogPage() {
  const posts = await db.article.findMany({
    where: { isBlog: true, status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, excerpt: true, publishedAt: true, readingMins: true, author: { select: { name: true } }, tags: { select: { name: true } } },
  });
  return (
    <div className="container-cv py-16">
      <header className="max-w-2xl">
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Notes from the Kodshala team</h1>
      </header>
      {posts.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="glass gradient-border hover-glow flex flex-col p-6">
              <div className="flex gap-2 text-xs text-cyan">{p.tags.map((t) => <span key={t.name}>#{t.name}</span>)}</div>
              <h2 className="mt-3 text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
              <p className="mt-6 text-xs text-muted-foreground">
                {p.author.name} · {p.publishedAt ? formatDate(p.publishedAt) : ""} · {p.readingMins} min read
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState className="mt-10" title="No posts yet" description="Check back soon." />
      )}
    </div>
  );
}
