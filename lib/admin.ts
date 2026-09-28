import "server-only";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertUser, AuthError, type AppRole, type SessionUser } from "@/lib/session";
import { clientIp } from "@/lib/rate-limit";
import type { Prisma } from "@/lib/generated/prisma/client";

export type AdminResult<T = null> = { ok: true; data: T } | { ok: false; error: string };

/** Writes an audit-log entry for an admin/contributor action. */
export async function audit(actor: SessionUser, action: string, entity: string, entityId?: string | null, meta?: Prisma.InputJsonValue) {
  let ip: string | null = null;
  try {
    ip = clientIp(await headers());
  } catch {
    ip = null;
  }
  await db.auditLog.create({ data: { actorId: actor.id, action, entity, entityId: entityId ?? null, meta, ip } }).catch((e) => console.error("[audit]", e));
}

/**
 * Wraps every admin server action: server-side role check → run → uniform result.
 * (Defence in depth — the proxy also blocks non-admins from /admin.)
 */
export async function adminAction<T>(fn: (admin: SessionUser) => Promise<T>, role: AppRole = "ADMIN"): Promise<AdminResult<T>> {
  try {
    const admin = await assertUser(role);
    return { ok: true, data: await fn(admin) };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message };
    if (e instanceof z.ZodError) return { ok: false, error: e.issues.map((i) => `${i.path.join(".") || "input"}: ${i.message}`).join("; ") };
    if (e instanceof Error && e.message.startsWith("USER:")) return { ok: false, error: e.message.slice(5) };
    if (e instanceof Error && /Unique constraint/i.test(e.message)) return { ok: false, error: "That slug/code is already in use." };
    console.error("[admin action]", e);
    return { ok: false, error: "Something went wrong." };
  }
}

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens")
  .max(120);

/** Promote scheduled articles whose time has come. Cheap; called from listing pages. */
export async function publishDueArticles() {
  await db.article
    .updateMany({ where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } }, data: { status: "PUBLISHED", publishedAt: new Date() } })
    .catch(() => undefined);
}
