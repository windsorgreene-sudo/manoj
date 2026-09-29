"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertUser, AuthError } from "@/lib/session";
import { contestPhase } from "@/lib/contests";
import { rateLimit, limits } from "@/lib/rate-limit";
import type { Result } from "@/lib/actions/learn";

const id = z.string().min(1).max(40);

async function guard<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message, unauth: e.status === 401 };
    if (e instanceof z.ZodError) return { ok: false, error: e.issues[0]?.message ?? "Invalid input" };
    if (e instanceof Error && e.message.startsWith("USER:")) return { ok: false, error: e.message.slice(5) };
    console.error("[contests]", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function setContestRegistration(input: { contestId: string; register: boolean }) {
  return guard(async () => {
    const user = await assertUser();
    const d = z.object({ contestId: id, register: z.boolean() }).parse(input);
    if (!rateLimit(`contest-reg:${user.id}`, limits.write.limit, limits.write.windowMs).success) throw new Error("USER:Slow down a little.");
    const c = await db.contest.findUnique({ where: { id: d.contestId }, select: { id: true, slug: true, startsAt: true, endsAt: true, isPublished: true } });
    if (!c || !c.isPublished) throw new Error("USER:Contest not found.");
    const phase = contestPhase(c);
    const key = { contestId_userId: { contestId: c.id, userId: user.id } };
    if (d.register) {
      if (phase === "ENDED") throw new Error("USER:This contest has ended.");
      await db.contestParticipant.upsert({ where: key, update: {}, create: { contestId: c.id, userId: user.id } });
    } else {
      if (phase !== "UPCOMING") throw new Error("USER:You can only unregister before the contest starts.");
      await db.contestParticipant.deleteMany({ where: { contestId: c.id, userId: user.id } });
    }
    revalidatePath(`/contests/${c.slug}`);
    revalidatePath("/contests");
    return { registered: d.register };
  });
}
