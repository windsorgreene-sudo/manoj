"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminAction, audit } from "@/lib/admin";
import { issueCertificate } from "@/lib/certificates";
import { recomputeParticipant } from "@/lib/contest-scoring";
import { finalizeContestIfEnded } from "@/lib/contests";
import { checkBadges, levelForXp } from "@/lib/gamification";
import { publish } from "@/lib/realtime";

const id = z.string().min(1).max(64);

// ───────── Doubts ─────────
export async function setDoubtHidden(input: { id: string; hidden: boolean }) {
  return adminAction(async (actor) => {
    const d = z.object({ id, hidden: z.boolean() }).parse(input);
    const doubt = await db.doubt.update({ where: { id: d.id }, data: { hidden: d.hidden } });
    await audit(actor, d.hidden ? "doubt.hide" : "doubt.unhide", "Doubt", doubt.id);
    revalidatePath("/admin/doubts");
    return null;
  });
}

export async function deleteDoubt(doubtId: string) {
  return adminAction(async (actor) => {
    const doubt = await db.doubt.delete({ where: { id: id.parse(doubtId) } });
    await audit(actor, "doubt.delete", "Doubt", doubt.id, { title: doubt.title });
    revalidatePath("/admin/doubts");
    return null;
  });
}

// ───────── Certificates ─────────
export async function adminIssueCertificate(input: { email: string; courseSlug: string }) {
  return adminAction(async (actor) => {
    const d = z.object({ email: z.email().max(200), courseSlug: z.string().min(1).max(160) }).parse(input);
    const [user, course] = await Promise.all([
      db.user.findUnique({ where: { email: d.email.toLowerCase() }, select: { id: true } }),
      db.course.findUnique({ where: { slug: d.courseSlug }, select: { id: true, title: true } }),
    ]);
    if (!user) throw new Error("USER:No user with that email.");
    if (!course) throw new Error("USER:No course with that slug.");
    const cert = await issueCertificate(user.id, course.id);
    await db.notification.create({ data: { userId: user.id, type: "ACHIEVEMENT", title: `Certificate issued: ${course.title}`, body: `Certificate ID ${cert.code}`, link: "/dashboard/certificates" } });
    await audit(actor, "certificate.issue", "Certificate", cert.code, { email: d.email });
    revalidatePath("/admin/certificates");
    return { code: cert.code };
  });
}

export async function revokeCertificate(certId: string) {
  return adminAction(async (actor) => {
    const cert = await db.certificate.delete({ where: { id: id.parse(certId) } });
    await audit(actor, "certificate.revoke", "Certificate", cert.code);
    revalidatePath("/admin/certificates");
    return null;
  });
}

// ───────── Inbox ─────────
export async function setMessageStatus(input: { id: string; status: "NEW" | "READ" | "ARCHIVED" }) {
  return adminAction(async () => {
    const d = z.object({ id, status: z.enum(["NEW", "READ", "ARCHIVED"]) }).parse(input);
    await db.contactMessage.update({ where: { id: d.id }, data: { status: d.status } });
    revalidatePath("/admin/inbox");
    return null;
  });
}

export async function deleteMessage(messageId: string) {
  return adminAction(async (actor) => {
    const m = await db.contactMessage.delete({ where: { id: id.parse(messageId) } });
    await audit(actor, "message.delete", "ContactMessage", m.id, { from: m.email });
    revalidatePath("/admin/inbox");
    return null;
  });
}

export async function unsubscribeEmail(subscriberId: string) {
  return adminAction(async (actor) => {
    const s = await db.newsletterSubscriber.update({ where: { id: id.parse(subscriberId) }, data: { unsubscribedAt: new Date() } });
    await audit(actor, "newsletter.unsubscribe", "NewsletterSubscriber", s.email);
    revalidatePath("/admin/inbox");
    return null;
  });
}

// ───────── Users: XP, badges, messages ─────────
export async function adjustXp(input: { userId: string; amount: number; reason: string }) {
  return adminAction(async (actor) => {
    const d = z.object({ userId: id, amount: z.number().int().min(-100_000).max(100_000).refine((n) => n !== 0, "Amount can't be 0"), reason: z.string().trim().min(3).max(200) }).parse(input);
    const profile = await db.profile.upsert({ where: { userId: d.userId }, update: {}, create: { userId: d.userId }, select: { xp: true } });
    const xp = Math.max(0, profile.xp + d.amount);
    await db.$transaction([
      db.xpEvent.create({ data: { userId: d.userId, source: "ADMIN", amount: xp - profile.xp, refId: `admin-${Date.now()}`, note: d.reason } }),
      db.profile.update({ where: { userId: d.userId }, data: { xp, level: levelForXp(xp) } }),
      db.notification.create({ data: { userId: d.userId, type: "SYSTEM", title: `${d.amount > 0 ? "+" : ""}${d.amount} XP from the Kodshala team`, body: d.reason } }),
    ]);
    let finalXp = xp;
    if (d.amount > 0 && (await checkBadges(d.userId)).length) {
      // Newly unlocked badges add their own XP; keep the level in sync.
      finalXp = (await db.profile.findUnique({ where: { userId: d.userId }, select: { xp: true } }))?.xp ?? xp;
      await db.profile.update({ where: { userId: d.userId }, data: { level: levelForXp(finalXp) } });
    }
    await audit(actor, "user.xp", "User", d.userId, { amount: d.amount, reason: d.reason });
    revalidatePath(`/admin/users/${d.userId}`);
    return { xp: finalXp };
  });
}

