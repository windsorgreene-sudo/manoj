"use server";

import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertUser, AuthError } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

type R<T = null> = { ok: true; data: T } | { ok: false; error: string };
const plain = (s: string) => sanitizeHtml(s, { allowedTags: [], allowedAttributes: {} }).trim();

async function run<T>(fn: () => Promise<T>): Promise<R<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message };
    if (e instanceof z.ZodError) return { ok: false, error: e.issues[0]?.message ?? "Invalid input" };
    if (e instanceof Error && e.message.startsWith("USER:")) return { ok: false, error: e.message.slice(5) };
    console.error("[dashboard action]", e);
    return { ok: false, error: "Something went wrong." };
  }
}

// ───────── Notifications ─────────
export async function listNotifications(limit = 20) {
  const user = await assertUser();
  const [items, unread] = await Promise.all([
    db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: Math.min(100, limit) }),
    db.notification.count({ where: { userId: user.id, read: false } }),
  ]);
  return { unread, items: items.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() })) };
}

export async function markNotificationsRead(ids?: string[]) {
  return run(async () => {
    const user = await assertUser();
    const parsed = z.array(z.string().max(40)).max(200).optional().parse(ids);
    await db.notification.updateMany({ where: { userId: user.id, ...(parsed ? { id: { in: parsed } } : {}) }, data: { read: true } });
    return null;
  });
}

// ───────── Profile & settings ─────────
const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(60),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/, "3-20 characters: letters, numbers, underscore"),
  bio: z.string().max(280).optional().default(""),
  college: z.string().max(100).optional().default(""),
  location: z.string().max(80).optional().default(""),
  website: z.union([z.url(), z.literal("")]).optional().default(""),
  github: z.union([z.url(), z.literal("")]).optional().default(""),
  linkedin: z.union([z.url(), z.literal("")]).optional().default(""),
  image: z.union([z.string().max(500).regex(/^(https:\/\/|\/uploads\/)/, "Invalid image URL"), z.literal("")]).optional(),
});
export type ProfileInput = z.input<typeof profileSchema>;

export async function updateProfile(input: ProfileInput) {
  return run(async () => {
    const user = await assertUser();
    const d = profileSchema.parse(input);
    const taken = await db.user.findFirst({ where: { username: d.username, id: { not: user.id } }, select: { id: true } });
    if (taken) throw new Error("USER:That username is taken.");
    await db.user.update({ where: { id: user.id }, data: { name: plain(d.name), username: d.username, ...(d.image !== undefined ? { image: d.image || null } : {}) } });
    await db.profile.upsert({
      where: { userId: user.id },
      update: { bio: plain(d.bio), college: plain(d.college) || null, location: plain(d.location) || null, website: d.website || null, github: d.github || null, linkedin: d.linkedin || null },
      create: { userId: user.id, bio: plain(d.bio), college: plain(d.college) || null },
    });
    revalidatePath(`/u/${d.username}`);
    return null;
  });
}

const prefsSchema = z.object({
  theme: z.enum(["dark", "light"]),
  locale: z.enum(["en", "hinglish"]),
  preferredLang: z.enum(["C", "CPP", "JAVA", "PYTHON", "JAVASCRIPT", "GO"]),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
});
export type PrefsInput = z.infer<typeof prefsSchema>;

export async function updatePreferences(input: PrefsInput) {
  return run(async () => {
    const user = await assertUser();
    const d = prefsSchema.parse(input);
    await db.profile.upsert({ where: { userId: user.id }, update: d, create: { userId: user.id, ...d } });
    return null;
  });
}

// ───────── Notes ─────────
export async function updateNote(input: { id: string; body: string }) {
  return run(async () => {
    const user = await assertUser();
    const d = z.object({ id: z.string().max(40), body: z.string().min(1).max(10_000) }).parse(input);
    const res = await db.note.updateMany({ where: { id: d.id, userId: user.id }, data: { body: plain(d.body) } });
    if (!res.count) throw new Error("USER:Note not found");
    return null;
  });
}

export async function deleteNote(id: string) {
  return run(async () => {
    const user = await assertUser();
    await db.note.deleteMany({ where: { id: z.string().max(40).parse(id), userId: user.id } });
    revalidatePath("/dashboard/notes");
    return null;
  });
}

export async function removeBookmark(id: string) {
  return run(async () => {
    const user = await assertUser();
    await db.bookmark.deleteMany({ where: { id: z.string().max(40).parse(id), userId: user.id } });
    revalidatePath("/dashboard/bookmarks");
    return null;
  });
}

