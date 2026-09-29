import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CheckCircle2, Clock, Globe, Star, Users } from "lucide-react";
import { EnrollCard, ReviewForm, Syllabus } from "@/components/learn/course-enroll";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";
import { getCourseDetail } from "@/lib/queries/course-detail";
import { appUrl, formatDate } from "@/lib/utils";

export const revalidate = 600;

export async function generateStaticParams() {
  return (await db.course.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } })).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getCourseDetail((await params).slug);
  if (!c) return {};
  return { title: c.title, description: c.subtitle, alternates: { canonical: `/courses/${c.slug}` }, openGraph: { title: c.title, description: c.subtitle } };
}

const LEVEL = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" } as const;

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const course = await getCourseDetail((await params).slug);
  if (!course) notFound();
  const first = course.modules[0]?.lessons[0]?.slug ?? "";
  const url = `${appUrl()}/courses/${course.slug}`;
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.description,
            provider: { "@type": "Organization", name: "CodeVerse", sameAs: appUrl() },
            educationalLevel: LEVEL[course.level],
            inLanguage: "en",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: 0, priceCurrency: "INR", category: "Free" },
            hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: `PT${Math.round(course.durationMins / 60)}H` },
            ...(course.reviewCount ? { aggregateRating: { "@type": "AggregateRating", ratingValue: course.rating, reviewCount: course.reviewCount } } : {}),
          },
          breadcrumbLd([
            { name: "Home", url: appUrl() },
            { name: "Courses", url: `${appUrl()}/courses` },
            { name: course.title, url },
          ]),
        ]}
      />
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top left, ${course.color}40, transparent 60%)` }} />
        <div className="container-cv relative py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link href="/courses" className="inline-block py-1 hover:text-foreground">Courses</Link> / {course.topic}
          </nav>
          <div className="mt-4 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg bg-surface-2 px-2.5 py-1 text-xs">{LEVEL[course.level]}</span>
              <span className="rounded-lg bg-success px-2.5 py-1 text-xs font-semibold text-black">Free</span>
            </div>
            <h1 className="mt-4 font-heading text-4xl font-bold md:text-5xl">{course.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{course.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Star className="size-4 fill-warning text-warning" /> {course.rating || "New"} ({course.reviewCount} reviews)</span>
              <span className="flex items-center gap-1.5"><Users className="size-4" /> {course._count.enrollments} learners</span>
              <span className="flex items-center gap-1.5"><BookOpen className="size-4" /> {course.lessonCount} lessons</span>
              <span className="flex items-center gap-1.5"><Clock className="size-4" /> {Math.round(course.durationMins / 60)} hours</span>
              <span className="flex items-center gap-1.5"><Globe className="size-4" /> {course.language}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="container-cv grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="about">
            <h2 id="about" className="font-heading text-2xl font-bold">About this course</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{course.description}</p>
            <h3 className="mt-6 font-semibold">What you&apos;ll learn</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> {o}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="syllabus">
            <h2 id="syllabus" className="mb-4 font-heading text-2xl font-bold">Syllabus</h2>
            <Syllabus courseId={course.id} slug={course.slug} modules={course.modules} />
          </section>
          <section aria-labelledby="reviews">
            <h2 id="reviews" className="font-heading text-2xl font-bold">Ratings & reviews</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-[200px_1fr]">
              <div className="glass p-5 text-center">
                <p className="font-heading text-5xl font-bold">{course.rating || "-"}</p>
                <p className="text-sm text-muted-foreground">{course.reviewCount} reviews</p>
                <ul className="mt-4 space-y-1">
                  {course.distribution.map((d) => (
                    <li key={d.rating} className="flex items-center gap-2 text-xs">
                      {d.rating}★
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <span className="block h-full bg-warning" style={{ width: `${course.reviewCount ? (d.count / course.reviewCount) * 100 : 0}%` }} />
                      </span>
                      {d.count}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <ReviewForm courseId={course.id} />
                {course.reviews.length ? (
                  course.reviews.map((r) => (
                    <figure key={r.id} className="glass p-5">
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={i < r.rating ? "size-4 fill-warning text-warning" : "size-4 text-muted-foreground"} aria-hidden />
                        ))}
                        <span className="sr-only">{r.rating} out of 5</span>
                      </div>
                      <blockquote className="mt-2 text-sm">{r.body}</blockquote>
                      <figcaption className="mt-2 text-xs text-muted-foreground">{r.user.name} · {formatDate(r.createdAt)}</figcaption>
                    </figure>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No reviews yet, enroll and be the first.</p>
                )}
              </div>
            </div>
          </section>
        </div>
        <aside>
          <div className="sticky top-20">
            <EnrollCard courseId={course.id} slug={course.slug} firstLesson={first} />
          </div>
        </aside>
      </div>
    </>
  );
}