export async function setUserBadge(input: { userId: string; badgeSlug: string; award: boolean }) {
  return adminAction(async (actor) => {
    const d = z.object({ userId: id, badgeSlug: z.string().min(1).max(60), award: z.boolean() }).parse(input);
    const badge = await db.badge.findUnique({ where: { slug: d.badgeSlug } });
    if (!badge) throw new Error("USER:Badge not found.");
    if (d.award) {
      await db.userBadge.upsert({ where: { userId_badgeId: { userId: d.userId, badgeId: badge.id } }, update: {}, create: { userId: d.userId, badgeId: badge.id } });
      await db.notification.create({ data: { userId: d.userId, type: "ACHIEVEMENT", title: `Badge unlocked: ${badge.name}`, body: badge.description, link: "/dashboard/achievements" } });
    } else await db.userBadge.deleteMany({ where: { userId: d.userId, badgeId: badge.id } });
    await audit(actor, d.award ? "user.badge.award" : "user.badge.revoke", "User", d.userId, { badge: badge.slug });
    revalidatePath(`/admin/users/${d.userId}`);
    return null;
  });
}

export async function messageUser(input: { userId: string; title: string; body: string; link?: string }) {
  return adminAction(async (actor) => {
    const d = z.object({ userId: id, title: z.string().trim().min(2).max(120), body: z.string().trim().min(2).max(1000), link: z.string().trim().max(300).regex(/^\/[^/]/, "Use a site path like /courses").optional().or(z.literal("")) }).parse(input);
    await db.notification.create({ data: { userId: d.userId, type: "SYSTEM", title: d.title, body: d.body, link: d.link || null } });
    await audit(actor, "user.message", "User", d.userId, { title: d.title });
    return null;
  });
}

export async function verifyUserEmail(userId: string) {
  return adminAction(async (actor) => {
    const u = await db.user.update({ where: { id: id.parse(userId) }, data: { emailVerified: true } });
    await audit(actor, "user.verify-email", "User", u.email);
    revalidatePath(`/admin/users/${u.id}`);
    return null;
  });
}

export async function resetStreak(userId: string) {
  return adminAction(async (actor) => {
    await db.streak.updateMany({ where: { userId: id.parse(userId) }, data: { current: 0 } });
    await audit(actor, "user.streak.reset", "User", userId);
    revalidatePath(`/admin/users/${userId}`);
    return null;
  });
}

// ───────── Contests ─────────
export async function recomputeContest(contestId: string) {
  return adminAction(async (actor) => {
    const c = await db.contest.findUnique({ where: { id: id.parse(contestId) }, select: { id: true, slug: true, participants: { select: { userId: true } } } });
    if (!c) throw new Error("USER:Contest not found.");
    for (const p of c.participants) await recomputeParticipant(c.id, p.userId);
    await publish(`contest-${c.slug}`, "leaderboard", { at: Date.now() });
    await audit(actor, "contest.recompute", "Contest", c.slug, { participants: c.participants.length });
    revalidatePath(`/admin/contests/${c.id}`);
    return { participants: c.participants.length };
  });
}

export async function finalizeContestNow(contestId: string) {
  return adminAction(async (actor) => {
    const c = await db.contest.findUnique({ where: { id: id.parse(contestId) }, select: { id: true, slug: true, endsAt: true, ratingsApplied: true } });
    if (!c) throw new Error("USER:Contest not found.");
    if (c.ratingsApplied) throw new Error("USER:Ratings were already applied for this contest.");
    if (c.endsAt > new Date()) throw new Error("USER:The contest hasn't ended yet.");
    const done = await finalizeContestIfEnded(c.id);
    if (!done) throw new Error("USER:Could not finalize. Check the server logs.");
    await audit(actor, "contest.finalize", "Contest", c.slug);
    revalidatePath(`/admin/contests/${c.id}`);
    return null;
  });
}

export async function disqualifyParticipant(input: { contestId: string; userId: string }) {
  return adminAction(async (actor) => {
    const d = z.object({ contestId: id, userId: id }).parse(input);
    const c = await db.contest.findUnique({ where: { id: d.contestId }, select: { slug: true, ratingsApplied: true } });
    if (!c) throw new Error("USER:Contest not found.");
    if (c.ratingsApplied) throw new Error("USER:Ratings are already applied. Disqualify before the contest is finalized.");
    await db.contestParticipant.deleteMany({ where: { contestId: d.contestId, userId: d.userId } });
    await db.notification.create({ data: { userId: d.userId, type: "CONTEST", title: "You were removed from a contest", body: "An organiser removed your entry for breaking the fair-play rules. Contact us if you think this is a mistake.", link: "/contact" } });
    await publish(`contest-${c.slug}`, "leaderboard", { at: Date.now() });
    await audit(actor, "contest.disqualify", "Contest", c.slug, { userId: d.userId });
    revalidatePath(`/admin/contests/${d.contestId}`);
    return null;
  });
}
