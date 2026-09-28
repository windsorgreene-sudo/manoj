import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export type ProblemFilters = { q?: string; difficulty?: string; topic?: string; company?: string; status?: string; page?: string };

export const PAGE_SIZE = 20;

export async function listProblems(f: ProblemFilters, userId: string | null) {
  const where: Prisma.ProblemWhereInput = { status: "PUBLISHED" };
  if (f.q) where.OR = [{ title: { contains: f.q, mode: "insensitive" } }, ...(Number(f.q) ? [{ number: Number(f.q) }] : [])];
  if (f.difficulty && ["EASY", "MEDIUM", "HARD"].includes(f.difficulty)) where.difficulty = f.difficulty as "EASY";
  if (f.topic) where.topics = { has: f.topic };
  if (f.company) where.companies = { has: f.company };

  let solvedIds = new Set<string>();
  let attemptedIds = new Set<string>();
  if (userId) {
    const subs = await db.submission.groupBy({ by: ["problemId", "verdict"], where: { userId, kind: "SUBMIT", problemId: { not: null } } });
    solvedIds = new Set(subs.filter((s) => s.verdict === "ACCEPTED").map((s) => s.problemId as string));
    attemptedIds = new Set(subs.map((s) => s.problemId as string).filter((id) => !solvedIds.has(id)));
    if (f.status === "solved") where.id = { in: [...solvedIds] };
    if (f.status === "attempted") where.id = { in: [...attemptedIds] };
    if (f.status === "todo") where.id = { notIn: [...solvedIds, ...attemptedIds] };
  }

  const page = Math.max(1, Number(f.page) || 1);
  const [total, rows] = await Promise.all([
    db.problem.count({ where }),
    db.problem.findMany({
      where,
      orderBy: { number: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, number: true, slug: true, title: true, difficulty: true, topics: true, companies: true, isPremium: true, totalSubmissions: true, totalAccepted: true },
    }),
  ]);
  // Acceptance from real submissions (seeded history + live counters)
  const stats = await db.submission.groupBy({ by: ["problemId", "verdict"], where: { problemId: { in: rows.map((r) => r.id) }, kind: "SUBMIT" }, _count: true });
  const acc = (id: string) => {
    const s = stats.filter((x) => x.problemId === id);
    const totalS = s.reduce((t, x) => t + x._count, 0);
    const ok = s.filter((x) => x.verdict === "ACCEPTED").reduce((t, x) => t + x._count, 0);
    return totalS ? Math.round((ok / totalS) * 1000) / 10 : 0;
  };
  return {
    total,
    page,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    problems: rows.map((r) => ({ ...r, acceptance: acc(r.id), status: solvedIds.has(r.id) ? "solved" : attemptedIds.has(r.id) ? "attempted" : "todo" })),
    solvedCount: solvedIds.size,
  };
}

export const getProblemFacets = cache(async () => {
  const rows = await db.problem.findMany({ where: { status: "PUBLISHED" }, select: { topics: true, companies: true, difficulty: true } });
  const topics = [...new Set(rows.flatMap((r) => r.topics))].sort();
  const companies = [...new Set(rows.flatMap((r) => r.companies))].sort();
  const counts = { EASY: 0, MEDIUM: 0, HARD: 0 };
  rows.forEach((r) => (counts[r.difficulty] += 1));
  return { topics, companies, counts, total: rows.length };
});

export const getProblemForWorkspace = cache(async (slug: string) => {
  return db.problem.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      number: true,
      slug: true,
      title: true,
      statement: true,
      constraints: true,
      inputFormat: true,
      outputFormat: true,
      difficulty: true,
      topics: true,
      companies: true,
      hints: true,
      starterCode: true,
      timeLimitMs: true,
      memoryLimitMb: true,
      isPremium: true,
      testCases: { where: { isSample: true }, orderBy: { order: "asc" }, select: { id: true, input: true, expected: true, explanation: true } },
      _count: { select: { testCases: true } },
    },
  });
});
