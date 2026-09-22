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
import { Reveal } from "@/components/Reveal";
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
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-soft via-bg to-bg">
        {/* Soft decorative glows for depth (subtle, not flashy) */}
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1240px] px-4 py-12 sm:py-16">
          <p className="animate-fade-up mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
            Free study portal for students
          </p>
          <h1
            className="animate-fade-up max-w-3xl text-3xl font-bold leading-tight tracking-tight text-text sm:text-5xl"
            style={{ animationDelay: "60ms" }}
          >
            Learn Computer Science &amp;{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Programming
            </span>
            , the simple way
          </h1>
          <p
            className="animate-fade-up mt-4 max-w-2xl text-base text-text-muted sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Clear tutorials, ready notes, solved lab programs, assignments and exam practice, all
            organised subject-wise so you always know what to study next.
          </p>
          <div
            className="animate-fade-up mt-6 max-w-2xl"
            style={{ animationDelay: "180ms" }}
          >
            <HomeSearch index={index} />
          </div>
          <div
            className="animate-fade-up mt-4 flex flex-wrap items-center gap-2"
            style={{ animationDelay: "240ms" }}
          >
            <span className="text-sm text-text-muted">Quick access:</span>
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="rounded-full border border-border-strong bg-surface px-3 py-1 text-[13px] font-medium text-text transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[var(--shadow-sm)]"
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
            {popularCats.map((c, i) => {
              const theme = subjectTheme(c.slug);
              const count = countByCategory(c.slug);
              return (
                <Reveal key={c.slug} delay={i * 45}>
                  <Link
                    href={`/${c.slug}`}
                    className="hover-lift group flex h-full items-start gap-3 rounded-xl border border-border bg-surface p-4 hover:border-primary/50"
                    style={{ borderLeft: `3px solid ${theme.color}` }}
                  >
                    <span className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <SubjectIcon slug={c.slug} />
                    </span>
                    <div className="min-w-0">
                      <span className="block font-semibold text-text transition-colors group-hover:text-primary">
                        {c.shortName}
                      </span>
                      <span className="text-xs text-text-faint">
                        {count} {count === 1 ? "article" : "articles"}
                      </span>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Start here: helps beginners know where to begin */}
        {startHere.length > 0 && (
          <Reveal
            as="section"
            className="mb-12 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-primary-soft/40 p-5 shadow-[var(--shadow-sm)] sm:p-6"
          >
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
                  className="hover-lift group flex flex-col rounded-xl border border-border bg-surface p-4 hover:border-primary/50"
                >
                  <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-contrast shadow-[var(--shadow-sm)] transition-transform duration-300 group-hover:scale-110">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-text transition-colors group-hover:text-primary">
                    {a.title}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-text-faint">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {a.readingMinutes} min read
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {/* Two column: latest + sidebar sections */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <Reveal as="section" className="mb-10">
              <SectionHeading title="Latest Articles" href="/tutorials" />
              <div>
                {latest.map((a) => (
                  <ArticleListItem key={a.slug} article={a} />
                ))}
              </div>
            </Reveal>

            <Reveal as="section">
              <SectionHeading title="Popular Tutorials" href="/tutorials" />
              <div>
                {popular.map((a) => (
                  <ArticleListItem key={a.slug} article={a} />
                ))}
              </div>
            </Reveal>
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
              className="hover-lift group flex items-center justify-between rounded-xl border border-accent/30 bg-accent-soft p-4 hover:border-accent"
            >
              <span>
                <span className="block font-semibold text-text">Study Resources</span>
                <span className="text-[13px] text-text-muted">
                  Assignments, labs, syllabus &amp; more
                </span>
              </span>
              <ArrowRight className="h-5 w-5 text-accent transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
