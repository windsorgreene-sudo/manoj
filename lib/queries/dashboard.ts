import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { levelProgress } from "@/lib/gamification";
import { DAY_MS, istDateKey, istDay, istDayStart } from "@/lib/day";

const DAY = DAY_MS;
const utcDay = (d = new Date()) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

export const getProblemOfTheDay = cache(async () => {
  const count = await db.problem.count({ where: { status: "PUBLISHED" } });
  if (!count) return null;
  const dayIndex = Math.floor(istDay().getTime() / DAY);
  const [p] = await db.problem.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { number: "asc" },
    skip: dayIndex % count,
    take: 1,
    select: { slug: true, title: true, difficulty: true, topics: true, number: true },
  });
  if (!p) return null;
  return { ...p, endsAt: new Date(istDayStart().getTime() + DAY).toISOString() };
});

export async function getOverview(userId: string) {
  const [profile, streak, enrollments, contests, potd, notifications] = await Promise.all([
    db.profile.findUnique({ where: { userId } }),
    db.streak.findUnique({ where: { userId } }),
    db.enrollment.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      include: { course: { select: { slug: true, title: true, color: true, modules: { orderBy: { order: "asc" }, select: { lessons: { orderBy: { order: "asc" }, select: { id: true, slug: true, title: true } } } } } } },
    }),
    db.contest.findMany({ where: { endsAt: { gte: new Date() }, isPublished: true }, orderBy: { startsAt: "asc" }, take: 3, select: { slug: true, title: true, startsAt: true, endsAt: true, _count: { select: { participants: true } } } }),
    getProblemOfTheDay(),
    db.notification.count({ where: { userId, read: false } }),
  ]);
  const potdSolved = potd
    ? Boolean(await db.submission.findFirst({ where: { userId, verdict: "ACCEPTED", problem: { slug: potd.slug }, createdAt: { gte: istDayStart() } }, select: { id: true } }))
    : false;
  const today = istDay().getTime();
  const last = streak?.lastActiveDay ? utcDay(streak.lastActiveDay).getTime() : 0;
  return {
    xp: profile?.xp ?? 0,
    progress: levelProgress(profile?.xp ?? 0),
    rating: profile?.contestRating ?? 1500,
    streak: { current: streak?.current ?? 0, longest: streak?.longest ?? 0, freezes: streak?.freezes ?? 0, activeToday: last === today, atRisk: last === today - DAY },
    continue: enrollments.map((e) => {
      const lessons = e.course.modules.flatMap((m) => m.lessons);
      const next = lessons.find((l) => l.id === e.lastLessonId) ?? lessons[0];
      return { slug: e.course.slug, title: e.course.title, color: e.course.color, pct: e.progressPct, nextLesson: next ? { slug: next.slug, title: next.title } : null };
    }),
    contests: contests.map((c) => ({ ...c, startsAt: c.startsAt.toISOString(), endsAt: c.endsAt.toISOString(), participants: c._count.participants })),
    potd: potd ? { ...potd, solved: potdSolved } : null,
    unread: notifications,
  };
}

export async function getActivityHeatmap(userId: string, days = 365) {
  const firstDay = new Date(istDay().getTime() - (days - 1) * DAY);
  const since = new Date(istDayStart().getTime() - (days - 1) * DAY);
  const [subs, xp, study] = await Promise.all([
    db.submission.findMany({ where: { userId, createdAt: { gte: since } }, select: { createdAt: true } }),
    db.xpEvent.findMany({ where: { userId, createdAt: { gte: since }, source: "ARTICLE_READ" }, select: { createdAt: true } }),
    db.studySession.findMany({ where: { userId, date: { gte: firstDay } }, select: { date: true } }),
  ]);
  const map = new Map<string, number>();
  const add = (d: Date) => {
    const k = istDateKey(d);
    map.set(k, (map.get(k) ?? 0) + 1);
  };
  subs.forEach((s) => add(s.createdAt));
  xp.forEach((x) => add(x.createdAt));
  study.forEach((s) => map.set(s.date.toISOString().slice(0, 10), Math.max(1, map.get(s.date.toISOString().slice(0, 10)) ?? 0)));
  const out: { date: string; count: number }[] = [];
  for (let i = 0; i < days; i++) {
    const k = new Date(firstDay.getTime() + i * DAY).toISOString().slice(0, 10);
    out.push({ date: k, count: map.get(k) ?? 0 });
  }
  return out;
}

