"use server";

import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertUser, AuthError, getCurrentUser } from "@/lib/session";
import { awardXp, XP_RULES, type AwardResult } from "@/lib/gamification";
import { rateLimit, limits } from "@/lib/rate-limit";
import { issueCertificate } from "@/lib/certificates";

export type Result<T = undefined> = { ok: true; data: T } | { ok: false; error: string; unauth?: boolean };

const plain = (s: string) => sanitizeHtml(s, { allowedTags: [], allowedAttributes: {} }).trim();
const id = z.string().min(1).max(40);

async function guard<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message, unauth: e.status === 401 };
    if (e instanceof z.ZodError) return { ok: false, error: e.issues[0]?.message ?? "Invalid input" };
    if (e instanceof Error && e.message.startsWith("RATE:")) return { ok: false, error: e.message.slice(5) };
    console.error("[action]", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

function limit(key: string, spec: { limit: number; windowMs: number } = limits.write) {
  if (!rateLimit(key, spec.limit, spec.windowMs).success) throw new Error("RATE:Slow down a little, try again in a moment.");
}

// ───────── Article state ─────────

export async function getArticleState(articleId: string) {
  const user = await getCurrentUser();
  const [likes, bookmark, like, read] = await Promise.all([
    db.articleLike.count({ where: { articleId } }),
    user ? db.bookmark.findUnique({ where: { userId_articleId: { userId: user.id, articleId } } }) : null,
    user ? db.articleLike.findUnique({ where: { userId_articleId: { userId: user.id, articleId } } }) : null,
    user ? db.xpEvent.findFirst({ where: { userId: user.id, source: "ARTICLE_READ", refId: articleId } }) : null,
  ]);
  return { signedIn: Boolean(user), likes, bookmarked: Boolean(bookmark), liked: Boolean(like), read: Boolean(read) };
}

export async function toggleBookmark(input: { articleId?: string; problemId?: string }) {
  return guard(async () => {
    const user = await assertUser();
    const { articleId, problemId } = z.object({ articleId: id.optional(), problemId: id.optional() }).parse(input);
    limit(`bm:${user.id}`);
    if (articleId) {
      const existing = await db.bookmark.findUnique({ where: { userId_articleId: { userId: user.id, articleId } } });
      if (existing) await db.bookmark.delete({ where: { id: existing.id } });
      else await db.bookmark.create({ data: { userId: user.id, articleId } });
      return { bookmarked: !existing };
    }
    if (problemId) {
      const existing = await db.bookmark.findUnique({ where: { userId_problemId: { userId: user.id, problemId } } });
      if (existing) await db.bookmark.delete({ where: { id: existing.id } });
      else await db.bookmark.create({ data: { userId: user.id, problemId } });
      return { bookmarked: !existing };
    }
    throw new z.ZodError([]);
  });
}

export async function toggleLike(articleId: string) {
  return guard(async () => {
    const user = await assertUser();
    id.parse(articleId);
    limit(`like:${user.id}`);
    const existing = await db.articleLike.findUnique({ where: { userId_articleId: { userId: user.id, articleId } } });
    if (existing) await db.articleLike.delete({ where: { userId_articleId: { userId: user.id, articleId } } });
    else await db.articleLike.create({ data: { userId: user.id, articleId } });
    const likes = await db.articleLike.count({ where: { articleId } });
    return { liked: !existing, likes };
  });
}

export async function markArticleRead(articleId: string): Promise<Result<AwardResult | null>> {
  return guard(async () => {
    const user = await getCurrentUser();
    id.parse(articleId);
    await db.article.update({ where: { id: articleId }, data: { views: { increment: 1 } } }).catch(() => undefined);
    if (!user) return null;
    return awardXp(user.id, "ARTICLE_READ", XP_RULES.ARTICLE_READ, articleId);
  });
}

const noteSchema = z.object({
  articleId: id.optional(),
  highlight: z.string().max(2000).optional(),
  body: z.string().min(1, "Write a note").max(10_000),
  color: z.enum(["purple", "cyan", "amber", "green"]).default("purple"),
});

export async function saveNote(input: z.input<typeof noteSchema>) {
  return guard(async () => {
    const user = await assertUser();
    const data = noteSchema.parse(input);
    limit(`note:${user.id}`);
    const note = await db.note.create({
      data: { userId: user.id, articleId: data.articleId, highlight: data.highlight ? plain(data.highlight) : null, body: plain(data.body), color: data.color },
    });
    return { id: note.id };
  });
}

export async function suggestImprovement(input: { articleId: string; details: string }) {
  return guard(async () => {
    const user = await assertUser();
    const data = z.object({ articleId: id, details: z.string().trim().min(10, "Describe the improvement (10+ characters)").max(4000) }).parse(input);
    limit(`improve:${user.id}`, { limit: 5, windowMs: 3_600_000 });
    await db.report.create({ data: { reporterId: user.id, targetType: "ARTICLE", targetId: data.articleId, reason: "Improvement suggestion", details: plain(data.details) } });
    return null;
  });
}

// ───────── Inline quiz ─────────

export async function gradeQuiz(input: { quizId: string; answers: Record<string, number[]>; timeTakenS?: number }) {
  return guard(async () => {
    const data = z.object({ quizId: id, answers: z.record(z.string(), z.array(z.number().int().min(0).max(10)).max(10)), timeTakenS: z.number().int().min(0).max(36_000).optional() }).parse(input);
    const quiz = await db.quiz.findUnique({ where: { id: data.quizId }, include: { questions: { orderBy: { order: "asc" } } } });
    if (!quiz || !quiz.isPublished) throw new Error("Quiz not found");
    let score = 0,
      max = 0,
      correct = 0,
      wrong = 0,
      skipped = 0;
    const perQuestion = quiz.questions.map((q) => {
      const given = (data.answers[q.id] ?? []).slice().sort();
      const right = q.correct.slice().sort();
      max += q.marks;
      const isSkipped = given.length === 0;
      const ok = !isSkipped && given.length === right.length && given.every((g, i) => g === right[i]);
      if (isSkipped) skipped++;
      else if (ok) {
        correct++;
        score += q.marks;
      } else {
        wrong++;
        if (quiz.negativeMarking) score -= q.marks * quiz.negativeMark;
      }
      return { id: q.id, correct: q.correct, ok, skipped: isSkipped, explanation: q.explanation, marks: q.marks };
    });
    const user = await getCurrentUser();
    let xp: AwardResult | null = null;
    // Time can't exceed the allowed duration (+30s grace for network latency).
    const timeTakenS = Math.min(data.timeTakenS ?? 0, quiz.durationMins * 60 + 30);
    if (user) {
      if (!rateLimit(`quiz:${user.id}`, limits.write.limit, limits.write.windowMs).success) throw new Error("RATE:Slow down a little, try again in a moment.");
      await db.quizAttempt.create({
        data: { userId: user.id, quizId: quiz.id, answers: data.answers, score, maxScore: max, correct, wrong, skipped, timeTakenS },
      });
      if (max > 0 && score / max >= 0.6) xp = await awardXp(user.id, "QUIZ_PASSED", XP_RULES.QUIZ_PASSED, quiz.id);
    }
    const [agg, below] = await Promise.all([
      db.quizAttempt.aggregate({ where: { quizId: quiz.id }, _avg: { score: true }, _count: { _all: true } }),
      db.quizAttempt.count({ where: { quizId: quiz.id, score: { lt: score } } }),
    ]);
    const attempts = agg._count._all;
    const stats = { attempts, avgScore: Math.round((agg._avg.score ?? 0) * 100) / 100, percentile: attempts > 1 ? Math.round((below / Math.max(1, attempts - (user ? 1 : 0))) * 100) : 100 };
    return { score: Math.round(score * 100) / 100, max, correct, wrong, skipped, perQuestion, xp, stats, timeTakenS };
  });
}

// ───────── Comments ─────────

export type CommentView = {
  id: string;
  body: string;
  score: number;
  createdAt: string;
  parentId: string | null;
  myVote: number;
  user: { name: string; username: string | null; image: string | null };
};

export async function listComments(target: { articleId?: string; problemId?: string }): Promise<CommentView[]> {
  const where = target.articleId ? { articleId: target.articleId } : { problemId: target.problemId };
  const user = await getCurrentUser();
  const rows = await db.comment.findMany({
    where: { ...where, hidden: false },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    take: 200,
    include: { user: { select: { name: true, username: true, image: true } } },
  });
  const votes = user ? await db.vote.findMany({ where: { userId: user.id, targetType: "COMMENT", targetId: { in: rows.map((r) => r.id) } } }) : [];
  const vmap = new Map(votes.map((v) => [v.targetId, v.value]));
  return rows.map((r) => ({ id: r.id, body: r.body, score: r.score, createdAt: r.createdAt.toISOString(), parentId: r.parentId, myVote: vmap.get(r.id) ?? 0, user: r.user }));
}

export async function postComment(input: { articleId?: string; problemId?: string; parentId?: string; body: string }) {
  return guard(async () => {
    const user = await assertUser();
    const data = z
      .object({ articleId: id.optional(), problemId: id.optional(), parentId: id.optional(), body: z.string().trim().min(2, "Comment is too short").max(5000) })
      .refine((d) => d.articleId || d.problemId, "Missing target")
      .parse(input);
    limit(`comment:${user.id}`, { limit: 10, windowMs: 60_000 });
    const c = await db.comment.create({
      data: { userId: user.id, target: data.articleId ? "ARTICLE" : "PROBLEM", articleId: data.articleId, problemId: data.problemId, parentId: data.parentId, body: plain(data.body) },
    });
    if (data.parentId) {
      const parent = await db.comment.findUnique({ where: { id: data.parentId }, select: { userId: true } });
      if (parent && parent.userId !== user.id) {
        await db.notification.create({ data: { userId: parent.userId, type: "COMMENT", title: `${user.name} replied to your comment`, body: plain(data.body).slice(0, 120) } });
      }
    }
    return { id: c.id };
  });
}

export async function voteComment(input: { commentId: string; value: 1 | -1 | 0 }) {
  return guard(async () => {
    const user = await assertUser();
    const data = z.object({ commentId: id, value: z.union([z.literal(1), z.literal(-1), z.literal(0)]) }).parse(input);
    limit(`vote:${user.id}`);
    const key = { userId_targetType_targetId: { userId: user.id, targetType: "COMMENT" as const, targetId: data.commentId } };
    const existing = await db.vote.findUnique({ where: key });
    const delta = data.value - (existing?.value ?? 0);
    if (data.value === 0) {
      if (existing) await db.vote.delete({ where: key });
    } else await db.vote.upsert({ where: key, update: { value: data.value }, create: { userId: user.id, targetType: "COMMENT", targetId: data.commentId, value: data.value } });
    const c = await db.comment.update({ where: { id: data.commentId }, data: { score: { increment: delta } } });
    return { score: c.score };
  });
}

// ───────── Courses ─────────

export async function enrollInCourse(courseId: string) {
  return guard(async () => {
    const user = await assertUser();
    id.parse(courseId);
    const course = await db.course.findUnique({ where: { id: courseId }, select: { slug: true } });
    if (!course) throw new Error("Course not found");
    await db.enrollment.upsert({ where: { userId_courseId: { userId: user.id, courseId } }, update: {}, create: { userId: user.id, courseId } });
    revalidatePath(`/courses/${course.slug}`);
    return { slug: course.slug };
  });
}

export async function setLessonComplete(input: { lessonId: string; completed: boolean }) {
  return guard(async () => {
    const user = await assertUser();
    const data = z.object({ lessonId: id, completed: z.boolean() }).parse(input);
    const lesson = await db.lesson.findUnique({ where: { id: data.lessonId }, select: { id: true, module: { select: { courseId: true, course: { select: { slug: true, title: true } } } } } });
    if (!lesson) throw new Error("Lesson not found");
    const courseId = lesson.module.courseId;
    const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } });
    if (!enrollment) throw new AuthError("Enroll in the course first.", 403);
    await db.progress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
      update: { completed: data.completed, completedAt: data.completed ? new Date() : null },
      create: { userId: user.id, lessonId: lesson.id, completed: data.completed, completedAt: data.completed ? new Date() : null },
    });
    const [total, done] = await Promise.all([
      db.lesson.count({ where: { module: { courseId } } }),
      db.progress.count({ where: { userId: user.id, completed: true, lesson: { module: { courseId } } } }),
    ]);
    const pct = Math.round((done / Math.max(1, total)) * 100);
    const justCompleted = pct === 100 && !enrollment.completedAt;
    await db.enrollment.update({
      where: { id: enrollment.id },
      data: { progressPct: pct, lastLessonId: lesson.id, completedAt: pct === 100 ? (enrollment.completedAt ?? new Date()) : null },
    });
    let xp: AwardResult | null = null;
    if (justCompleted) {
      xp = await awardXp(user.id, "COURSE_COMPLETED", XP_RULES.COURSE_COMPLETED, courseId);
      const cert = await issueCertificate(user.id, courseId);
      await db.notification.create({
        data: { userId: user.id, type: "ACHIEVEMENT", title: `You completed ${lesson.module.course.title}!`, body: `Your certificate ${cert.code} is ready to download.`, link: "/dashboard/certificates" },
      });
    }
    revalidatePath(`/courses/${lesson.module.course.slug}`);
    return { pct, justCompleted, xp };
  });
}

