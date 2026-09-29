"use server";

import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertUser, AuthError } from "@/lib/session";
import { checkBadges } from "@/lib/gamification";
import { rateLimit, limits } from "@/lib/rate-limit";
import { slugify } from "@/lib/utils";
import type { Result } from "@/lib/actions/learn";

const plain = (s: string) => sanitizeHtml(s, { allowedTags: [], allowedAttributes: {} }).trim();
const id = z.string().min(1).max(40);

async function guard<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message, unauth: e.status === 401 };
    if (e instanceof z.ZodError) return { ok: false, error: e.issues[0]?.message ?? "Invalid input" };
    if (e instanceof Error && e.message.startsWith("USER:")) return { ok: false, error: e.message.slice(5) };
    console.error("[doubts]", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

function limit(key: string, spec: { limit: number; windowMs: number } = limits.write) {
  if (!rateLimit(key, spec.limit, spec.windowMs).success) throw new Error("USER:Slow down a little — try again in a moment.");
}

const askSchema = z.object({
  title: z.string().trim().min(12, "Make the title a little more descriptive (12+ characters).").max(160),
  body: z.string().trim().min(20, "Add some detail — what did you try? (20+ characters)").max(10_000),
  tags: z.array(z.string().trim().min(1).max(30)).min(1, "Add at least one tag.").max(5, "Up to 5 tags."),
});

export async function askDoubt(input: z.input<typeof askSchema>) {
  return guard(async () => {
    const user = await assertUser();
    const d = askSchema.parse(input);
    limit(`ask:${user.id}`, { limit: 5, windowMs: 10 * 60_000 });
    const slugs = [...new Set(d.tags.map((t) => slugify(t)).filter(Boolean))].slice(0, 5);
    const tags = await Promise.all(slugs.map((slug) => db.tag.upsert({ where: { slug }, update: {}, create: { slug, name: slug } })));
    const doubt = await db.doubt.create({ data: { userId: user.id, title: plain(d.title), body: plain(d.body), tags: { connect: tags.map((t) => ({ id: t.id })) } } });
    revalidatePath("/doubts");
    return { id: doubt.id };
  });
}

export async function answerDoubt(input: { doubtId: string; body: string }) {
  return guard(async () => {
    const user = await assertUser();
    const d = z.object({ doubtId: id, body: z.string().trim().min(10, "Answers need at least 10 characters.").max(10_000) }).parse(input);
    limit(`answer:${user.id}`);
    const doubt = await db.doubt.findUnique({ where: { id: d.doubtId }, select: { id: true, userId: true, title: true, hidden: true } });
    if (!doubt || doubt.hidden) throw new Error("USER:This doubt no longer exists.");
    const a = await db.answer.create({ data: { doubtId: doubt.id, userId: user.id, body: plain(d.body) } });
    if (doubt.userId !== user.id) {
      await db.notification.create({ data: { userId: doubt.userId, type: "COMMENT", title: `${user.name} answered your doubt`, body: doubt.title.slice(0, 120), link: `/doubts/${doubt.id}#answer-${a.id}` } });
    }
    revalidatePath(`/doubts/${doubt.id}`);
    return { id: a.id };
  });
}

export async function voteOnPost(input: { target: "DOUBT" | "ANSWER"; id: string; value: 1 | -1 | 0 }) {
  return guard(async () => {
    const user = await assertUser();
    const d = z.object({ target: z.enum(["DOUBT", "ANSWER"]), id, value: z.union([z.literal(1), z.literal(-1), z.literal(0)]) }).parse(input);
    limit(`vote:${user.id}`);
    const owner = d.target === "DOUBT" ? await db.doubt.findUnique({ where: { id: d.id }, select: { userId: true } }) : await db.answer.findUnique({ where: { id: d.id }, select: { userId: true } });
    if (!owner) throw new Error("USER:Post not found.");
    if (owner.userId === user.id) throw new Error("USER:You can't vote on your own post.");
    const key = { userId_targetType_targetId: { userId: user.id, targetType: d.target, targetId: d.id } };
    const existing = await db.vote.findUnique({ where: key });
    const delta = d.value - (existing?.value ?? 0);
    if (d.value === 0) {
      if (existing) await db.vote.delete({ where: key });
    } else await db.vote.upsert({ where: key, update: { value: d.value }, create: { userId: user.id, targetType: d.target, targetId: d.id, value: d.value } });
    const score =
      d.target === "DOUBT"
        ? (await db.doubt.update({ where: { id: d.id }, data: { score: { increment: delta } }, select: { score: true } })).score
        : (await db.answer.update({ where: { id: d.id }, data: { score: { increment: delta } }, select: { score: true } })).score;
    return { score };
  });
}

/** Only the asker can accept (or un-accept) an answer. Accepting awards the "Helping Hand" badge via checkBadges. */
export async function acceptAnswer(input: { doubtId: string; answerId: string | null }) {
  return guard(async () => {
    const user = await assertUser();
    const d = z.object({ doubtId: id, answerId: id.nullable() }).parse(input);
    const doubt = await db.doubt.findUnique({ where: { id: d.doubtId }, select: { id: true, userId: true, title: true } });
    if (!doubt) throw new Error("USER:Doubt not found.");
    if (doubt.userId !== user.id && user.role !== "ADMIN") throw new AuthError("Only the person who asked can accept an answer.", 403);
    if (d.answerId) {
      const ans = await db.answer.findUnique({ where: { id: d.answerId }, select: { doubtId: true, userId: true } });
      if (!ans || ans.doubtId !== doubt.id) throw new Error("USER:Answer not found.");
      await db.doubt.update({ where: { id: doubt.id }, data: { acceptedAnswerId: d.answerId } });
      if (ans.userId !== doubt.userId) {
        await db.notification.create({ data: { userId: ans.userId, type: "ACHIEVEMENT", title: "Your answer was accepted ✅", body: doubt.title.slice(0, 120), link: `/doubts/${doubt.id}#answer-${d.answerId}` } });
        await checkBadges(ans.userId);
      }
    } else await db.doubt.update({ where: { id: doubt.id }, data: { acceptedAnswerId: null } });
    revalidatePath(`/doubts/${doubt.id}`);
    revalidatePath("/doubts");
    return { acceptedAnswerId: d.answerId };
  });
}

export async function reportPost(input: { target: "DOUBT" | "ANSWER"; id: string; reason: string }) {
  return guard(async () => {
    const user = await assertUser();
    const d = z.object({ target: z.enum(["DOUBT", "ANSWER"]), id, reason: z.string().trim().min(3).max(200) }).parse(input);
    limit(`report:${user.id}`, { limit: 10, windowMs: 60 * 60_000 });
    const dup = await db.report.findFirst({ where: { reporterId: user.id, targetType: d.target, targetId: d.id, status: "OPEN" } });
    if (!dup) await db.report.create({ data: { reporterId: user.id, targetType: d.target, targetId: d.id, reason: plain(d.reason) } });
    return null;
  });
}
