"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function getFollowState(userId: string) {
  const id = z.string().max(64).parse(userId);
  const me = await getCurrentUser();
  if (!me) return { signedIn: false, self: false, following: false };
  if (me.id === id) return { signedIn: true, self: true, following: false };
  const f = await db.follow.findUnique({ where: { followerId_followingId: { followerId: me.id, followingId: id } } });
  return { signedIn: true, self: false, following: Boolean(f) };
}