export async function submitReview(input: { courseId: string; rating: number; body: string }) {
  return guard(async () => {
    const user = await assertUser();
    const data = z.object({ courseId: id, rating: z.number().int().min(1).max(5), body: z.string().trim().min(10, "Write at least 10 characters").max(2000) }).parse(input);
    const enrolled = await db.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId: data.courseId } }, include: { course: { select: { slug: true } } } });
    if (!enrolled) throw new AuthError("Enroll in the course to leave a review.", 403);
    await db.review.upsert({
      where: { userId_courseId: { userId: user.id, courseId: data.courseId } },
      update: { rating: data.rating, body: plain(data.body) },
      create: { userId: user.id, courseId: data.courseId, rating: data.rating, body: plain(data.body) },
    });
    revalidatePath(`/courses/${enrolled.course.slug}`);
    return null;
  });
}

export async function getCourseUserState(courseId: string) {
  const user = await getCurrentUser();
  if (!user) return { signedIn: false, enrolled: false, completed: [] as string[], progressPct: 0, lastLessonId: null as string | null, reviewed: false };
  const [enrollment, progress, review] = await Promise.all([
    db.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } }),
    db.progress.findMany({ where: { userId: user.id, completed: true, lesson: { module: { courseId } } }, select: { lessonId: true } }),
    db.review.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } }),
  ]);
  return {
    signedIn: true,
    enrolled: Boolean(enrollment),
    completed: progress.map((p) => p.lessonId),
    progressPct: enrollment?.progressPct ?? 0,
    lastLessonId: enrollment?.lastLessonId ?? null,
    reviewed: Boolean(review),
  };
}
