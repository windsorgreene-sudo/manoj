"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/content/courses";
import { addXP } from "@/lib/learning";

// An inline, immediate-feedback quiz shown at the end of a lesson.
export function InlineQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [awarded, setAwarded] = useState(false);

  const choose = (qi: number, oi: number) => {
    if (answers[qi] !== null) return; // lock after first answer
    const next = [...answers];
    next[qi] = oi;
    setAnswers(next);

    const allDone = next.every((a) => a !== null);
    if (allDone && !awarded) {
      const correct = next.filter((a, i) => a === questions[i].correct).length;
      if (correct / questions.length >= 0.8) addXP(20);
      setAwarded(true);
    }
  };

  const answered = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a === questions[i].correct).length;

  return (
    <div className="not-prose my-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-text">Quick quiz</h3>
        <span className="text-sm text-text-muted">
          {answered}/{questions.length} answered
        </span>
      </div>

      <ol className="space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isAnswered = chosen !== null;
          return (
            <li key={qi}>
              <p className="mb-2 font-medium text-text">
                {qi + 1}. {q.question}
              </p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correct;
                  const isChosen = chosen === oi;
                  let cls =
                    "border-border bg-surface hover:border-primary text-text";
                  if (isAnswered) {
                    if (isCorrect) cls = "border-ok bg-ok-soft text-text";
                    else if (isChosen) cls = "border-danger bg-danger-soft text-text cv-shake";
                    else cls = "border-border bg-surface text-text-muted opacity-70";
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => choose(qi, oi)}
                      disabled={isAnswered}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-all ${cls} ${
                        !isAnswered ? "hover:-translate-y-0.5" : ""
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                          isAnswered && isCorrect
                            ? "border-ok bg-ok text-white"
                            : isAnswered && isChosen
                              ? "border-danger bg-danger text-white"
                              : "border-border-strong text-text-faint"
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {isAnswered && q.explain && (
                <p className="animate-fade-up mt-2 rounded-lg bg-surface-2 px-3 py-2 text-[13px] text-text-muted">
                  {chosen === q.correct ? "✅ Correct. " : "❌ Not quite. "}
                  {q.explain}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {answered === questions.length && (
        <div className="animate-fade-up mt-5 rounded-xl border border-border bg-surface-2 px-4 py-3 text-center">
          <p className="font-display text-lg font-bold text-text">
            You scored {correct} / {questions.length}
          </p>
          <p className="text-sm text-text-muted">
            {correct === questions.length
              ? "Perfect! You have mastered this lesson."
              : correct / questions.length >= 0.8
                ? "Great work! +20 XP earned."
                : "Good try. Review the lesson and give it another go."}
          </p>
        </div>
      )}
    </div>
  );
}
