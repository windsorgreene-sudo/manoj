import "server-only";
import { db } from "@/lib/db";
import { awardXp, checkBadges } from "@/lib/gamification";
import { publish } from "@/lib/realtime";

export type ContestPhase = "UPCOMING" | "LIVE" | "ENDED";

export function contestPhase(c: { startsAt: Date; endsAt: Date }, now = new Date()): ContestPhase {
  if (now < c.startsAt) return "UPCOMING";
  if (now <= c.endsAt) return "LIVE";
  return "ENDED";
}

/** Public standings are frozen while the contest is live and the board is frozen. */
export const isBoardFrozen = (c: { frozen: boolean; startsAt: Date; endsAt: Date }, now = new Date()) => c.frozen && contestPhase(c, now) === "LIVE";

export const CONTEST_XP = { PARTICIPATE: 25, PER_SOLVE: 15, PODIUM: 100 } as const;
const K = 80;
const MAX_DELTA = 150;

export type RatingInput = { id: string; rating: number; score: number; penalty: number };

/**
 * Elo-style multiplayer rating: every pair of participants is a "game" decided by (score desc, penalty asc).
 * delta = K · (actual − expected) / (n − 1), clamped to ±150. Ties count as half a win.
 */
export function computeRatingChanges(rows: RatingInput[]) {
  const sorted = [...rows].sort((a, b) => b.score - a.score || a.penalty - b.penalty);
  const rankOf = new Map<string, number>();
  sorted.forEach((r, i) => {
    const prev = sorted[i - 1];
    rankOf.set(r.id, prev && prev.score === r.score && prev.penalty === r.penalty ? (rankOf.get(prev.id) as number) : i + 1);
  });
  const n = rows.length;
  return sorted.map((me) => {
    if (n < 2) return { id: me.id, rank: 1, before: me.rating, after: me.rating, delta: 0 };
    let expected = 0,
      actual = 0;
    const myRank = rankOf.get(me.id) as number;
    for (const other of sorted) {
      if (other.id === me.id) continue;
      expected += 1 / (1 + 10 ** ((other.rating - me.rating) / 400));
      const r = rankOf.get(other.id) as number;
      actual += myRank < r ? 1 : myRank === r ? 0.5 : 0;
    }
    const delta = Math.max(-MAX_DELTA, Math.min(MAX_DELTA, Math.round((K * (actual - expected)) / (n - 1))));
    return { id: me.id, rank: myRank, before: me.rating, after: me.rating + delta, delta };
  });
}

/**
 * Runs once per contest after it ends (lazily, from the contest page / leaderboard API):
 * assigns final ranks, applies rating changes, awards XP + badges and notifies participants.
 * Claimed atomically via `ratingsApplied` so concurrent requests never double-apply.
 */
