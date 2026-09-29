"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminAction, audit } from "@/lib/admin";
import { emailLayout, sendEmail } from "@/lib/email";
import { deleteStored } from "@/lib/uploads";
import type { Prisma } from "@/lib/generated/prisma/client";
import { appUrl } from "@/lib/utils";

const id = z.string().min(1).max(64);

// ───────── Users ─────────
export async function setUserRole(input: { userId: string; role: "STUDENT" | "CONTRIBUTOR" | "ADMIN" }) {
  return adminAction(async (actor) => {
    const d = z.object({ userId: id, role: z.enum(["STUDENT", "CONTRIBUTOR", "ADMIN"]) }).parse(input);
    if (d.userId === actor.id && d.role !== "ADMIN") throw new Error("USER:You can't demote yourself.");
    const u = await db.user.update({ where: { id: d.userId }, data: { role: d.role } });
    await db.session.deleteMany({ where: { userId: d.userId } }); // force re-login so the new role applies everywhere
    await db.notification.create({ data: { userId: u.id, type: "SYSTEM", title: `Your role is now ${d.role.toLowerCase()}`, body: d.role === "CONTRIBUTOR" ? "You can now write articles from your dashboard." : "Your permissions were updated." } });
    await audit(actor, "user.role", "User", u.email, { role: d.role });
    revalidatePath(`/admin/users/${u.id}`);
    return null;
  });
}

export async function setUserBan(input: { userId: string; banned: boolean; reason?: string; days?: number | null }) {
  return adminAction(async (actor) => {
    const d = z.object({ userId: id, banned: z.boolean(), reason: z.string().max(300).optional(), days: z.number().int().min(1).max(3650).nullable().optional() }).parse(input);
    if (d.userId === actor.id) throw new Error("USER:You can't ban yourself.");
    const u = await db.user.update({
      where: { id: d.userId },
      data: { banned: d.banned, banReason: d.banned ? (d.reason ?? "Violation of community guidelines") : null, banExpires: d.banned && d.days ? new Date(Date.now() + d.days * 86_400_000) : null },
    });
    if (d.banned) await db.session.deleteMany({ where: { userId: d.userId } });
    await audit(actor, d.banned ? (d.days ? "user.suspend" : "user.ban") : "user.unban", "User", u.email, { reason: d.reason ?? null, days: d.days ?? null });
    revalidatePath(`/admin/users/${u.id}`);
    return null;
  });
}

// ───────── Contributor applications ─────────
export async function decideApplication(input: { id: string; approve: boolean }) {
  return adminAction(async (actor) => {
    const d = z.object({ id, approve: z.boolean() }).parse(input);
    const app = await db.contributorApplication.update({ where: { id: d.id }, data: { status: d.approve ? "APPROVED" : "REJECTED" }, include: { user: true } });
    if (d.approve && app.user.role === "STUDENT") await db.user.update({ where: { id: app.userId }, data: { role: "CONTRIBUTOR" } });
    await db.notification.create({
      data: { userId: app.userId, type: "REVIEW", title: d.approve ? "Welcome to the CodeVerse contributor team! ✍️" : "Contributor application update", body: d.approve ? "Log out and back in, then start writing from Dashboard → My Articles." : "Thanks for applying. We can't approve your application right now.", link: d.approve ? "/dashboard/articles" : "/write-for-us" },
    });
    await audit(actor, d.approve ? "contributor.approve" : "contributor.reject", "User", app.user.email);
    return null;
  });
}

// ───────── Moderation ─────────
export async function resolveReport(input: { id: string; action: "resolve" | "dismiss"; hideTarget?: boolean }) {
  return adminAction(async (actor) => {
    const d = z.object({ id, action: z.enum(["resolve", "dismiss"]), hideTarget: z.boolean().optional() }).parse(input);
    const r = await db.report.update({ where: { id: d.id }, data: { status: d.action === "resolve" ? "RESOLVED" : "DISMISSED", resolvedBy: actor.id, resolvedAt: new Date() } });
    if (d.hideTarget) await setHidden({ type: r.targetType, id: r.targetId, hidden: true }, actor.id);
    await audit(actor, `report.${d.action}`, "Report", r.id, { target: `${r.targetType}:${r.targetId}`, hidden: Boolean(d.hideTarget) });
    return null;
  });
}

async function setHidden(t: { type: string; id: string; hidden: boolean }, _actorId: string) {
  if (t.type === "COMMENT") await db.comment.update({ where: { id: t.id }, data: { hidden: t.hidden } }).catch(() => undefined);
  if (t.type === "DOUBT") await db.doubt.update({ where: { id: t.id }, data: { hidden: t.hidden } }).catch(() => undefined);
  if (t.type === "ANSWER") await db.answer.update({ where: { id: t.id }, data: { hidden: t.hidden } }).catch(() => undefined);
}

