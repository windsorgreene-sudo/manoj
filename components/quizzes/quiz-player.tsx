"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Bookmark, CheckCircle2, Clock, Flag, Loader2, MinusCircle, Play, RotateCcw, Trophy, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCelebrate } from "@/components/motion/celebration-layer";
import { gradeQuiz } from "@/lib/actions/learn";
import { cn } from "@/lib/utils";

export type PlayerQuestion = { id: string; type: "SINGLE" | "MULTIPLE" | "TRUE_FALSE"; prompt: string; options: string[]; marks: number };
export type PlayerQuiz = { id: string; slug: string; title: string; durationMins: number; negativeMarking: boolean; negativeMark: number; isMockTest: boolean; questions: PlayerQuestion[] };

type Graded = {
  score: number;
  max: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeTakenS: number;
  stats: { attempts: number; avgScore: number; percentile: number };
  perQuestion: { id: string; correct: number[]; ok: boolean; skipped: boolean; explanation: string; marks: number }[];
};

type Saved = { answers: Record<string, number[]>; review: string[]; startedAt: number };

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function QuizPlayer({ quiz, signedIn }: { quiz: PlayerQuiz; signedIn: boolean }) {
  const storageKey = `cv-quiz:${quiz.id}`;
  const total = quiz.durationMins * 60;
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [review, setReview] = useState<Set<string>>(new Set());
  const [idx, setIdx] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [left, setLeft] = useState(total);
  const [result, setResult] = useState<Graded | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [resumable, setResumable] = useState<Saved | null>(null);
  const submitted = useRef(false);
  const celebrate = useCelebrate();
  const q = quiz.questions[idx];

  // Offer to resume an in-progress attempt (survives reloads).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as Saved;
      if (Date.now() - saved.startedAt < total * 1000) {
        const id = requestAnimationFrame(() => setResumable(saved));
        return () => cancelAnimationFrame(id);
      }
      sessionStorage.removeItem(storageKey);
    } catch {
      sessionStorage.removeItem(storageKey);
    }
  }, [storageKey, total]);

  useEffect(() => {
    if (phase !== "running" || startedAt === null) return;
    sessionStorage.setItem(storageKey, JSON.stringify({ answers, review: [...review], startedAt } satisfies Saved));
  }, [answers, review, startedAt, phase, storageKey]);

  const submit = useCallback(
    async (auto = false) => {
      if (submitted.current || startedAt === null) return;
      submitted.current = true;
      setBusy(true);
      setConfirm(false);
      const r = await gradeQuiz({ quizId: quiz.id, answers, timeTakenS: Math.round((Date.now() - startedAt) / 1000) });
      setBusy(false);
      if (!r.ok) {
        submitted.current = false;
        return void toast.error(r.error);
      }
      sessionStorage.removeItem(storageKey);
      setResult(r.data);
      setPhase("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (auto) toast.info("Time's up, your test was submitted automatically.");
      if (r.data.xp?.awarded) celebrate({ xp: r.data.xp.amount, leveledUp: r.data.xp.leveledUp, level: r.data.xp.level, badges: r.data.xp.newBadges, streak: r.data.xp.streak });
    },
    [answers, celebrate, quiz.id, startedAt, storageKey],
  );

  useEffect(() => {
    if (phase !== "running" || startedAt === null) return;
    const tick = () => {
      const remaining = Math.max(0, total - Math.floor((Date.now() - startedAt) / 1000));
      setLeft(remaining);
      if (remaining === 0) void submit(true);
    };
    tick();
    const iv = window.setInterval(tick, 1000);
    return () => window.clearInterval(iv);
  }, [phase, startedAt, submit, total]);

  // Warn before leaving mid-test.
  useEffect(() => {
    if (phase !== "running") return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [phase]);

  const start = (saved?: Saved) => {
    submitted.current = false;
    setAnswers(saved?.answers ?? {});
    setReview(new Set(saved?.review ?? []));
    setStartedAt(saved?.startedAt ?? Date.now());
    setIdx(0);
    setResult(null);
    setResumable(null);
    setPhase("running");
  };

  const choose = (oi: number) => {
    if (!q) return;
    setAnswers((a) => {
      const cur = a[q.id] ?? [];
      const next = q.type === "MULTIPLE" ? (cur.includes(oi) ? cur.filter((x) => x !== oi) : [...cur, oi]) : cur[0] === oi ? [] : [oi];
      const copy = { ...a };
      if (next.length) copy[q.id] = next;
      else delete copy[q.id];
      return copy;
    });
  };

  const answered = Object.keys(answers).length;
  const lowTime = left <= 60;

  if (phase === "intro") {
    return (
      <div className="glass mx-auto max-w-2xl p-8">
        <h2 className="font-heading text-2xl font-bold">Before you begin</h2>
        <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3"><Clock className="size-5 shrink-0 text-cyan" /> {quiz.questions.length} questions · {quiz.durationMins} minutes. The test submits automatically when time runs out.</li>
          {quiz.negativeMarking ? (
            <li className="flex gap-3"><MinusCircle className="size-5 shrink-0 text-danger" /> Negative marking: each wrong answer deducts {quiz.negativeMark * 100}% of the question&apos;s marks. Skipping costs nothing.</li>
          ) : (
            <li className="flex gap-3"><CheckCircle2 className="size-5 shrink-0 text-success" /> No negative marking, attempt everything.</li>
          )}
          <li className="flex gap-3"><Bookmark className="size-5 shrink-0 text-warning" /> Mark questions for review and jump around using the question palette.</li>
          <li className="flex gap-3"><Trophy className="size-5 shrink-0 text-brand" /> Score 60% or more to earn XP. {signedIn ? "Your attempts are saved to your dashboard." : "Sign in to save attempts and earn XP."}</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" className="rounded-xl" onClick={() => start()}><Play /> Start test</Button>
          {resumable ? <Button size="lg" variant="outline" className="rounded-xl" onClick={() => start(resumable)}><RotateCcw /> Resume attempt</Button> : null}
          {!signedIn ? <Button asChild size="lg" variant="ghost" className="rounded-xl"><Link href={`/login?next=${encodeURIComponent(`/quizzes/${quiz.slug}`)}`}>Sign in first</Link></Button> : null}
        </div>
      </div>
    );
  }

  if (phase === "done" && result) return <ResultView quiz={quiz} result={result} answers={answers} onRetry={() => start()} />;

  if (!q) return null;
  const mine = answers[q.id] ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <section aria-labelledby="q-prompt" className="glass min-w-0 p-6 md:p-8">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>Question {idx + 1} of {quiz.questions.length}</span>
          <span>{q.marks} mark{q.marks > 1 ? "s" : ""}{q.type === "MULTIPLE" ? " · select all that apply" : ""}</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-brand transition-[width]" style={{ width: `${((idx + 1) / quiz.questions.length) * 100}%` }} /></div>
        <fieldset className="mt-6">
          <legend id="q-prompt" className="text-lg font-medium leading-relaxed">{q.prompt}</legend>
          <div className="mt-5 grid gap-3" role={q.type === "MULTIPLE" ? "group" : "radiogroup"}>
            {q.options.map((opt, oi) => {
              const chosen = mine.includes(oi);
              return (
                <label key={oi} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-brand/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan", chosen && "border-brand bg-brand/10")}>
                  <input type={q.type === "MULTIPLE" ? "checkbox" : "radio"} name={q.id} className="sr-only" checked={chosen} onChange={() => choose(oi)} />
                  <span className={cn("grid size-6 shrink-0 place-items-center border font-mono text-xs", q.type === "MULTIPLE" ? "rounded-md" : "rounded-full", chosen ? "border-brand bg-brand text-white" : "border-border")} aria-hidden>{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Button variant="outline" className="rounded-xl" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}><ArrowLeft /> Previous</Button>
          <Button
            variant="ghost"
            className={cn("rounded-xl", review.has(q.id) && "text-warning")}
            aria-pressed={review.has(q.id)}
            onClick={() => setReview((r) => { const n = new Set(r); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; })}
          >
            <Flag /> {review.has(q.id) ? "Marked" : "Mark for review"}
          </Button>
          {mine.length ? <Button variant="ghost" className="rounded-xl" onClick={() => setAnswers((a) => { const c = { ...a }; delete c[q.id]; return c; })}>Clear</Button> : null}
          <span className="flex-1" />
          {idx < quiz.questions.length - 1 ? (
            <Button className="rounded-xl" onClick={() => setIdx((i) => i + 1)}>Next <ArrowRight /></Button>
          ) : (
            <Button className="rounded-xl" onClick={() => setConfirm(true)} disabled={busy}>Finish test</Button>
          )}
        </div>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className={cn("glass p-5 text-center", lowTime && "border-danger")} role="timer" aria-label={`Time left ${fmt(left)}`}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Time left</p>
          <p className={cn("mt-1 font-mono text-4xl font-bold tabular-nums", lowTime && "text-danger motion-safe:animate-pulse")}>{fmt(left)}</p>
          {lowTime ? <p className="sr-only" aria-live="assertive">Less than one minute left</p> : null}
        </div>
        <div className="glass p-5">
          <p className="text-sm font-semibold">Question palette</p>
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {quiz.questions.map((qq, i) => {
              const isA = Boolean(answers[qq.id]);
              const isR = review.has(qq.id);
              return (
                <button
                  key={qq.id}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Question ${i + 1}${isA ? ", answered" : ""}${isR ? ", marked for review" : ""}`}
                  aria-current={i === idx ? "step" : undefined}
                  className={cn(
                    "relative grid aspect-square place-items-center rounded-lg border text-xs font-medium tabular-nums transition-colors",
                    isA ? "border-success bg-success/15 text-success" : "border-border text-muted-foreground",
                    i === idx && "ring-2 ring-brand",
                  )}
                >
                  {i + 1}
                  {isR ? <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-warning" aria-hidden /> : null}
                </button>
              );
            })}
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div><dt className="text-muted-foreground">Answered</dt><dd className="font-semibold text-success">{answered}</dd></div>
            <div><dt className="text-muted-foreground">Review</dt><dd className="font-semibold text-warning">{review.size}</dd></div>
            <div><dt className="text-muted-foreground">Left</dt><dd className="font-semibold">{quiz.questions.length - answered}</dd></div>
          </dl>
          <Button className="mt-4 w-full rounded-xl" variant="outline" onClick={() => setConfirm(true)} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : null} Submit test</Button>
        </div>
      </aside>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit your test?</DialogTitle>
            <DialogDescription>
              You answered {answered} of {quiz.questions.length} questions{review.size ? ` and ${review.size} are marked for review` : ""}. You can&apos;t change answers after submitting.
            </DialogDescription>
          </DialogHeader>
          {quiz.questions.length - answered > 0 ? <p className="flex items-center gap-2 text-sm text-warning"><AlertTriangle className="size-4" /> {quiz.questions.length - answered} unanswered question(s) will be skipped.</p> : null}
          <DialogFooter>
            <Button variant="ghost" className="rounded-xl" onClick={() => setConfirm(false)}>Keep going</Button>
            <Button className="rounded-xl" onClick={() => void submit()} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : null} Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ResultView({ quiz, result, answers, onRetry }: { quiz: PlayerQuiz; result: Graded; answers: Record<string, number[]>; onRetry: () => void }) {
  const pct = result.max > 0 ? Math.max(0, Math.round((result.score / result.max) * 100)) : 0;
  const attempted = result.correct + result.wrong;
  const accuracy = attempted ? Math.round((result.correct / attempted) * 100) : 0;
  const penalty = quiz.negativeMarking ? result.perQuestion.filter((p) => !p.ok && !p.skipped).reduce((s, p) => s + p.marks * quiz.negativeMark, 0) : 0;
  const [filter, setFilter] = useState<"all" | "wrong" | "skipped">("all");
  const byId = useMemo(() => new Map(result.perQuestion.map((p) => [p.id, p])), [result]);
  const shown = quiz.questions.filter((qq) => {
    const g = byId.get(qq.id);
    return filter === "all" || (filter === "wrong" ? g && !g.ok && !g.skipped : g?.skipped);
  });
  const ring = 2 * Math.PI * 52;

  return (
    <div className="space-y-8">
      <section className="glass grid gap-8 p-6 md:grid-cols-[auto_1fr] md:p-8" aria-labelledby="res-h">
        <div className="relative mx-auto size-40">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r="52" className="fill-none stroke-muted" strokeWidth="10" />
            <circle cx="60" cy="60" r="52" className={cn("fill-none transition-[stroke-dashoffset] duration-1000", pct >= 60 ? "stroke-success" : "stroke-warning")} strokeWidth="10" strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * (1 - pct / 100)} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div><p className="font-heading text-4xl font-bold tabular-nums">{pct}%</p><p className="text-xs text-muted-foreground">{result.score}/{result.max}</p></div>
          </div>
        </div>
        <div>
          <h2 id="res-h" className="font-heading text-2xl font-bold">{pct >= 80 ? "Outstanding!" : pct >= 60 ? "Passed, nice work!" : "Keep practising"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.stats.attempts > 1 ? `You scored higher than ${result.stats.percentile}% of other attempts (${result.stats.attempts - 1}). Average score: ${result.stats.avgScore}/${result.max}.` : "You're the first to take this test, nice!"}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { l: "Correct", v: result.correct, c: "text-success" },
              { l: "Wrong", v: result.wrong, c: "text-danger" },
              { l: "Skipped", v: result.skipped, c: "text-muted-foreground" },
              { l: "Accuracy", v: `${accuracy}%`, c: "" },
              { l: "Time", v: fmt(result.timeTakenS), c: "" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border p-3 text-center"><dt className="text-xs text-muted-foreground">{s.l}</dt><dd className={cn("mt-1 font-heading text-xl font-bold tabular-nums", s.c)}>{s.v}</dd></div>
            ))}
          </dl>
          {penalty > 0 ? <p className="mt-3 text-sm text-danger">Negative marking cost you {Math.round(penalty * 100) / 100} marks. Skipping uncertain questions would have scored {Math.round((result.score + penalty) * 100) / 100}.</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="rounded-xl" onClick={onRetry}><RotateCcw /> Retake</Button>
            <Button asChild variant="outline" className="rounded-xl"><Link href="/quizzes">More tests</Link></Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="rev-h">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="rev-h" className="font-heading text-xl font-semibold">Question review</h2>
          <div className="flex gap-1" role="tablist" aria-label="Filter review">
            {(["all", "wrong", "skipped"] as const).map((f) => (
              <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-sm capitalize", filter === f ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground")}>{f}</button>
            ))}
          </div>
        </div>
        <ol className="mt-4 space-y-4">
          {shown.map((qq) => {
            const g = byId.get(qq.id);
            const mine = answers[qq.id] ?? [];
            const n = quiz.questions.indexOf(qq) + 1;
            return (
              <li key={qq.id} className="glass p-5">
                <p className="flex items-start gap-2 font-medium">
                  {g?.skipped ? <MinusCircle className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-label="Skipped" /> : g?.ok ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-label="Correct" /> : <XCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-label="Wrong" />}
                  <span>{n}. {qq.prompt}</span>
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {qq.options.map((opt, oi) => {
                    const right = g?.correct.includes(oi);
                    const picked = mine.includes(oi);
                    return (
                      <li key={oi} className={cn("rounded-lg border px-3 py-2 text-sm", right ? "border-success bg-success/10" : picked ? "border-danger bg-danger/10" : "border-border")}>
                        <span className="mr-2 font-mono text-xs">{String.fromCharCode(65 + oi)}</span>{opt}
                        {picked ? <span className="ml-2 text-xs text-muted-foreground">(your answer)</span> : null}
                      </li>
                    );
                  })}
                </ul>
                {g?.explanation ? <p className="mt-3 text-sm text-muted-foreground"><b className="text-foreground">Why:</b> {g.explanation}</p> : null}
              </li>
            );
          })}
          {!shown.length ? <li className="text-sm text-muted-foreground">Nothing to show for this filter.</li> : null}
        </ol>
      </section>
    </div>
  );
}
