"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminAction, audit, slugSchema } from "@/lib/admin";
import { publish } from "@/lib/realtime";

const id = z.string().min(1).max(40);

// ───────── Quizzes ─────────
const questionSchema = z.object({
  prompt: z.string().trim().min(3).max(2000),
  options: z.array(z.string().trim().min(1).max(500)).min(2).max(6),
  correct: z.array(z.number().int().min(0).max(5)).min(1),
  explanation: z.string().trim().min(1).max(2000),
  marks: z.number().int().min(1).max(10),
  type: z.enum(["SINGLE", "MULTIPLE", "TRUE_FALSE"]),
});
const quizSchema = z.object({
  id: id.optional(),
  slug: slugSchema,
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(5).max(2000),
  topic: z.string().trim().min(2).max(60),
  durationMins: z.number().int().min(1).max(300),
  negativeMarking: z.boolean(),
  negativeMark: z.number().min(0).max(1),
  isMockTest: z.boolean(),
  isPublished: z.boolean(),
  questions: z.array(questionSchema).min(1).max(200),
});
export type QuizInput = z.infer<typeof quizSchema>;

export async function saveQuiz(input: QuizInput) {
  return adminAction(async (actor) => {
    const d = quizSchema.parse(input);
    d.questions.forEach((q, i) => {
      if (q.correct.some((c) => c >= q.options.length)) throw new Error(`USER:Question ${i + 1}: correct option out of range`);
    });
    const { id: qid, questions, ...data } = d;
    const qs = questions.map((q, order) => ({ ...q, order }));
    let quizId = qid;
    if (qid) await db.$transaction([db.quiz.update({ where: { id: qid }, data }), db.question.deleteMany({ where: { quizId: qid } }), db.question.createMany({ data: qs.map((q) => ({ ...q, quizId: qid })) })]);
    else quizId = (await db.quiz.create({ data: { ...data, questions: { create: qs } } })).id;
    await audit(actor, qid ? "quiz.update" : "quiz.create", "Quiz", d.slug, { questions: qs.length });
    revalidatePath("/quizzes");
    revalidatePath(`/quizzes/${d.slug}`);
    return { id: quizId as string };
  });
}

export async function deleteQuiz(quizId: string) {
  return adminAction(async (actor) => {
    const q = await db.quiz.delete({ where: { id: id.parse(quizId) } });
    await audit(actor, "quiz.delete", "Quiz", q.slug);
    revalidatePath("/quizzes");
    return null;
  });
}

// ───────── Sheets ─────────
const sheetSchema = z.object({
  id: id.optional(),
  slug: slugSchema,
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(5).max(1000),
  kind: z.enum(["TOPIC", "COMPANY"]),
  company: z.string().max(60).optional().default(""),
  isPublished: z.boolean(),
  items: z.array(z.object({ problemSlug: z.string().max(160), section: z.string().trim().min(1).max(80) })).max(300),
});
export type SheetInput = z.input<typeof sheetSchema>;

export async function saveSheet(input: SheetInput) {
  return adminAction(async (actor) => {
    const d = sheetSchema.parse(input);
    const problems = await db.problem.findMany({ where: { slug: { in: d.items.map((i) => i.problemSlug) } }, select: { id: true, slug: true } });
    const map = new Map(problems.map((p) => [p.slug, p.id]));
    const missing = d.items.filter((i) => !map.has(i.problemSlug)).map((i) => i.problemSlug);
    if (missing.length) throw new Error(`USER:Unknown problem slug(s): ${missing.join(", ")}`);
    const seen = new Set<string>();
    const items = d.items.filter((i) => (seen.has(i.problemSlug) ? false : (seen.add(i.problemSlug), true))).map((i, order) => ({ problemId: map.get(i.problemSlug) as string, section: i.section, order }));
    const data = { slug: d.slug, title: d.title, description: d.description, kind: d.kind, company: d.kind === "COMPANY" ? d.company || null : null, isPublished: d.isPublished };
    let sheetId = d.id;
    if (d.id) await db.$transaction([db.sheet.update({ where: { id: d.id }, data }), db.sheetItem.deleteMany({ where: { sheetId: d.id } }), db.sheetItem.createMany({ data: items.map((i) => ({ ...i, sheetId: d.id as string })) })]);
    else sheetId = (await db.sheet.create({ data: { ...data, items: { create: items } } })).id;
    await audit(actor, d.id ? "sheet.update" : "sheet.create", "Sheet", d.slug);
    revalidatePath("/sheets");
    revalidatePath(`/sheets/${d.slug}`);
    return { id: sheetId as string };
  });
}

export async function deleteSheet(sheetId: string) {
  return adminAction(async (actor) => {
    const s = await db.sheet.delete({ where: { id: id.parse(sheetId) } });
    await audit(actor, "sheet.delete", "Sheet", s.slug);
    revalidatePath("/sheets");
    return null;
  });
}

