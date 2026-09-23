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
import { CourseArt } from "@/components/course/CourseArt";
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
        className="animate-fade-up relative mt-4 overflow-hidden rounded-3xl border border-border p-6 text-white shadow-[var(--shadow-md)] sm:p-8"
        style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}bb)` }}
      >
        <CourseArt color={course.color} className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="text-6xl drop-shadow">{course.icon}</span>
          <div>
            <span className="rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
              {DIFF_LABEL[course.difficulty]}
            </span>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-2 max-w-2xl text-white/90">{course.longDescription}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span>{total} lessons</span>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {Math.max(1, Math.round(mins / 60))} hours
              </span>
              <span>{course.category}</span>
            </div>
          </div>
        </div>
        {first && (
          <Link
            href={`/courses/${course.slug}/${first.lesson.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Start course →
          </Link>
        )}
      </header>

      {/* Curriculum */}
      <section className="mt-8">
        <h2 className="font-display mb-4 text-xl font-bold text-text">Course content</h2>
        <CourseChapters course={course} />
      </section>
    </div>
  );
}
