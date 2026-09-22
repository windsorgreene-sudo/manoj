import Link from "next/link";
import {
  buildSearchIndex,
  categories,
  getLatestArticles,
  getPopularArticles,
  getRecentlyUpdated,
  getExamAndLabResources,
} from "@/content";
import { HomeSearch } from "@/components/HomeSearch";
import { ArticleListItem } from "@/components/ArticleListItem";
import { SectionHeading } from "@/components/SectionHeading";
import { formatDate } from "@/lib/site";
import { TypeBadge } from "@/components/Badge";

// Compact popular-category order (matches brief).
const POPULAR_ORDER = [
  "python",
  "java",
  "cpp",
  "csharp",
  "sql",
  "cyber-security",
  "software-engineering",
  "computer-science",
  "oose",
  "oopj",
  "data-structures",
];

export default function HomePage() {
  const index = buildSearchIndex();
  const latest = getLatestArticles(6);
  const popular = getPopularArticles(6);
  const updated = getRecentlyUpdated(5);
  const examLab = getExamAndLabResources(6);

  const popularCats = POPULAR_ORDER.map((s) => categories.find((c) => c.slug === s)!).filter(
    Boolean,
  );

  return (
    <>
      {/* Intro / hero — restrained, content-portal style */}
      <section className="border-b border-border bg-surface-2">
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:py-12">
          <h1 className="max-w-3xl text-2xl font-bold leading-tight text-text sm:text-3xl">
            Learn Computer Science &amp; Programming
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] text-text-muted">
            Practical tutorials, notes, assignments, lab work, programming concepts and
            examination resources.
          </p>
          <div className="mt-5 max-w-2xl">
            <HomeSearch index={index} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] px-4 py-8">
        {/* Popular categories */}
        <section className="mb-10">
          <SectionHeading title="Popular Categories" href="/tutorials" linkLabel="All categories" />
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
            {popularCats.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="group bg-surface p-4 transition-colors hover:bg-surface-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text group-hover:text-primary">
                    {c.shortName}
                  </span>
                </div>
                <p className="clamp-2 mt-1 text-[12px] text-text-muted">
                  {c.popularTopics.slice(0, 3).join(" · ")}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Two column: latest + sidebar sections */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <section className="mb-10">
              <SectionHeading title="Latest Articles" href="/tutorials" />
              <div>
                {latest.map((a) => (
                  <ArticleListItem key={a.slug} article={a} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeading title="Popular Tutorials" href="/tutorials" />
              <div>
                {popular.map((a) => (
                  <ArticleListItem key={a.slug} article={a} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <section>
              <SectionHeading title="Recently Updated" />
              <ul className="space-y-3">
                {updated.map((a) => (
                  <li key={a.slug} className="border-b border-border pb-3 last:border-b-0">
                    <Link
                      href={`/${a.category}/${a.slug}`}
                      className="text-[14px] font-medium leading-snug text-text hover:text-primary"
                    >
                      {a.title}
                    </Link>
                    <div className="mt-1 text-xs text-text-faint">
                      Updated {formatDate(a.updatedDate)}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionHeading title="Exam & Lab Resources" href="/resources" />
              <ul className="space-y-3">
                {examLab.map((a) => (
                  <li key={a.slug} className="border-b border-border pb-3 last:border-b-0">
                    <div className="mb-1">
                      <TypeBadge type={a.contentType} />
                    </div>
                    <Link
                      href={`/${a.category}/${a.slug}`}
                      className="text-[14px] font-medium leading-snug text-text hover:text-primary"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