export async function toggleHidden(input: { type: "COMMENT" | "DOUBT" | "ANSWER"; id: string; hidden: boolean }) {
  return adminAction(async (actor) => {
    const d = z.object({ type: z.enum(["COMMENT", "DOUBT", "ANSWER"]), id, hidden: z.boolean() }).parse(input);
    await setHidden(d, actor.id);
    await audit(actor, d.hidden ? "content.hide" : "content.unhide", d.type, d.id);
    return null;
  });
}

// ───────── Media ─────────
export async function deleteMedia(mediaId: string) {
  return adminAction(async (actor) => {
    const m = await db.media.delete({ where: { id: id.parse(mediaId) } });
    await deleteStored(m.publicId, m.url);
    await audit(actor, "media.delete", "Media", m.filename);
    return null;
  });
}

// ───────── Announcements ─────────
const annSchema = z.object({
  id: id.optional(),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(3).max(1000),
  link: z.union([z.string().startsWith("/").max(300), z.url(), z.literal("")]).optional().default(""),
  variant: z.enum(["info", "success", "warning"]),
  isBanner: z.boolean(),
  isActive: z.boolean(),
  endsAt: z.string().datetime({ offset: true }).nullable().optional(),
  notifyInApp: z.boolean().default(false),
  notifyEmail: z.boolean().default(false),
});
export type AnnouncementInput = z.input<typeof annSchema>;

export async function saveAnnouncement(input: AnnouncementInput) {
  return adminAction(async (actor) => {
    const d = annSchema.parse(input);
    const data = { title: d.title, body: d.body, link: d.link || null, variant: d.variant, isBanner: d.isBanner, isActive: d.isActive, endsAt: d.endsAt ? new Date(d.endsAt) : null };
    const a = d.id ? await db.announcement.update({ where: { id: d.id }, data }) : await db.announcement.create({ data: { ...data, authorId: actor.id } });
    let notified = 0,
      emailed = 0;
    if (d.notifyInApp) {
      const users = await db.user.findMany({ where: { banned: false }, select: { id: true } });
      const res = await db.notification.createMany({ data: users.map((u) => ({ userId: u.id, type: "ANNOUNCEMENT" as const, title: d.title, body: d.body, link: d.link || null })) });
      notified = res.count;
    }
    if (d.notifyEmail) {
      const users = await db.user.findMany({ where: { banned: false, emailVerified: true, profile: { emailNotifications: true } }, select: { email: true }, take: 500 });
      for (const u of users) {
        const r = await sendEmail({ to: u.email, subject: d.title, html: emailLayout(d.title, d.body, d.link ? { label: "Open", url: d.link.startsWith("/") ? `${appUrl()}${d.link}` : d.link } : undefined) });
        if (r.ok) emailed++;
      }
    }
    await audit(actor, d.id ? "announcement.update" : "announcement.create", "Announcement", a.id, { notified, emailed });
    revalidatePath("/", "layout");
    return { id: a.id, notified, emailed };
  });
}

export async function deleteAnnouncement(annId: string) {
  return adminAction(async (actor) => {
    await db.announcement.delete({ where: { id: id.parse(annId) } });
    await audit(actor, "announcement.delete", "Announcement", annId);
    return null;
  });
}

// ───────── Settings: flags, branding, maintenance ─────────
export async function setFlag(input: { key: string; enabled: boolean }) {
  return adminAction(async (actor) => {
    const d = z.object({ key: z.string().regex(/^[a-z_]{2,40}$/), enabled: z.boolean() }).parse(input);
    await db.featureFlag.upsert({ where: { key: d.key }, update: { enabled: d.enabled }, create: { key: d.key, enabled: d.enabled, description: d.key } });
    await audit(actor, "flag.set", "FeatureFlag", d.key, { enabled: d.enabled });
    revalidatePath("/", "layout");
    return null;
  });
}

export async function createFlag(input: { key: string; description: string }) {
  return adminAction(async (actor) => {
    const d = z.object({ key: z.string().regex(/^[a-z_]{2,40}$/, "lowercase_with_underscores"), description: z.string().trim().min(3).max(200) }).parse(input);
    await db.featureFlag.create({ data: { key: d.key, description: d.description, enabled: false } });
    await audit(actor, "flag.create", "FeatureFlag", d.key);
    return null;
  });
}

const brandingSchema = z.object({ siteName: z.string().trim().min(2).max(40), tagline: z.string().trim().max(120), supportEmail: z.email() });
export async function saveBranding(input: z.infer<typeof brandingSchema>) {
  return adminAction(async (actor) => {
    const d = brandingSchema.parse(input);
    await db.featureFlag.upsert({ where: { key: "branding" }, update: { value: d as Prisma.InputJsonValue }, create: { key: "branding", enabled: true, description: "Site branding settings.", value: d as Prisma.InputJsonValue } });
    await audit(actor, "branding.update", "FeatureFlag", "branding", d);
    revalidatePath("/", "layout");
    return null;
  });
}