// ───────── Flashcards (SM-2 spaced repetition) ─────────
export async function generateFlashcards() {
  return run(async () => {
    const user = await assertUser();
    if (!rateLimit(`flash:${user.id}`, 5, 60_000).success) throw new Error("USER:Slow down a little.");
    const bookmarks = await db.bookmark.findMany({
      where: { userId: user.id, articleId: { not: null } },
      include: { article: { select: { slug: true, title: true, content: true, quizzes: { select: { questions: { select: { prompt: true, options: true, correct: true, explanation: true } } } } } } },
    });
    const existing = new Set((await db.flashcard.findMany({ where: { userId: user.id }, select: { front: true } })).map((f) => f.front));
    const cards: { front: string; back: string; sourceSlug: string }[] = [];
    for (const b of bookmarks) {
      const a = b.article;
      if (!a) continue;
      for (const q of a.quizzes.flatMap((z) => z.questions)) {
        cards.push({ front: q.prompt, back: `${q.correct.map((c) => q.options[c]).join(", ")}, ${q.explanation}`, sourceSlug: a.slug });
      }
      // One "explain" card per section heading
      const headings = [...a.content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].replace(/[`*]/g, "")).slice(0, 3);
      for (const h of headings) cards.push({ front: `${a.title}: explain “${h}” in your own words.`, back: `Re-read the “${h}” section of ${a.title} and compare with your explanation.`, sourceSlug: a.slug });
    }
    const fresh = cards.filter((c) => !existing.has(c.front));
    if (fresh.length) await db.flashcard.createMany({ data: fresh.map((c) => ({ ...c, userId: user.id })) });
    revalidatePath("/dashboard/revision");
    return { created: fresh.length };
  });
}

/** SM-2: grade 0-5. <3 resets repetitions; interval grows by the ease factor. */
export async function reviewFlashcard(input: { id: string; grade: number }) {
  return run(async () => {
    const user = await assertUser();
    const d = z.object({ id: z.string().max(40), grade: z.number().int().min(0).max(5) }).parse(input);
    const c = await db.flashcard.findFirst({ where: { id: d.id, userId: user.id } });
    if (!c) throw new Error("USER:Card not found");
    let { repetitions, intervalDays, easeFactor } = c;
    if (d.grade < 3) {
      repetitions = 0;
      intervalDays = 1;
    } else {
      repetitions += 1;
      intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.round(intervalDays * easeFactor);
    }
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - d.grade) * (0.08 + (5 - d.grade) * 0.02)));
    const dueAt = new Date(Date.now() + intervalDays * 86_400_000);
    await db.flashcard.update({ where: { id: c.id }, data: { repetitions, intervalDays, easeFactor, dueAt } });
    return { intervalDays, dueAt: dueAt.toISOString() };
  });
}

export async function createFlashcard(input: { front: string; back: string }) {
  return run(async () => {
    const user = await assertUser();
    const d = z.object({ front: z.string().trim().min(3).max(500), back: z.string().trim().min(1).max(2000) }).parse(input);
    await db.flashcard.create({ data: { userId: user.id, front: plain(d.front), back: plain(d.back) } });
    revalidatePath("/dashboard/revision");
    return null;
  });
}

// ───────── Social ─────────
export async function toggleFollow(targetUserId: string) {
  return run(async () => {
    const user = await assertUser();
    const id = z.string().max(64).parse(targetUserId);
    if (id === user.id) throw new Error("USER:You can't follow yourself.");
    if (!rateLimit(`follow:${user.id}`, 30, 60_000).success) throw new Error("USER:Slow down.");
    const target = await db.user.findUnique({ where: { id }, select: { id: true } });
    if (!target) throw new Error("USER:User not found.");
    const key = { followerId_followingId: { followerId: user.id, followingId: id } };
    const existing = await db.follow.findUnique({ where: key });
    if (existing) await db.follow.delete({ where: key });
    else {
      await db.follow.create({ data: { followerId: user.id, followingId: id } });
      // Unfollow/re-follow must not spam the other person: at most one follow notice per follower per day.
      const title = `${user.name} followed you`;
      const recent = await db.notification.findFirst({ where: { userId: id, type: "FOLLOW", title, createdAt: { gte: new Date(Date.now() - 86_400_000) } }, select: { id: true } });
      if (!recent) await db.notification.create({ data: { userId: id, type: "FOLLOW", title, body: "Check out their profile.", link: user.username ? `/u/${user.username}` : undefined } });
    }
    const followers = await db.follow.count({ where: { followingId: id } });
    return { following: !existing, followers };
  });
}
