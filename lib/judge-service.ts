import "server-only";
import { db } from "@/lib/db";
import { judge, type JudgeResult } from "@/lib/judge0";
import { awardXp, XP_RULES, type AwardResult } from "@/lib/gamification";
import type { LanguageKey } from "@/lib/languages";
import { onContestSubmission } from "@/lib/contest-scoring";

export type SubmitOutcome = JudgeResult & { submissionId?: string; xp?: AwardResult | null; firstSolve?: boolean };

/** Runs code against the sample tests (or a custom input when provided). */
export async function runSamples(problemId: string, language: LanguageKey, code: string, customInput?: string) {
  const p = await db.problem.findUnique({ where: { id: problemId }, select: { timeLimitMs: true, memoryLimitMb: true, testCases: { where: { isSample: true }, orderBy: { order: "asc" } } } });
  if (!p) throw new Error("Problem not found");
  const tests =
    customInput !== undefined && customInput.trim() !== ""
      ? [{ id: "custom", input: customInput, expected: p.testCases[0] && customInput === p.testCases[0].input ? p.testCases[0].expected : "\u0000", isSample: true }]
      : p.testCases.map((t) => ({ id: t.id, input: t.input, expected: t.expected, isSample: true }));
  const result = await judge({ language, code, tests, timeLimitMs: p.timeLimitMs, memoryLimitMb: p.memoryLimitMb });
  // A custom input has no expected output, report "finished" rather than Wrong Answer.
  if (tests[0]?.id === "custom" && tests[0].expected === "\u0000" && result.verdict === "WRONG_ANSWER") {
    result.verdict = "ACCEPTED";
    result.results = result.results.map((r) => ({ ...r, passed: true, status: "ACCEPTED", expected: undefined }));
    result.passed = result.total;
  }
  return result;
}

/** Judges against ALL tests (samples + hidden), persists the submission, updates counters, XP and contests. */
export async function submitSolution(opts: { userId: string; problemId: string; language: LanguageKey; code: string; contestId?: string }): Promise<SubmitOutcome> {
  const p = await db.problem.findUnique({
    where: { id: opts.problemId },
    select: { id: true, difficulty: true, timeLimitMs: true, memoryLimitMb: true, testCases: { orderBy: [{ isSample: "desc" }, { order: "asc" }] } },
  });
  if (!p) throw new Error("Problem not found");
  const result = await judge({
    language: opts.language,
    code: opts.code,
    tests: p.testCases.map((t) => ({ id: t.id, input: t.input, expected: t.expected, isSample: t.isSample })),
    timeLimitMs: p.timeLimitMs,
    memoryLimitMb: p.memoryLimitMb,
  });
  if (result.verdict === "INTERNAL_ERROR") return result;

  const alreadySolved = await db.submission.findFirst({ where: { userId: opts.userId, problemId: p.id, verdict: "ACCEPTED", kind: "SUBMIT" }, select: { id: true } });
  const sub = await db.submission.create({
    data: {
      userId: opts.userId,
      problemId: p.id,
      contestId: opts.contestId,
      language: opts.language,
      code: opts.code,
      kind: "SUBMIT",
      verdict: result.verdict,
      passed: result.passed,
      total: result.total,
      runtimeMs: result.runtimeMs,
      memoryKb: result.memoryKb,
      results: result.results.map((r) => ({ id: r.id, status: r.status, timeMs: r.timeMs, memoryKb: r.memoryKb })),
    },
  });
  await db.problem.update({
    where: { id: p.id },
    data: { totalSubmissions: { increment: 1 }, ...(result.verdict === "ACCEPTED" ? { totalAccepted: { increment: 1 } } : {}) },
  });
  let xp: AwardResult | null = null;
  const firstSolve = result.verdict === "ACCEPTED" && !alreadySolved;
  if (firstSolve) xp = await awardXp(opts.userId, "PROBLEM_SOLVED", XP_RULES.PROBLEM[p.difficulty], p.id);
  if (opts.contestId) await onContestSubmission({ contestId: opts.contestId, userId: opts.userId, problemId: p.id, accepted: result.verdict === "ACCEPTED" });
  return { ...result, submissionId: sub.id, xp, firstSolve };
}
