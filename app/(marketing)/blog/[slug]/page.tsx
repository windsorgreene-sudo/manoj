import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { MdxContent } from "@/components/content/mdx-content";
import { LangVariant } from "@/components/i18n/lang-variant";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { appUrl, formatDate } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await db.article.findMany({ where: { isBlog: true, status: "PUBLISHED" }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

async function getPost(slug: string) {
  return db.article.findFirst({ where: { slug, isBlog: true, status: "PUBLISHED" }, include: { author: { select: { name: true } } } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.publishedAt?.toISOString() },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="container-cv max-w-3xl py-16">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            author: { "@type": "Person", name: post.author.name },
            mainEntityOfPage: `${appUrl()}/blog/${post.slug}`,
          },
          breadcrumbLd([
            { name: "Home", url: appUrl() },
            { name: "Blog", url: `${appUrl()}/blog` },
            { name: post.title, url: `${appUrl()}/blog/${post.slug}` },
          ]),
        ]}
      />
      <Link href="/blog" className="inline-flex items-center gap-1 py-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All posts
      </Link>
      <h1 className="mt-6 font-heading text-4xl font-bold md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        {post.author.name} · {post.publishedAt ? formatDate(post.publishedAt) : ""} · {post.readingMins} min read
      </p>
      <div className="mt-10">
        <LangVariant en={<MdxContent content={post.content} tryIt={false} />} hinglish={post.contentHinglish ? <MdxContent content={post.contentHinglish} tryIt={false} /> : null} />
      </div>
    </article>
  );
}
