"use server";

import sanitizeHtml from "sanitize-html";
import { db } from "@/lib/db";
import { assertUser, AuthError } from "@/lib/session";
import { contributorSchema, type ContributorInput } from "@/lib/validators/marketing";
import { rateLimit } from "@/lib/rate-limit";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

export async function applyAsContributor(input: ContributorInput): Promise<ActionResult> {
  try {
    const user = await assertUser("STUDENT");
    if (!rateLimit(`contrib:${user.id}`, 3, 3_600_000).success) return { ok: false, error: "Too many applications. Try again later." };
    const parsed = contributorSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    const pending = await db.contributorApplication.findFirst({ where: { userId: user.id, status: "PENDING" } });
    if (pending) return { ok: false, error: "You already have a pending application." };
    await db.contributorApplication.create({
      data: {
        userId: user.id,
        expertise: sanitizeHtml(parsed.data.expertise, { allowedTags: [] }),
        sample: sanitizeHtml(parsed.data.sample, { allowedTags: [] }),
        portfolio: parsed.data.portfolio || null,
      },
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Something went wrong." };
  }
}
