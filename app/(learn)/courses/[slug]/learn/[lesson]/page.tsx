import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, ListChecks, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdxContent } from "@/components/content/mdx-content";
import { LessonSidebar, MarkComplete } from "@/components/learn/lesson-player";
import { TutorLauncher } from "@/components/learn/tutor-launcher";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getCourseDetail } from "@/lib/queries/course-detail";

export const metadata: Metadata = { robots: { index: false } };

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lesson: string }> }) {
  const { slug, lesson: lessonSlug } = await params;
  const course = await getCourseDetail(slug);
  if (!course) notFound();
  const flat = course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })));
  const idx = flat.findIndex((l) => l.slug === lessonSlug);
  if (idx < 0) notFound();
  const current = flat[idx];
  const user = await getCurrentUser();
  const enrollment = user ? await db.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId: course.id } } }) : null;
  const allowed = current.isPreview || Boolean(enrollment);
  if (!allowed && !user) redirect(`/login?next=/courses/${slug}/learn/${lessonSlug}`);

  const lesson = allowed
    ? await db.lesson.findUnique({
        where: { id: current.id },
        include: {
          article: { select: { content: true, title: true, slug: true } },
          problem: { select: { slug: true, title: true, difficulty: true, statement: true } },
          quiz: { select: { slug: true, title: true, description: true, _count: { select: { questions: true } } } },
        },
      })
    : null;
  const done = user ? await db.progress.findMany({ where: { userId: user.id, completed: true, lesson: { module: { courseId: course.id } } }, select: { lessonId: true } }) : [];
  const prev = flat[idx - 1];
  const next = flat[idx + 1];

  return (
    <div className="container-cv grid gap-8 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <LessonSidebar courseSlug={slug} courseTitle={course.title} modules={course.modules} current={current.slug} completed={done.map((d) => d.lessonId)} />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{current.moduleTitle}</p>
        <h1 className="mt-1 font-heading text-3xl font-bold md:text-4xl">{current.title}</h1>
        {!allowed ? (
          <div className="glass mt-8 flex flex-col items-center gap-3 p-10 text-center">
            <Lock className="size-10 text-muted-foreground" />
            <p className="font-semibold">Enroll (free) to unlock this lesson</p>
            <Button asChild className="rounded-xl"><Link href={`/courses/${slug}`}>Go to course page</Link></Button>
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-border py-2">
              {enrollment ? <MarkComplete lessonId={current.id} initial={done.some((d) => d.lessonId === current.id)} /> : <span className="text-sm text-muted-foreground">Free preview — <Link className="underline" href={`/courses/${slug}`}>enroll</Link> to track progress.</span>}
              <span className="ml-auto" />
              <TutorLauncher title={current.title} kind="lesson" content={lesson?.article?.content.slice(0, 6000)} />
            </div>
            <div className="mt-8">
              {lesson?.article ? (
                <MdxContent content={lesson.article.content} />
              ) : lesson?.problem ? (
                <div className="glass p-8">
                  <Code2 className="size-8 text-cyan" />
                  <h2 className="mt-3 text-xl font-semibold">{lesson.problem.title}</h2>
                  <DifficultyBadge difficulty={lesson.problem.difficulty} className="mt-2" />
                  <p className="mt-3 line-clamp-4 text-muted-foreground">{lesson.problem.statement.replace(/[*`]/g, "")}</p>
                  <Button asChild className="mt-6 rounded-xl"><Link href={`/problems/${lesson.problem.slug}`}>Open in problem workspace <ArrowRight /></Link></Button>
                </div>
              ) : lesson?.quiz ? (
                <div className="glass p-8">
                  <ListChecks className="size-8 text-brand-soft" />
                  <h2 className="mt-3 text-xl font-semibold">{lesson.quiz.title}</h2>
                  <p className="mt-2 text-muted-foreground">{lesson.quiz.description}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{lesson.quiz._count.questions} questions</p>
                  <Button asChild className="mt-6 rounded-xl"><Link href={`/quizzes/${lesson.quiz.slug}`}>Start quiz <ArrowRight /></Link></Button>
                </div>
              ) : (
                <p className="text-muted-foreground">This lesson has no content yet.</p>
              )}
            </div>
          </>
        )}
        <nav aria-label="Lesson navigation" className="mt-12 flex justify-between gap-4">
          {prev ? <Button asChild variant="outline" className="rounded-xl"><Link href={`/courses/${slug}/learn/${prev.slug}`}><ArrowLeft /> {prev.title}</Link></Button> : <span />}
          {next ? <Button asChild className="rounded-xl"><Link href={`/courses/${slug}/learn/${next.slug}`}>{next.title} <ArrowRight /></Link></Button> : <Button asChild variant="outline" className="rounded-xl"><Link href={`/courses/${slug}`}>Back to course</Link></Button>}
        </nav>
      </div>
    </div>
  );
}