export async function getStats(userId: string) {
  const accepted = await db.submission.findMany({
    where: { userId, verdict: "ACCEPTED", kind: "SUBMIT", problemId: { not: null } },
    select: { problemId: true, language: true, problem: { select: { difficulty: true, topics: true } } },
  });
  const solvedMap = new Map<string, { difficulty: "EASY" | "MEDIUM" | "HARD"; topics: string[] }>();
  accepted.forEach((a) => a.problem && solvedMap.set(a.problemId as string, a.problem));
  const byDifficulty = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const topic = new Map<string, number>();
  solvedMap.forEach((p) => {
    byDifficulty[p.difficulty] += 1;
    p.topics.forEach((t) => topic.set(t, (topic.get(t) ?? 0) + 1));
  });
  const allTopics = await db.problem.findMany({ where: { status: "PUBLISHED" }, select: { topics: true } });
  const topicTotals = new Map<string, number>();
  allTopics.forEach((p) => p.topics.forEach((t) => topicTotals.set(t, (topicTotals.get(t) ?? 0) + 1)));
  const radar = [...topicTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, total]) => ({ topic: name, strength: Math.round(((topic.get(name) ?? 0) / total) * 100) }));
  const langs = await db.submission.groupBy({ by: ["language"], where: { userId, kind: "SUBMIT" }, _count: true });
  const totalProblems = await db.problem.groupBy({ by: ["difficulty"], where: { status: "PUBLISHED" }, _count: true });
  const since = new Date(utcDay().getTime() - 7 * 7 * DAY);
  const sessions = await db.studySession.findMany({ where: { userId, date: { gte: since } }, select: { date: true, minutes: true } });
  const weeks: { week: string; minutes: number }[] = [];
  for (let w = 6; w >= 0; w--) {
    const start = new Date(utcDay().getTime() - (w + 1) * 7 * DAY + DAY);
    const end = new Date(start.getTime() + 7 * DAY);
    weeks.push({
      week: start.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      minutes: sessions.filter((s) => s.date >= start && s.date < end).reduce((t, s) => t + s.minutes, 0),
    });
  }
  const [submissions, acceptedCount] = await Promise.all([
    db.submission.count({ where: { userId, kind: "SUBMIT" } }),
    db.submission.count({ where: { userId, kind: "SUBMIT", verdict: "ACCEPTED" } }),
  ]);
  return {
    solved: solvedMap.size,
    byDifficulty,
    totals: Object.fromEntries(totalProblems.map((t) => [t.difficulty, t._count])) as Record<"EASY" | "MEDIUM" | "HARD", number>,
    radar,
    languages: langs.map((l) => ({ language: l.language, count: l._count })).sort((a, b) => b.count - a.count),
    weekly: weeks,
    submissions,
    acceptance: submissions ? Math.round((acceptedCount / submissions) * 1000) / 10 : 0,
  };
}

export type LeaderboardScope = "global" | "college" | "friends";

export async function getLeaderboard(scope: LeaderboardScope, userId: string | null, limit = 50) {
  let userFilter: { userId?: { in: string[] }; college?: string | null } = {};
  if (scope === "friends" && userId) {
    const follows = await db.follow.findMany({ where: { followerId: userId }, select: { followingId: true } });
    userFilter = { userId: { in: [userId, ...follows.map((f) => f.followingId)] } };
  }
  if (scope === "college" && userId) {
    const me = await db.profile.findUnique({ where: { userId }, select: { college: true } });
    userFilter = { college: me?.college ?? "__none__" };
  }
  const rows = await db.profile.findMany({
    where: { ...userFilter, user: { banned: false } },
    orderBy: [{ xp: "desc" }, { contestRating: "desc" }],
    take: limit,
    select: { xp: true, level: true, contestRating: true, college: true, user: { select: { id: true, name: true, username: true, image: true } } },
  });
  return rows.map((r, i) => ({ rank: i + 1, ...r }));
}
