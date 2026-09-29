"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { gradeQuiz } from "@/lib/actions/learn";
import { useCelebrate } from "@/components/motion/celebration-layer";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/intl-provider";
import { pick, pickList } from "@/lib/i18n-content";

type Q = { id: string; prompt: string; options: string[]; promptHinglish?: string | null; optionsHinglish?: string[] };
type Graded = { score: number; max: number; perQuestion: { id: string; correct: number[]; ok: boolean; explanation: string; explanationHinglish?: string | null }[] };

/** Knowledge check at the end of an article, graded on the server. */
export function InlineQuiz({ quizId, questions }: { quizId: string; questions: Q[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Graded | null>(null);
  const [busy, setBusy] = useState(false);
  const celebrate = useCelebrate();
  const { locale } = useLocale();

  const submit = async () => {
    setBusy(true);
    const r = await gradeQuiz({ quizId, answers: Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, [v]])) });
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    setResult(r.data);
    if (r.data.xp?.awarded) celebrate({ xp: r.data.xp.amount, leveledUp: r.data.xp.leveledUp, level: r.data.xp.level, badges: r.data.xp.newBadges, streak: r.data.xp.streak });
  };

  return (
    <section aria-labelledby="quiz-title" className="glass mt-12 p-6">
      <h2 id="quiz-title" className="font-heading text-xl font-bold">
        Quick check 
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Answer {questions.length} questions to lock in what you learned.</p>
      <ol className="mt-6 space-y-6">
        {questions.map((q, qi) => {
          const graded = result?.perQuestion.find((p) => p.id === q.id);
          return (
            <li key={q.id}>
              <fieldset>
                <legend className="font-medium">
                  {qi + 1}. {pick(locale, q.prompt, q.promptHinglish)}
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {pickList(locale, q.options, q.optionsHinglish).map((opt, oi) => {
                    const chosen = answers[q.id] === oi;
                    const isCorrect = graded?.correct.includes(oi);
                    return (
                      <label
                        key={oi}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan",
                          chosen && !graded && "border-brand bg-brand/10",
                          graded && isCorrect && "border-success bg-success/10",
                          graded && chosen && !isCorrect && "border-danger bg-danger/10",
                        )}
                      >
                        <input type="radio" name={q.id} className="sr-only" checked={chosen} disabled={Boolean(result)} onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))} />
                        <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border", chosen ? "border-brand bg-brand text-white" : "border-border")} aria-hidden>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                      </label>
                    );
                  })}
                </div>
                {graded ? (
                  <p className={cn("mt-2 flex items-start gap-2 text-sm", graded.ok ? "text-success" : "text-danger")}>
                    {graded.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <XCircle className="mt-0.5 size-4 shrink-0" />}
                    <span className="text-muted-foreground">{pick(locale, graded.explanation, graded.explanationHinglish)}</span>
                  </p>
                ) : null}
              </fieldset>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 flex items-center gap-3">
        {result ? (
          <>
            <p className="font-semibold" role="status">
              You scored {result.score}/{result.max}
            </p>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setResult(null);
                setAnswers({});
              }}
            >
              <RotateCcw /> Retry
            </Button>
          </>
        ) : (
          <Button onClick={submit} disabled={busy || Object.keys(answers).length === 0} className="rounded-xl">
            {busy ? <Loader2 className="animate-spin" /> : null} Check answers
          </Button>
        )}
      </div>
    </section>
  );
}
