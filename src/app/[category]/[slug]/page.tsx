import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticle,
  getCategory,
  getAuthor,
  getAllArticleParams,
  getRelatedArticles,
  getPrevNext,
  getArticlesByCategory,
  getRecentlyUpdated,
} from "@/content";
import { SITE, formatDate } from "@/lib/site";
import { Breadcrumbs, BreadcrumbSchema, type Crumb } from "@/components/Breadcrumbs";
import { ArticleBody } from "@/components/ArticleBody";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ArticleTitle, ArticleDescription } from "@/components/ArticleHeading";
import { Reveal } from "@/components/Reveal";
import { SidebarCard } from "@/components/Sidebar";
import { CompactArticleLink } from "@/components/ArticleListItem";
import { SubjectIcon } from "@/components/SubjectIcon";
import { TypeBadge, DifficultyLabel } from "@/components/Badge";
import { ArrowLeft, ArrowRight, ClockIcon } from "@/components/icons";

export function generateStaticParams() {
  return getAllArticleParams();
}

type Params = Promise<{ category: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(slug);
  if (!article || article.category !== category) return {};
  const url = `/${article.category}/${article.slug}`;
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.description,
      url,
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate,
      authors: [getAuthor(article.authorId)?.name ?? SITE.author],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { category, slug } = await params;
  const article = getArticle(slug);
  if (!article || article.category !== category) notFound();

  const cat = getCategory(article.category)!;
  const author = getAuthor(article.authorId);
  const related = getRelatedArticles(article, 4);
  const { prev, next } = getPrevNext(article);
  const morePython = getArticlesByCategory(article.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 5);
  const latest = getRecentlyUpdated(5);
  const href = `/${article.category}/${article.slug}`;

  const toc: TocItem[] = article.body
    .filter((n) => n.type === "heading")
    .map((n) => {
      const h = n as Extract<typeof n, { type: "heading" }>;
      const text = typeof h.text === "string" ? h.text : h.text.en;
      const textHi = typeof h.text === "string" ? undefined : h.text.hi;
      return { id: h.id, text, textHi, level: h.level };
    });

  const crumbs: Crumb[] = [
    { label: cat.name, href: `/${cat.slug}` },
    { label: article.title },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate,
    author: { "@type": "Person", name: author?.name ?? SITE.author },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
    mainEntityOfPage: `${SITE.url}${href}`,
    keywords: article.tags.join(", "),
    articleSection: cat.name,
  };

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <ReadingProgress />
      <BreadcrumbSchema items={crumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs items={crumbs} />

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        {/* Main content */}
        <article className="min-w-0">
          <div className="animate-fade-up flex items-start gap-3">
            <div className="hidden sm:block">
              <SubjectIcon slug={article.category} size="lg" />
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <TypeBadge type={article.contentType} />
                <Link
                  href={`/${cat.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {cat.name}
                </Link>
              </div>
              <ArticleTitle en={article.title} hi={article.titleHi} />
            </div>
          </div>
          <ArticleDescription en={article.description} hi={article.descriptionHi} />

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4 text-[13px] text-text-muted">
            <span>By {author?.name ?? SITE.author}</span>
            <span>Updated {formatDate(article.updatedDate)}</span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {article.readingMinutes} min read
            </span>
            {article.difficulty && <DifficultyLabel level={article.difficulty} />}
            <div className="ml-auto">
              <BookmarkButton slug={article.slug} title={article.title} href={href} />
            </div>
          </div>

          {/* Mobile TOC (collapsible) */}
          {toc.length > 0 && (
            <details className="mt-4 rounded-md border border-border bg-surface-2 p-3 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold text-text">
                Table of Contents
              </summary>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-text-muted">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="hover:text-primary">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          <div className="mt-5">
            <ArticleBody nodes={article.body} />
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-5">
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-sm bg-surface-2 px-2 py-1 text-xs text-text-muted"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {article.legacyUrl && (
            <p className="mt-4 text-xs text-text-faint">
              This article was migrated and updated from the original blog post.
            </p>
          )}

          {/* Prev / Next */}
          <nav className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/${prev.category}/${prev.slug}`}
                className="group flex flex-col rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-surface-2"
              >
                <span className="inline-flex items-center gap-1 text-xs font-medium text-text-faint">
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </span>
                <span className="mt-1 text-sm font-semibold text-text group-hover:text-primary">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/${next.category}/${next.slug}`}
                className="group flex flex-col rounded-lg border border-border p-4 text-right transition-colors hover:border-primary hover:bg-surface-2 sm:items-end"
              >
                <span className="inline-flex items-center gap-1 text-xs font-medium text-text-faint">
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="mt-1 text-sm font-semibold text-text group-hover:text-primary">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>

          {/* Related articles */}
          {related.length > 0 && (
            <Reveal as="section" className="mt-10">
              <h2 className="mb-4 flex items-center gap-2 border-b border-border pb-2 text-lg font-bold text-text">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-primary to-accent" aria-hidden />
                Keep learning: related topics
              </h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/${r.category}/${r.slug}`}
                      className="hover-lift group flex h-full gap-3 rounded-xl border border-border bg-surface p-3.5 hover:border-primary/50"
                    >
                      <span className="transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                        <SubjectIcon slug={r.category} size="sm" />
                      </span>
                      <div className="min-w-0">
                        <div className="mb-1">
                          <TypeBadge type={r.contentType} />
                        </div>
                        <span className="block text-sm font-semibold text-text transition-colors group-hover:text-primary">
                          {r.title}
                        </span>
                        <p className="clamp-2 mt-1 text-[13px] text-text-muted">{r.description}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </article>

        {/* Right sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {toc.length > 0 && (
              <SidebarCard title="On this page">
                <TableOfContents items={toc} />
              </SidebarCard>
            )}
            <SidebarCard title={`Popular ${cat.shortName} Topics`}>
              <ul className="space-y-1.5">
                {cat.popularTopics.map((t) => (
                  <li key={t} className="text-[13px] text-text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </SidebarCard>
            {morePython.length > 0 && (
              <SidebarCard title={`More ${cat.shortName} Tutorials`}>
                <ul className="space-y-2">
                  {morePython.map((a) => (
                    <CompactArticleLink key={a.slug} article={a} />
                  ))}
                </ul>
              </SidebarCard>
            )}
            <SidebarCard title="Latest Updates">
              <ul className="space-y-2">
                {latest.map((a) => (
                  <CompactArticleLink key={a.slug} article={a} />
                ))}
              </ul>
            </SidebarCard>
          </div>
        </aside>
      </div>
    </div>
  );
}