export async function finalizeContestIfEnded(contestId: string) {
  const contest = await db.contest.findUnique({ where: { id: contestId }, select: { id: true, slug: true, title: true, startsAt: true, endsAt: true, ratingsApplied: true } });
  if (!contest || contest.ratingsApplied || contestPhase(contest) !== "ENDED") return false;
  const claim = await db.contest.updateMany({ where: { id: contest.id, ratingsApplied: false }, data: { ratingsApplied: true, frozen: false } });
  if (claim.count === 0) return false;
  try {
    const [participants, submitters] = await Promise.all([
      db.contestParticipant.findMany({ where: { contestId: contest.id }, include: { user: { select: { profile: { select: { contestRating: true } } } } } }),
      db.submission.findMany({ where: { contestId: contest.id }, select: { userId: true }, distinct: ["userId"] }),
    ]);
    const active = new Set(submitters.map((s) => s.userId));
    const rated = participants.filter((p) => p.score > 0 || active.has(p.userId));
    const changes = computeRatingChanges(rated.map((p) => ({ id: p.id, rating: p.user.profile?.contestRating ?? 1500, score: p.score, penalty: p.penaltyMins })));
    const byId = new Map(rated.map((p) => [p.id, p]));
    for (const ch of changes) {
      const p = byId.get(ch.id);
      if (!p) continue;
      await db.contestParticipant.update({ where: { id: p.id }, data: { rank: ch.rank, ratingBefore: ch.before, ratingAfter: ch.after, frozenScore: null, frozenPenalty: null, frozenSolved: null } });
      const profile = await db.profile.upsert({ where: { userId: p.userId }, update: {}, create: { userId: p.userId }, select: { maxRating: true } });
      await db.profile.update({ where: { userId: p.userId }, data: { contestRating: ch.after, maxRating: Math.max(profile.maxRating, ch.after) } });
      const xp = CONTEST_XP.PARTICIPATE + CONTEST_XP.PER_SOLVE * p.solved + (ch.rank <= 3 ? CONTEST_XP.PODIUM : 0);
      // Finalisation runs lazily (first view after the end), so it must not count as activity today.
      await awardXp(p.userId, "CONTEST", xp, contest.id, contest.title, { touch: false }).catch(() => undefined);
      await checkBadges(p.userId).catch(() => undefined);
      await db.notification.create({
        data: {
          userId: p.userId,
          type: "CONTEST",
          title: `${contest.title}: rank #${ch.rank}`,
          body: `Rating ${ch.before} → ${ch.after} (${ch.delta >= 0 ? "+" : ""}${ch.delta}). +${xp} XP`,
          link: `/contests/${contest.slug}`,
        },
      });
    }
    await publish(`contest-${contest.slug}`, "leaderboard", { at: Date.now(), final: true });
    return true;
  } catch (e) {
    // Release the claim so a later request can retry.
    await db.contest.update({ where: { id: contest.id }, data: { ratingsApplied: false } }).catch(() => undefined);
    console.error("[contests] finalize failed", e);
    return false;
  }
}

export type StandingRow = {
  rank: number;
  userId: string;
  name: string;
  username: string | null;
  image: string | null;
  score: number;
  penalty: number;
  solved: number;
  ratingBefore: number | null;
  ratingAfter: number | null;
  cells: { solved: boolean; attempts: number; minute: number | null }[];
};

export type Standings = {
  phase: ContestPhase;
  frozen: boolean;
  freezeAt: string | null;
  total: number;
  page: number;
  pages: number;
  problems: { id: string; slug: string; title: string; points: number; label: string }[];
  rows: StandingRow[];
  me: (StandingRow & { live: { score: number; penalty: number; solved: number } }) | null;
};

const PAGE_SIZE = 50;
const label = (i: number) => String.fromCharCode(65 + i);

