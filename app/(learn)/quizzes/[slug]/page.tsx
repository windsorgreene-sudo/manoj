import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileQuestion, History, Timer } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { QuizPlayer } from "@/components/quizzes/quiz-player";
import { LangVariant } from "@/components/i18n/lang-variant";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";

import { appUrl, formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = await db.quiz.findUnique({ where: { slug: (await params).slug }, select: { title: true, description: true, slug: true, isPublished: true } });
  if (!q || !q.isPublished) return {};
  return { title: q.title, description: q.description.slice(0, 160), alternates: { canonical: `/quizzes/${q.slug}` } };
}

export default async function QuizPage({ params }: Props) {
  const { slug } = await params;
  const [user, quiz] = await Promise.all([
    getCurrentUser(),
    db.quiz.findUnique({
      where: { slug },
      include: { questions: { orderBy: { order: "asc" }, select: { id: true, type: true, prompt: true, options: true, marks: true, promptHinglish: true, optionsHinglish: true } }, article: { select: { slug: true, title: true } } },
    }),
  ]);
  if (!quiz || !quiz.isPublished) notFound();
  const history = user ? await db.quizAttempt.findMany({ where: { userId: user.id, quizId: quiz.id }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, score: true, maxScore: true, createdAt: true, timeTakenS: true } }) : [];
  const maxMarks = quiz.questions.reduce((s, q) => s + q.marks, 0);

  return (
    <div className="container-cv py-10 md:py-14">
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", url: appUrl() }, { name: "Quizzes", url: `${appUrl()}/quizzes` }, { name: quiz.title, url: `${appUrl()}/quizzes/${quiz.slug}` }]),
          { "@context": "https://schema.org", "@type": "Quiz", name: quiz.title, description: quiz.description, about: quiz.topic, educationalLevel: "Beginner to Intermediate", timeRequired: `PT${quiz.durationMins}M` },
        ]}
      />
      <Link href="/quizzes" className="inline-flex items-center gap-1 py-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All tests</Link>
      <header className="mt-4 max-w-3xl">
        <h1 className="mt-3 flex flex-wrap items-center gap-3 font-heading text-3xl font-bold md:text-4xl">
          {quiz.title}
        </h1>
        <LangVariant as="p" className="mt-3 text-muted-foreground" en={quiz.description} hinglish={quiz.descriptionHinglish} />
        <p className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><FileQuestion className="size-4" /> {quiz.questions.length} questions · {maxMarks} marks</span>
          <span className="flex items-center gap-1"><Timer className="size-4" /> {quiz.durationMins} minutes</span>
          {quiz.article ? <Link href={`/tutorials/${quiz.article.slug}`} className="underline hover:text-foreground">Based on: {quiz.article.title}</Link> : null}
        </p>
      </header>

      <div className="mt-10">
        {quiz.questions.length === 0 ? (
          <p className="glass p-8 text-center text-muted-foreground">This test has no questions yet.</p>
        ) : (
          <QuizPlayer
            signedIn={Boolean(user)}
            quiz={{ id: quiz.id, slug: quiz.slug, title: quiz.title, durationMins: quiz.durationMins, negativeMarking: quiz.negativeMarking, negativeMark: quiz.negativeMark, isMockTest: quiz.isMockTest, questions: quiz.questions }}
          />
        )}
      </div>

      {history.length ? (
        <section aria-labelledby="hist-h" className="mx-auto mt-12 max-w-2xl">
          <h2 id="hist-h" className="flex items-center gap-2 text-lg font-semibold"><History className="size-5" /> Your recent attempts</h2>
          <ul className="glass mt-3 divide-y divide-border">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-muted-foreground">{formatDate(h.createdAt, { dateStyle: "medium", timeStyle: "short" })}</span>
                <span className="tabular-nums">{Math.round(h.score * 100) / 100}/{h.maxScore} · {Math.round(h.timeTakenS / 60)} min</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
