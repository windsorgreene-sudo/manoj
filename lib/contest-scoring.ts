import "server-only";
import { db } from "@/lib/db";
import { publish } from "@/lib/realtime";

const PENALTY_MINS = 5;

/**
 * ICPC-style scoring: the first accepted submission for a problem earns its points; each earlier
 * wrong submission on that problem adds a 5-minute penalty; time penalty = minutes since contest start.
 * Recomputed from submissions so it's always consistent.
 */
export async function recomputeParticipant(contestId: string, userId: string) {
  const contest = await db.contest.findUnique({ where: { id: contestId }, include: { problems: true } });
  if (!contest) return;
  const subs = await db.submission.findMany({
    where: { contestId, userId, createdAt: { gte: contest.startsAt, lte: contest.endsAt } },
    orderBy: { createdAt: "asc" },
    select: { problemId: true, verdict: true, createdAt: true },
  });
  let score = 0,
    penalty = 0,
    solved = 0;
  for (const cp of contest.problems) {
    const mine = subs.filter((s) => s.problemId === cp.problemId);
    const firstAc = mine.findIndex((s) => s.verdict === "ACCEPTED");
    if (firstAc >= 0) {
      solved++;
      score += cp.points;
      const wrong = mine.slice(0, firstAc).filter((s) => s.verdict !== "COMPILATION_ERROR").length;
      penalty += Math.floor((mine[firstAc].createdAt.getTime() - contest.startsAt.getTime()) / 60_000) + wrong * PENALTY_MINS;
    }
  }
  await db.contestParticipant.upsert({
    where: { contestId_userId: { contestId, userId } },
    update: { score, penaltyMins: penalty, solved },
    create: { contestId, userId, score, penaltyMins: penalty, solved },
  });
}

export async function onContestSubmission(opts: { contestId: string; userId: string; problemId: string; accepted: boolean }) {
  const contest = await db.contest.findUnique({ where: { id: opts.contestId }, select: { startsAt: true, endsAt: true, slug: true } });
  const now = new Date();
  if (!contest || now < contest.startsAt || now > contest.endsAt) return;
  const registered = await db.contestParticipant.findUnique({ where: { contestId_userId: { contestId: opts.contestId, userId: opts.userId } } });
  if (!registered) return;
  await recomputeParticipant(opts.contestId, opts.userId);
  await publish(`contest-${contest.slug}`, "leaderboard", { at: Date.now() });
}
