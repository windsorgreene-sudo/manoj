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
      <header
        className="mt-4 rounded-lg border border-border bg-surface p-5 sm:p-6"
        style={{ borderLeft: `3px solid ${course.color}` }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-3xl"
            style={{ backgroundColor: `${course.color}1a` }}
          >
            {course.icon}
          </span>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-faint">
              {DIFF_LABEL[course.difficulty]} · {course.category}
            </span>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-text sm:text-3xl">
              {course.title}
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] text-text-muted">{course.longDescription}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-faint">
              <span>{total} lessons</span>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {Math.max(1, Math.round(mins / 60))} hours
              </span>
            </div>
            {first && (
              <Link
                href={`/courses/${course.slug}/${first.lesson.slug}`}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-contrast transition-colors hover:bg-primary-hover"
              >
                Start course →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Curriculum */}
      <section className="mt-8">
        <h2 className="font-display mb-4 text-xl font-bold text-text">Course content</h2>
        <CourseChapters course={course} />
      </section>
    </div>
  );
}
