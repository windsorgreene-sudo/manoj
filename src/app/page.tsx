import Link from "next/link";
import {
  buildSearchIndex,
  categories,
  countByCategory,
  getLatestArticles,
  getPopularArticles,
  getRecentlyUpdated,
  getExamAndLabResources,
  getStartHereArticles,
} from "@/content";
import { HomeSearch } from "@/components/HomeSearch";
import { ArticleListItem } from "@/components/ArticleListItem";
import { SectionHeading } from "@/components/SectionHeading";
import { SubjectIcon } from "@/components/SubjectIcon";
import { formatDate } from "@/lib/site";
import { subjectTheme } from "@/lib/subjectTheme";
import { TypeBadge } from "@/components/Badge";
import { ArrowRight, ClockIcon } from "@/components/icons";

// Compact popular-category order (matches brief).
const POPULAR_ORDER = [
  "python",
  "java",
  "cpp",
  "csharp",
  "sql",
  "data-structures",
  "cyber-security",
  "software-engineering",
  "computer-science",
  "oose",
  "oopj",
];

const QUICK_LINKS = [
  { label: "Assignments", href: "/type/assignment" },
  { label: "Lab Programs", href: "/type/lab" },
  { label: "Notes", href: "/type/notes" },
  { label: "MCQs & Tests", href: "/type/mcq" },
];

export default function HomePage() {
  const index = buildSearchIndex();
  const latest = getLatestArticles(6);
  const popular = getPopularArticles(6);
  const updated = getRecentlyUpdated(5);
  const examLab = getExamAndLabResources(6);
  const startHere = getStartHereArticles(4);

  const popularCats = POPULAR_ORDER.map((s) => categories.find((c) => c.slug === s)!).filter(
    Boolean,
  );

  return (
    <>
      {/* Intro / hero: friendly and clear, still content-first */}
      <section className="border-b border-border bg-gradient-to-b from-primary-soft to-bg">
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:py-14">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Free study portal for students
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-text sm:text-4xl">
            Learn Computer Science &amp; Programming, the simple way
          </h1>
          <p className="mt-3 max-w-2xl text-base text-text-muted">
            Clear tutorials, ready notes, solved lab programs, assignments and exam practice, all
            organised subject-wise so you always know what to study next.
          </p>
          <div className="mt-5 max-w-2xl">
            <HomeSearch index={index} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-text-muted">Quick access:</span>
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="rounded-full border border-border-strong bg-surface px-3 py-1 text-[13px] font-medium text-text transition-colors hover:border-primary hover:text-primary"
              >
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] px-4 py-8">
        {/* Choose a subject: colorful, scannable tiles */}
        <section className="mb-12">
          <SectionHeading title="Choose a Subject" href="/tutorials" linkLabel="All subjects" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularCats.map((c) => {
              const theme = subjectTheme(c.slug);
              const count = countByCategory(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
                  style={{ borderLeft: `3px solid ${theme.color}` }}
                >
                  <SubjectIcon slug={c.slug} />
                  <div className="min-w-0">
                    <span className="block font-semibold text-text group-hover:text-primary">
                      {c.shortName}
                    </span>
                    <span className="text-xs text-text-faint">
                      {count} {count === 1 ? "article" : "articles"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Start here: helps beginners know where to begin */}
        {startHere.length > 0 && (
          <section className="mb-12 rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-md bg-ok-soft px-2 py-1 text-xs font-semibold uppercase tracking-wide text-ok">
                New to coding?
              </span>
              <h2 className="text-lg font-bold text-text">Start here</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {startHere.map((a, i) => (
                <Link
                  key={a.slug}
                  href={`/${a.category}/${a.slug}`}
                  className="group flex flex-col rounded-lg border border-border p-3 transition-colors hover:border-primary"
                >
                  <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-text group-hover:text-primary">
                    {a.title}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-text-faint">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {a.readingMinutes} min read
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

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
            <section className="rounded-xl border border-border bg-surface p-4">
              <SectionHeading title="Recently Updated" />
              <ul className="space-y-3">
                {updated.map((a) => (
                  <li key={a.slug} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
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

            <section className="rounded-xl border border-border bg-surface p-4">
              <SectionHeading title="Exam & Lab Resources" href="/resources" />
              <ul className="space-y-3">
                {examLab.map((a) => (
                  <li key={a.slug} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
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

            <Link
              href="/resources"
              className="flex items-center justify-between rounded-xl border border-border bg-accent-soft p-4 transition-colors hover:border-accent"
            >
              <span>
                <span className="block font-semibold text-text">Study Resources</span>
                <span className="text-[13px] text-text-muted">
                  Assignments, labs, syllabus &amp; more
                </span>
              </span>
              <ArrowRight className="h-5 w-5 text-accent" />
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
