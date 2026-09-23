import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCourse,
  getLessonRef,
  getPrevNextLesson,
  getAllLessonParams,
} from "@/content/courses";
import { SITE } from "@/lib/site";
import { Breadcrumbs, BreadcrumbSchema, type Crumb } from "@/components/Breadcrumbs";
import { ArticleBody } from "@/components/ArticleBody";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { ReadingProgress } from "@/components/ReadingProgress";
import { LessonSidebar } from "@/components/content/LessonSidebar";
import { InlineQuiz } from "@/components/content/InlineQuiz";
import { MarkComplete } from "@/components/content/MarkComplete";
import { LessonPlayground } from "@/components/content/LessonPlayground";
import { ArrowLeft, ArrowRight, ClockIcon } from "@/components/icons";

export function generateStaticParams() {
  return getAllLessonParams();
}

type Params = Promise<{ courseSlug: string; lessonSlug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const ref = getLessonRef(courseSlug, lessonSlug);
  if (!ref) return {};
  const url = `/courses/${courseSlug}/${lessonSlug}`;
  return {
    title: `${ref.lesson.title} · ${ref.course.title}`,
    description: ref.lesson.description,
    alternates: { canonical: url },
    openGraph: { title: ref.lesson.title, description: ref.lesson.description, url, type: "article" },
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { courseSlug, lessonSlug } = await params;
  const ref = getLessonRef(courseSlug, lessonSlug);
  if (!ref) notFound();

  const course = getCourse(courseSlug)!;
  const { lesson } = ref;
  const { prev, next } = getPrevNextLesson(courseSlug, lessonSlug);
  const nextHref = next ? `/courses/${next.course}/${next.slug}` : undefined;

  const toc: TocItem[] = lesson.body
    .filter((n) => n.type === "heading")
    .map((n) => {
      const h = n as Extract<typeof n, { type: "heading" }>;
      const text = typeof h.text === "string" ? h.text : h.text.en;
      return { id: h.id, text, level: h.level };
    });

  const crumbs: Crumb[] = [
    { label: "Courses", href: "/courses" },
    { label: course.title, href: `/courses/${course.slug}` },
    { label: lesson.title },
  ];

  const lessonSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.description,
    isPartOf: { "@type": "Course", name: course.title },
    provider: { "@type": "Organization", name: SITE.name },
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6">
      <ReadingProgress />
      <BreadcrumbSchema items={crumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonSchema) }} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)_240px]">
        {/* Left: course navigation */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-4">
            <LessonSidebar course={course} currentSlug={lesson.slug} />
          </div>
        </aside>

        {/* Main content */}
        <article className="min-w-0">
          <Breadcrumbs items={crumbs} />

          <div className="animate-fade-up mt-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white"
                style={{ background: course.color }}
              >
                {course.title}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-text-faint">
                <ClockIcon className="h-3.5 w-3.5" />
                {lesson.duration} min read
              </span>
            </div>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl">
              {lesson.title}
            </h1>
            <p className="mt-2 text-[16px] leading-relaxed text-text-muted">{lesson.description}</p>
          </div>

          {/* Mobile course nav */}
          <details className="mt-4 rounded-xl border border-border bg-surface-2 p-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-text">
              Course contents
            </summary>
            <div className="mt-3">
              <LessonSidebar course={course} currentSlug={lesson.slug} />
            </div>
          </details>

          <div className="mt-6 border-t border-border pt-6">
            <ArticleBody nodes={lesson.body} />
          </div>

          {/* Try it yourself */}
          {lesson.codeExample && (
            <LessonPlayground
              code={lesson.codeExample}
              language={lesson.codeLanguage || "javascript"}
            />
          )}

          {/* Inline quiz */}
          {lesson.quiz && lesson.quiz.length > 0 && <InlineQuiz questions={lesson.quiz} />}

          {/* Mark complete */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <MarkComplete courseSlug={course.slug} lessonSlug={lesson.slug} nextHref={nextHref} />
            <span className="text-sm text-text-muted">Was this helpful?</span>
          </div>

          {/* Prev / Next */}
          <nav className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/courses/${prev.course}/${prev.slug}`}
                className="hover-lift group flex flex-col rounded-xl border border-border bg-surface p-4"
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
                href={`/courses/${next.course}/${next.slug}`}
                className="hover-lift group flex flex-col rounded-xl border border-border bg-surface p-4 text-right sm:items-end"
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
        </article>

        {/* Right: table of contents */}
        <aside className="hidden lg:block">
          {toc.length > 0 && (
            <div className="sticky top-24 rounded-2xl border border-border bg-surface p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-text-faint">
                On this page
              </p>
              <TableOfContents items={toc} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
