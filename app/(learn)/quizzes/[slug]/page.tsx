import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Crown, FileQuestion, History, Lock, Timer } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { QuizPlayer } from "@/components/quizzes/quiz-player";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
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
      include: { questions: { orderBy: { order: "asc" }, select: { id: true, type: true, prompt: true, options: true, marks: true } }, article: { select: { slug: true, title: true } } },
    }),
  ]);
  if (!quiz || !quiz.isPublished) notFound();
  const locked = quiz.isPro && !(user?.isPro || user?.role === "ADMIN");
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
      <Link href="/quizzes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All tests</Link>
      <header className="mt-4 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">{quiz.isMockTest ? "Mock test" : "Quiz"} · {quiz.topic}</p>
        <h1 className="mt-3 flex flex-wrap items-center gap-3 font-heading text-3xl font-bold md:text-4xl">
          {quiz.title}
          {quiz.isPro ? <span className="inline-flex items-center gap-1 rounded-full bg-brand/20 px-3 py-1 text-sm font-semibold text-brand"><Crown className="size-4" /> Pro</span> : null}
        </h1>
        <p className="mt-3 text-muted-foreground">{quiz.description}</p>
        <p className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><FileQuestion className="size-4" /> {quiz.questions.length} questions · {maxMarks} marks</span>
          <span className="flex items-center gap-1"><Timer className="size-4" /> {quiz.durationMins} minutes</span>
          {quiz.article ? <Link href={`/tutorials/${quiz.article.slug}`} className="underline hover:text-foreground">Based on: {quiz.article.title}</Link> : null}
        </p>
      </header>

      <div className="mt-10">
        {quiz.questions.length === 0 ? (
          <p className="glass p-8 text-center text-muted-foreground">This test has no questions yet.</p>
        ) : locked ? (
          <div className="glass gradient-border mx-auto max-w-xl p-8 text-center">
            <Lock className="mx-auto size-10 text-brand" />
            <h2 className="mt-4 font-heading text-2xl font-bold">This mock test is part of Pro</h2>
            <p className="mt-2 text-muted-foreground">Unlock every mock test with detailed analysis, premium problems, unlimited AI tutor and verified certificates.</p>
            <Button asChild size="lg" className="mt-6 rounded-xl">
              <Link href={user ? "/checkout/pro-monthly" : `/signup?next=${encodeURIComponent("/checkout/pro-monthly")}`}><Crown /> Upgrade to Pro</Link>
            </Button>
          </div>
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
