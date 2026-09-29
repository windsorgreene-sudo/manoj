import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from "lucide-react";
import { MdxContent } from "@/components/content/mdx-content";
import { ArticleActions } from "@/components/learn/article-actions";
import { ArticleBody } from "@/components/learn/article-body";
import { Comments } from "@/components/learn/comments";
import { InlineQuiz } from "@/components/learn/inline-quiz";
import { MobileTopics } from "@/components/learn/mobile-topics";
import { ReadingProgress } from "@/components/learn/reading-progress";
import { TableOfContents } from "@/components/learn/table-of-contents";
import { TopicTree } from "@/components/learn/topic-tree";
import { TutorLauncher } from "@/components/learn/tutor-launcher";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";
import { prepareMdx } from "@/lib/mdx";
import { getArticleBySlug, getRelatedArticles, getTutorialTree, prevNext } from "@/lib/queries/articles";
import { appUrl, formatDate } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const rows = await db.article.findMany({ where: { status: "PUBLISHED", isBlog: false }, select: { slug: true } });
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getArticleBySlug((await params).slug);
  if (!a) return {};
  return {
    title: a.seoTitle?.replace(" | Kodshala", "") ?? a.title,
    description: a.seoDescription ?? a.excerpt,
    alternates: { canonical: `/tutorials/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.excerpt, publishedTime: a.publishedAt?.toISOString(), modifiedTime: a.updatedAt.toISOString(), authors: [a.author.name] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const [tree, related, prepared] = await Promise.all([getTutorialTree(), getRelatedArticles(article), prepareMdx(article.content)]);
  const { prev, next } = prevNext(tree, slug);
  const quiz = article.quizzes[0];
  const url = `${appUrl()}/tutorials/${article.slug}`;

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.publishedAt?.toISOString(),
            dateModified: article.updatedAt.toISOString(),
            author: { "@type": "Person", name: article.author.name },
            publisher: { "@type": "Organization", name: "Kodshala", logo: { "@type": "ImageObject", url: `${appUrl()}/icon.svg` } },
            proficiencyLevel: article.difficulty === "EASY" ? "Beginner" : article.difficulty === "MEDIUM" ? "Intermediate" : "Expert",
            mainEntityOfPage: url,
            keywords: article.tags.map((t) => t.name).join(", "),
          },
          breadcrumbLd([
            { name: "Home", url: appUrl() },
            { name: "Tutorials", url: `${appUrl()}/tutorials` },
            ...(article.category ? [{ name: article.category.name, url: `${appUrl()}/tutorials#${article.category.slug}` }] : []),
            { name: article.title, url },
          ]),
        ]}
      />
      <div className="container-cv grid gap-10 py-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_220px]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2" data-lenis-prevent>
            <TopicTree tree={tree} current={slug} />
          </div>
        </aside>

        <article className="min-w-0">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/tutorials" className="hover:text-foreground">
              Tutorials
            </Link>
            <span aria-hidden>/</span>
            <span>{article.category?.name}</span>
            <span className="ml-auto">
              <MobileTopics tree={tree} current={slug} />
            </span>
          </nav>
          <header>
            <h1 className="font-heading text-3xl font-bold leading-tight md:text-5xl">{article.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <DifficultyBadge difficulty={article.difficulty} />
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" /> {article.readingMins} min read
              </span>
              <span>
                By{" "}
                {article.author.username ? (
                  <Link href={`/u/${article.author.username}`} className="font-medium text-foreground hover:underline">
                    {article.author.name}
                  </Link>
                ) : (
                  article.author.name
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" /> Updated <time dateTime={article.updatedAt.toISOString()}>{formatDate(article.updatedAt)}</time>
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-y border-border py-2">
              <ArticleActions articleId={article.id} title={article.title} slug={article.slug} />
              <TutorLauncher title={article.title} kind="article" content={article.content.slice(0, 6000)} />
            </div>
          </header>

          <div className="mt-8">
            <ArticleBody articleId={article.id}>
              <MdxContent content={article.content} prepared={prepared} />
            </ArticleBody>
          </div>

          {article.tags.length ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span key={t.slug} className="rounded-lg bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">
                  #{t.name}
                </span>
              ))}
            </div>
          ) : null}

          {quiz && quiz.questions.length ? <InlineQuiz quizId={quiz.id} questions={quiz.questions} /> : null}

          <nav aria-label="Previous and next tutorials" className="mt-12 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={`/tutorials/${prev.slug}`} className="glass hover-glow flex flex-col p-5">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3" /> Previous
                </span>
                <span className="mt-1 font-semibold">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/tutorials/${next.slug}`} className="glass hover-glow flex flex-col p-5 text-right">
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  Next <ArrowRight className="size-3" />
                </span>
                <span className="mt-1 font-semibold">{next.title}</span>
              </Link>
            ) : null}
          </nav>

          {related.length ? (
            <section aria-labelledby="related-title" className="mt-12">
              <h2 id="related-title" className="font-heading text-xl font-bold">
                Related tutorials
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/tutorials/${r.slug}`} className="glass hover-glow p-5">
                    <DifficultyBadge difficulty={r.difficulty} />
                    <h3 className="mt-2 font-semibold">{r.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <Comments target={{ articleId: article.id }} title="Comments" />
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-20">
            <TableOfContents items={prepared.toc} />
          </div>
        </aside>
      </div>
    </>
  );
}
