import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  getCategory,
  getArticlesByCategory,
  getRecentlyUpdated,
} from "@/content";
import type { Article, ContentType } from "@/content/types";
import { SITE } from "@/lib/site";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";
import { ArticleListItem, CompactArticleLink } from "@/components/ArticleListItem";
import { SidebarCard } from "@/components/Sidebar";
import { SubjectIcon } from "@/components/SubjectIcon";
import { subjectTheme } from "@/lib/subjectTheme";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/${cat.slug}` },
    openGraph: { title: cat.name, description: cat.description, url: `/${cat.slug}` },
  };
}

// Content-type groupings rendered as sections on the category page.
const SECTIONS: { type: ContentType; heading: string }[] = [
  { type: "tutorial", heading: "Tutorials" },
  { type: "article", heading: "Articles" },
  { type: "assignment", heading: "Assignments" },
  { type: "lab", heading: "Lab Programs" },
  { type: "mcq", heading: "MCQs / Tests" },
  { type: "notes", heading: "Notes" },
  { type: "syllabus", heading: "Syllabus" },
];

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const all = getArticlesByCategory(cat.slug);
  const byType = (t: ContentType) =>
    all
      .filter((a) => a.contentType === t)
      .sort((x, y) => +new Date(y.updatedDate) - +new Date(x.updatedDate));

  const relatedCats = categories.filter(
    (c) => c.group === cat.group && c.slug !== cat.slug,
  );
  const latest = getRecentlyUpdated(5);

  const sectionsWithContent = SECTIONS.map((s) => ({ ...s, items: byType(s.type) })).filter(
    (s) => s.items.length > 0,
  );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.name,
    description: cat.description,
    url: `${SITE.url}/${cat.slug}`,
  };

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <BreadcrumbSchema items={[{ label: cat.name }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Breadcrumbs items={[{ label: cat.name }]} />

      <header
        className="mt-4 flex items-start gap-4 rounded-xl border border-border bg-surface p-5"
        style={{ borderLeft: `4px solid ${subjectTheme(cat.slug).color}` }}
      >
        <div className="hidden sm:block">
          <SubjectIcon slug={cat.slug} size="lg" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[26px] font-bold leading-tight text-text sm:text-[30px]">
            {cat.name}
          </h1>
          <p className="mt-2 max-w-3xl text-[15px] text-text-muted">{cat.description}</p>
          <p className="mt-3 text-sm text-text-faint">
            {all.length} {all.length === 1 ? "resource" : "resources"} available
          </p>
        </div>
      </header>

      {/* Jump-to chips help students go straight to what they need */}
      {sectionsWithContent.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sectionsWithContent.map((s) => (
            <a
              key={s.type}
              href={`#${s.type}`}
              className="rounded-full border border-border-strong bg-surface px-3 py-1 text-[13px] font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              {s.heading} ({s.items.length})
            </a>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {sectionsWithContent.length === 0 && (
            <div className="rounded-xl border border-dashed border-border-strong bg-surface p-8 text-center">
              <p className="text-sm text-text-muted">
                New {cat.shortName} material is being added here. Meanwhile, explore other subjects.
              </p>
              <Link
                href="/tutorials"
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                Browse all subjects →
              </Link>
            </div>
          )}
          {sectionsWithContent.map((s) => (
            <section key={s.type} id={s.type} className="mb-8 scroll-mt-24">
              <h2 className="mb-3 border-b-2 border-primary/70 pb-2 text-lg font-bold text-text">
                {s.heading}
              </h2>
              <div>
                {s.items.map((a: Article) => (
                  <ArticleListItem key={a.slug} article={a} showCategory={false} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <SidebarCard title="Popular Topics">
            <ul className="space-y-1.5">
              {cat.popularTopics.map((t) => (
                <li key={t} className="text-[13px] text-text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </SidebarCard>

          {relatedCats.length > 0 && (
            <SidebarCard title="Related Categories">
              <ul className="space-y-1.5">
                {relatedCats.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/${c.slug}`} className="text-[13px] text-text-muted hover:text-primary">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarCard>
          )}

          <SidebarCard title="Latest Articles">
            <ul className="space-y-2">
              {latest.map((a) => (
                <CompactArticleLink key={a.slug} article={a} />
              ))}
            </ul>
          </SidebarCard>
        </aside>
      </div>
    </div>
  );
}
