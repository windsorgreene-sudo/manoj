import "server-only";
import { db } from "@/lib/db";
import type { XpSource } from "@/lib/generated/prisma/client";

/** XP rules (single source of truth). */
export const XP_RULES = {
  ARTICLE_READ: 5,
  PROBLEM: { EASY: 10, MEDIUM: 20, HARD: 40 },
  STREAK_BONUS_EVERY: 7,
  STREAK_BONUS: 25,
  QUIZ_PASSED: 15,
  COURSE_COMPLETED: 100,
} as const;

/** Level n requires 50·(n−1)² XP. */
export const levelForXp = (xp: number) => Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
export const xpForLevel = (level: number) => 50 * (level - 1) ** 2;

export function levelProgress(xp: number) {
  const level = levelForXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, current: xp - base, needed: next - base, pct: Math.round(((xp - base) / (next - base)) * 100), nextLevelXp: next };
}

export type AwardResult = { awarded: boolean; amount: number; xp: number; level: number; leveledUp: boolean; streak: number; newBadges: { slug: string; name: string; icon: string; color: string }[] };

const utcDay = (d = new Date()) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
const DAY = 86_400_000;

/** Updates the daily streak (with streak freezes). Returns the current streak and whether a bonus is due. */
export async function touchStreak(userId: string) {
  const today = utcDay();
  const s = await db.streak.upsert({ where: { userId }, update: {}, create: { userId } });
  const last = s.lastActiveDay ? utcDay(s.lastActiveDay) : null;
  if (last && last.getTime() === today.getTime()) return { current: s.current, bonus: false };
  let current = 1;
  let freezes = s.freezes;
  if (last) {
    const gap = Math.round((today.getTime() - last.getTime()) / DAY);
    if (gap === 1) current = s.current + 1;
    else if (gap === 2 && freezes > 0) {
      current = s.current + 1;
      freezes -= 1;
    }
  }
  // Earn a freeze every 30 days of streak (max 3)
  if (current % 30 === 0) freezes = Math.min(3, freezes + 1);
  await db.streak.update({ where: { userId }, data: { current, longest: Math.max(s.longest, current), freezes, lastActiveDay: today } });
  return { current, bonus: current > 0 && current % XP_RULES.STREAK_BONUS_EVERY === 0 };
}

async function addXp(userId: string, source: XpSource, amount: number, refId: string | null, note?: string) {
  try {
    await db.xpEvent.create({ data: { userId, source, amount, refId, note } });
  } catch {
    return false; // unique(userId, source, refId) → already awarded
  }
  await db.profile.upsert({ where: { userId }, update: { xp: { increment: amount } }, create: { userId, xp: amount } });
  return true;
}

/** Idempotently awards XP for (source, refId), updates level + streak, and checks badges. */
export async function awardXp(userId: string, source: XpSource, amount: number, refId: string | null, note?: string): Promise<AwardResult> {
  const before = await db.profile.findUnique({ where: { userId }, select: { xp: true } });
  const beforeLevel = levelForXp(before?.xp ?? 0);
  const awarded = await addXp(userId, source, amount, refId, note);
  const streak = await touchStreak(userId);
  let total = awarded ? amount : 0;
  if (streak.bonus) {
    const bonusGiven = await addXp(userId, "STREAK_BONUS", XP_RULES.STREAK_BONUS, `streak-${utcDay().toISOString().slice(0, 10)}`, `${streak.current}-day streak`);
    if (bonusGiven) total += XP_RULES.STREAK_BONUS;
  }
  const newBadges = awarded ? await checkBadges(userId) : [];
  const profile = await db.profile.findUnique({ where: { userId }, select: { xp: true } });
  const xp = profile?.xp ?? 0;
  const level = levelForXp(xp);
  await db.profile.update({ where: { userId }, data: { level } }).catch(() => undefined);
  await db.user.update({ where: { id: userId }, data: { lastActiveAt: new Date() } }).catch(() => undefined);
  if (level > beforeLevel) {
    await db.notification.create({ data: { userId, type: "ACHIEVEMENT", title: `Level up! You reached level ${level}`, body: "Keep going, new badges await.", link: "/dashboard" } });
  }
  return { awarded, amount: total, xp, level, leveledUp: level > beforeLevel, streak: streak.current, newBadges };
}

type Criteria = { type: string; count: number };

/** Evaluates badge criteria and awards any newly earned badges. */
export async function checkBadges(userId: string) {
  const [badges, owned] = await Promise.all([db.badge.findMany(), db.userBadge.findMany({ where: { userId }, select: { badgeId: true } })]);
  const have = new Set(owned.map((o) => o.badgeId));
  const pending = badges.filter((b) => !have.has(b.id));
  if (!pending.length) return [];

  const cache = new Map<string, number>();
  const metric = async (type: string): Promise<number> => {
    if (cache.has(type)) return cache.get(type) as number;
    let v = 0;
    if (type === "solved" || type === "solvedHard") {
      const rows = await db.submission.findMany({
        where: { userId, verdict: "ACCEPTED", kind: "SUBMIT", ...(type === "solvedHard" ? { problem: { difficulty: "HARD" } } : {}) },
        select: { problemId: true },
        distinct: ["problemId"],
      });
      v = rows.length;
    } else if (type === "articles") v = await db.xpEvent.count({ where: { userId, source: "ARTICLE_READ" } });
    else if (type === "streak") v = (await db.streak.findUnique({ where: { userId } }))?.current ?? 0;
    else if (type === "courses") v = await db.enrollment.count({ where: { userId, completedAt: { not: null } } });
    else if (type === "perfectQuiz") {
      const attempts = await db.quizAttempt.findMany({ where: { userId }, select: { score: true, maxScore: true } });
      v = attempts.filter((a) => a.maxScore > 0 && a.score >= a.maxScore).length;
    } else if (type === "contests") v = await db.contestParticipant.count({ where: { userId, score: { gt: 0 } } });
    else if (type === "podium") v = await db.contestParticipant.count({ where: { userId, rank: { lte: 3 } } });
    else if (type === "languages") {
      const rows = await db.submission.findMany({ where: { userId, verdict: "ACCEPTED" }, select: { language: true }, distinct: ["language"] });
      v = rows.length;
    } else if (type === "acceptedAnswers") v = await db.answer.count({ where: { userId, acceptedOn: { isNot: null } } });
    else if (type === "nightOwl") {
      const rows = await db.submission.findMany({ where: { userId, verdict: "ACCEPTED" }, select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 200 });
      // IST night: 00:00-04:00 IST = 18:30-22:30 UTC
      v = rows.filter((r) => {
        const m = (r.createdAt.getUTCHours() * 60 + r.createdAt.getUTCMinutes() + 330) % 1440;
        return m < 240;
      }).length;
    }
    cache.set(type, v);
    return v;
  };

  const earned = [];
  for (const b of pending) {
    const c = b.criteria as unknown as Criteria;
    if (c && typeof c.count === "number" && (await metric(c.type)) >= c.count) {
      await db.userBadge.create({ data: { userId, badgeId: b.id } }).catch(() => undefined);
      await addXp(userId, "BADGE", b.xpReward, b.id, b.name);
      await db.notification.create({ data: { userId, type: "ACHIEVEMENT", title: `Badge unlocked: ${b.name}`, body: b.description, link: "/dashboard/achievements" } });
      earned.push({ slug: b.slug, name: b.name, icon: b.icon, color: b.color });
    }
  }
  return earned;
}
