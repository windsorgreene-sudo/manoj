import type { Metadata } from "next";
import Link from "next/link";
import { Clock, FileQuestion, MinusCircle, Timer } from "lucide-react";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quizzes & Mock Tests",
  description: "Timed quizzes and placement-style mock tests with negative marking and detailed result analysis.",
  alternates: { canonical: "/quizzes" },
};
export const revalidate = 600;

type SP = Promise<{ type?: string; topic?: string }>;

export default async function QuizzesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const type = sp.type === "mock" || sp.type === "quiz" || sp.type === "tutorial" ? sp.type : "all";
  const quizzes = await db.quiz.findMany({
    where: { isPublished: true },
    orderBy: [{ isMockTest: "desc" }, { createdAt: "asc" }],
    include: { _count: { select: { questions: true, attempts: true } }, article: { select: { slug: true, title: true } } },
  });
  const topics = [...new Set(quizzes.map((q) => q.topic))].sort();
  const topic = sp.topic && topics.includes(sp.topic) ? sp.topic : null;
  const shown = quizzes.filter(
    (q) => (type === "all" ? !q.articleId : type === "mock" ? q.isMockTest : type === "quiz" ? !q.isMockTest && !q.articleId : Boolean(q.articleId)) && (!topic || q.topic === topic),
  );
  const href = (patch: { type?: string; topic?: string | null }) => {
    const p = new URLSearchParams();
    const t = patch.type ?? type;
    const tp = patch.topic === undefined ? topic : patch.topic;
    if (t !== "all") p.set("type", t);
    if (tp) p.set("topic", tp);
    const s = p.toString();
    return s ? `/quizzes?${s}` : "/quizzes";
  };

  return (
    <div className="container-cv py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Quizzes &amp; mock tests</h1>
        <p className="mt-3 text-muted-foreground">Timed, auto-graded tests with negative marking where it matters and a question-by-question analysis at the end.</p>
      </header>

      <nav aria-label="Filter quizzes" className="mt-8 flex flex-wrap gap-2">
        {[
          { v: "all", l: "All tests" },
          { v: "mock", l: "Mock tests" },
          { v: "quiz", l: "Topic quizzes" },
          { v: "tutorial", l: "Tutorial checks" },
        ].map((o) => (
          <Link key={o.v} href={href({ type: o.v })} aria-current={type === o.v ? "page" : undefined} className={cn("rounded-xl border px-3 py-1.5 text-sm transition-colors", type === o.v ? "border-brand bg-brand text-white" : "border-border hover:border-brand")}>
            {o.l}
          </Link>
        ))}
        <span className="mx-2 hidden h-8 w-px bg-border sm:block" aria-hidden />
        {topics.map((t) => (
          <Link key={t} href={href({ topic: topic === t ? null : t })} aria-current={topic === t ? "true" : undefined} className={cn("rounded-xl border px-3 py-1.5 text-sm transition-colors", topic === t ? "border-cyan bg-cyan/15 text-cyan" : "border-border text-muted-foreground hover:text-foreground")}>
            {t}
          </Link>
        ))}
      </nav>

      {shown.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((q) => (
            <Link key={q.id} href={`/quizzes/${q.slug}`} className="glass gradient-border hover-glow flex flex-col p-6">
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", q.isMockTest ? "bg-warning/15 text-warning" : "bg-cyan/15 text-cyan")}>{q.isMockTest ? "Mock test" : q.articleId ? "Tutorial check" : "Quiz"}</span>
                <span className="ml-auto text-xs text-muted-foreground">{q.topic}</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold">{q.title}</h2>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{q.description}</p>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1"><FileQuestion className="size-3.5" /> {q._count.questions} questions</li>
                <li className="flex items-center gap-1"><Timer className="size-3.5" /> {q.durationMins} min</li>
                {q.negativeMarking ? <li className="flex items-center gap-1 text-danger"><MinusCircle className="size-3.5" /> −{q.negativeMark * 100}%</li> : null}
                <li className="flex items-center gap-1"><Clock className="size-3.5" /> {q._count.attempts} attempts</li>
              </ul>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState className="mt-10" title="No tests match these filters" description="Try another topic or test type." />
      )}
    </div>
  );
}
