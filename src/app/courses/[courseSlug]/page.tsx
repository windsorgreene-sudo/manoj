import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  courses,
  getCourse,
  lessonCount,
  totalMinutes,
  flattenLessons,
} from "@/content/courses";
import { SITE } from "@/lib/site";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";
import { CourseChapters } from "./CourseChapters";
import { TrackCourse } from "@/components/content/TrackCourse";
import { ClockIcon } from "@/components/icons";

export function generateStaticParams() {
  return courses.map((c) => ({ courseSlug: c.slug }));
}

type Params = Promise<{ courseSlug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: { title: course.title, description: course.description, url: `/courses/${course.slug}` },
  };
}

const DIFF_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default async function CoursePage({ params }: { params: Params }) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const total = lessonCount(course);
  const mins = totalMinutes(course);
  const first = flattenLessons(course)[0];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: { "@type": "Organization", name: SITE.name, sameAs: SITE.url },
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6">
      <BreadcrumbSchema items={[{ label: "Courses", href: "/courses" }, { label: course.title }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <Breadcrumbs items={[{ label: "Courses", href: "/courses" }, { label: course.title }]} />
      <TrackCourse slug={course.slug} title={course.title} icon={course.icon} color={course.color} />

      {/* Course header */}
      <header className="animate-fade-up mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Small colored icon chip (only splash of course color) */}
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl"
          style={{ background: `${course.color}1f`, border: `1px solid ${course.color}40` }}
        >
          {course.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
              style={{ background: `${course.color}1f`, color: course.color }}
            >
              {DIFF_LABEL[course.difficulty]}
            </span>
            <span className="text-xs text-text-faint">{course.category}</span>
          </div>
          <h1 className="font-display mt-2 text-xl font-bold tracking-tight text-text sm:text-2xl">
            {course.title}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-muted">
            {course.longDescription}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-faint">
            <span>{total} lessons</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-border-strong" />
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5" />
              {Math.max(1, Math.round(mins / 60))} hours
            </span>
          </div>
          {first && (
            <Link
              href={`/courses/${course.slug}/${first.lesson.slug}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-contrast transition-all hover:bg-primary-hover"
            >
              Start course →
            </Link>
          )}
        </div>
      </header>

      {/* Curriculum */}
      <section className="mt-8 border-t border-border pt-6">
        <h2 className="font-display mb-3 text-base font-bold text-text">Course content</h2>
        <CourseChapters course={course} />
      </section>
    </div>
  );
}