/** Leaderboard for a contest. While frozen, others see the snapshot taken at freeze time. */
export async function getStandings(slug: string, viewerId: string | null, page = 1): Promise<Standings | null> {
  const contest = await db.contest.findUnique({
    where: { slug },
    include: { problems: { orderBy: { order: "asc" }, include: { problem: { select: { id: true, slug: true, title: true } } } } },
  });
  if (!contest || !contest.isPublished) return null;
  if (contestPhase(contest) === "ENDED" && !contest.ratingsApplied) await finalizeContestIfEnded(contest.id);
  const phase = contestPhase(contest);
  const frozen = isBoardFrozen(contest);
  const ended = phase === "ENDED" && (await db.contest.findUnique({ where: { id: contest.id }, select: { ratingsApplied: true } }))?.ratingsApplied;

  const total = await db.contestParticipant.count({ where: { contestId: contest.id } });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  const orderBy = ended
    ? [{ rank: { sort: "asc" as const, nulls: "last" as const } }, { score: "desc" as const }, { penaltyMins: "asc" as const }]
    : frozen
      ? [{ frozenScore: { sort: "desc" as const, nulls: "last" as const } }, { frozenPenalty: { sort: "asc" as const, nulls: "last" as const } }, { registeredAt: "asc" as const }]
      : [{ score: "desc" as const }, { penaltyMins: "asc" as const }, { registeredAt: "asc" as const }];
  const include = { user: { select: { id: true, name: true, username: true, image: true } } } as const;
  const participants = await db.contestParticipant.findMany({ where: { contestId: contest.id }, orderBy, skip: (current - 1) * PAGE_SIZE, take: PAGE_SIZE, include });

  const cutoff = frozen && contest.freezeAt ? contest.freezeAt : contest.endsAt;
  const problemIds = contest.problems.map((p) => p.problemId);
  const subs = await db.submission.findMany({
    where: { contestId: contest.id, userId: { in: [...participants.map((p) => p.userId), ...(viewerId ? [viewerId] : [])] }, createdAt: { gte: contest.startsAt, lte: contest.endsAt } },
    orderBy: { createdAt: "asc" },
    select: { userId: true, problemId: true, verdict: true, createdAt: true },
  });

  const cellsFor = (userId: string, until: Date) =>
    problemIds.map((pid) => {
      const mine = subs.filter((s) => s.userId === userId && s.problemId === pid && s.createdAt <= until && s.verdict !== "COMPILATION_ERROR");
      const ac = mine.findIndex((s) => s.verdict === "ACCEPTED");
      return {
        solved: ac >= 0,
        attempts: ac >= 0 ? ac + 1 : mine.length,
        minute: ac >= 0 ? Math.floor((mine[ac].createdAt.getTime() - contest.startsAt.getTime()) / 60_000) : null,
      };
    });

  const pick = (p: (typeof participants)[number]) =>
    frozen ? { score: p.frozenScore ?? 0, penalty: p.frozenPenalty ?? 0, solved: p.frozenSolved ?? 0 } : { score: p.score, penalty: p.penaltyMins, solved: p.solved };

  const rows: StandingRow[] = [];
  participants.forEach((p, i) => {
    const v = pick(p);
    const prev = rows[i - 1];
    const tie = prev && prev.score === v.score && prev.penalty === v.penalty;
    rows.push({
      rank: ended && p.rank ? p.rank : tie ? prev.rank : (current - 1) * PAGE_SIZE + i + 1,
      userId: p.userId,
      name: p.user.name,
      username: p.user.username,
      image: p.user.image,
      ...v,
      ratingBefore: p.ratingBefore,
      ratingAfter: p.ratingAfter,
      cells: cellsFor(p.userId, cutoff),
    });
  });

  let me: Standings["me"] = null;
  if (viewerId) {
    const mine = await db.contestParticipant.findUnique({ where: { contestId_userId: { contestId: contest.id, userId: viewerId } }, include });
    if (mine) {
      const v = pick(mine);
      const ahead = ended && mine.rank
        ? mine.rank - 1
        : await db.contestParticipant.count({
            where: frozen
              ? { contestId: contest.id, OR: [{ frozenScore: { gt: v.score } }, { frozenScore: v.score, frozenPenalty: { lt: v.penalty } }] }
              : { contestId: contest.id, OR: [{ score: { gt: v.score } }, { score: v.score, penaltyMins: { lt: v.penalty } }] },
          });
      me = {
        rank: ahead + 1,
        userId: mine.userId,
        name: mine.user.name,
        username: mine.user.username,
        image: mine.user.image,
        ...v,
        ratingBefore: mine.ratingBefore,
        ratingAfter: mine.ratingAfter,
        cells: cellsFor(viewerId, contest.endsAt),
        live: { score: mine.score, penalty: mine.penaltyMins, solved: mine.solved },
      };
    }
  }

  return {
    phase,
    frozen,
    freezeAt: contest.freezeAt?.toISOString() ?? null,
    total,
    page: current,
    pages,
    problems: contest.problems.map((cp, i) => ({ id: cp.problem.id, slug: cp.problem.slug, title: cp.problem.title, points: cp.points, label: label(i) })),
    rows,
    me,
  };
}