// ───────── Roadmaps ─────────
const nodeSchema = z.object({ id: z.string().min(1).max(40), label: z.string().min(1).max(60), x: z.number().min(-10).max(10), y: z.number().min(0).max(50), href: z.string().startsWith("/").max(200), kind: z.enum(["core", "optional", "advanced", "practice"]) });
const roadmapSchema = z.object({
  id: id.optional(),
  slug: slugSchema,
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(5).max(1000),
  isPublished: z.boolean(),
  nodes: z.array(nodeSchema).min(1).max(120),
  edges: z.array(z.tuple([z.string(), z.string()])).max(400),
});
export type RoadmapInput = z.infer<typeof roadmapSchema>;

export async function saveRoadmap(input: RoadmapInput) {
  return adminAction(async (actor) => {
    const d = roadmapSchema.parse(input);
    const ids = new Set(d.nodes.map((n) => n.id));
    const bad = d.edges.find(([a, b]) => !ids.has(a) || !ids.has(b));
    if (bad) throw new Error(`USER:Edge ${bad[0]} → ${bad[1]} references a missing node`);
    const { id: rid, ...data } = d;
    const r = rid ? await db.roadmap.update({ where: { id: rid }, data }) : await db.roadmap.create({ data });
    await audit(actor, rid ? "roadmap.update" : "roadmap.create", "Roadmap", d.slug);
    revalidatePath("/roadmaps");
    revalidatePath(`/roadmaps/${d.slug}`);
    return { id: r.id };
  });
}

export async function deleteRoadmap(roadmapId: string) {
  return adminAction(async (actor) => {
    const r = await db.roadmap.delete({ where: { id: id.parse(roadmapId) } });
    await audit(actor, "roadmap.delete", "Roadmap", r.slug);
    revalidatePath("/roadmaps");
    return null;
  });
}

// ───────── Contests ─────────
const contestSchema = z
  .object({
    id: id.optional(),
    slug: slugSchema,
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().min(5).max(3000),
    startsAt: z.string().datetime({ offset: true }),
    endsAt: z.string().datetime({ offset: true }),
    isPublished: z.boolean(),
    problems: z.array(z.object({ problemSlug: z.string().max(160), points: z.number().int().min(1).max(10_000) })).min(1).max(15),
  })
  .refine((d) => new Date(d.endsAt) > new Date(d.startsAt), { message: "End must be after start", path: ["endsAt"] });
export type ContestInput = z.input<typeof contestSchema>;

export async function saveContest(input: ContestInput) {
  return adminAction(async (actor) => {
    const d = contestSchema.parse(input);
    const problems = await db.problem.findMany({ where: { slug: { in: d.problems.map((p) => p.problemSlug) } }, select: { id: true, slug: true } });
    const map = new Map(problems.map((p) => [p.slug, p.id]));
    const missing = d.problems.filter((p) => !map.has(p.problemSlug));
    if (missing.length) throw new Error(`USER:Unknown problem slug(s): ${missing.map((m) => m.problemSlug).join(", ")}`);
    const cps = d.problems.map((p, order) => ({ problemId: map.get(p.problemSlug) as string, points: p.points, order }));
    const data = { slug: d.slug, title: d.title, description: d.description, startsAt: new Date(d.startsAt), endsAt: new Date(d.endsAt), isPublished: d.isPublished };
    let contestId = d.id;
    if (d.id) await db.$transaction([db.contest.update({ where: { id: d.id }, data }), db.contestProblem.deleteMany({ where: { contestId: d.id } }), db.contestProblem.createMany({ data: cps.map((c) => ({ ...c, contestId: d.id as string })) })]);
    else contestId = (await db.contest.create({ data: { ...data, problems: { create: cps } } })).id;
    await audit(actor, d.id ? "contest.update" : "contest.create", "Contest", d.slug);
    revalidatePath("/contests");
    revalidatePath(`/contests/${d.slug}`);
    return { id: contestId as string };
  });
}

export async function setContestFrozen(input: { id: string; frozen: boolean }) {
  return adminAction(async (actor) => {
    const d = z.object({ id, frozen: z.boolean() }).parse(input);
    const c = await db.contest.update({ where: { id: d.id }, data: { frozen: d.frozen, freezeAt: d.frozen ? new Date() : null } });
    // Snapshot public standings at freeze time; clear the snapshot on unfreeze.
    if (d.frozen) await db.$executeRaw`UPDATE "ContestParticipant" SET "frozenScore" = "score", "frozenPenalty" = "penaltyMins", "frozenSolved" = "solved" WHERE "contestId" = ${c.id}`;
    else await db.contestParticipant.updateMany({ where: { contestId: c.id }, data: { frozenScore: null, frozenPenalty: null, frozenSolved: null } });
    await audit(actor, d.frozen ? "contest.freeze" : "contest.unfreeze", "Contest", c.slug);
    await publish(`contest-${c.slug}`, "leaderboard", { at: Date.now() });
    revalidatePath(`/contests/${c.slug}`);
    return null;
  });
}

export async function deleteContest(contestId: string) {
  return adminAction(async (actor) => {
    const c = await db.contest.delete({ where: { id: id.parse(contestId) } });
    await audit(actor, "contest.delete", "Contest", c.slug);
    revalidatePath("/contests");
    return null;
  });
}
