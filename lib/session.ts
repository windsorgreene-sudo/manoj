import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";

export type AppRole = "STUDENT" | "CONTRIBUTOR" | "ADMIN";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: AppRole;
  username: string | null;
  isPro: boolean;
};

const ROLE_RANK: Record<AppRole, number> = { STUDENT: 0, CONTRIBUTOR: 1, ADMIN: 2 };

export function hasRole(user: { role: string } | null | undefined, min: AppRole) {
  if (!user) return false;
  const rank = ROLE_RANK[user.role as AppRole];
  return rank !== undefined && rank >= ROLE_RANK[min];
}

/** Reads the current session (deduped per request). Returns null when signed out or DB unavailable. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  if (!hasDatabase()) return null;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;
    const u = session.user as typeof session.user & { role?: string; username?: string | null; isPro?: boolean };
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image ?? null,
      role: (u.role as AppRole) ?? "STUDENT",
      username: u.username ?? null,
      isPro: Boolean(u.isPro),
    };
  } catch {
    return null;
  }
});

/** Page guard: redirects to login when signed out, or home when role is insufficient. */
export async function requireUser(min: AppRole = "STUDENT", next = "/dashboard") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!hasRole(user, min)) redirect("/?denied=1");
  return user;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: 401 | 403,
  ) {
    super(message);
  }
}

/** Action / API guard: throws AuthError instead of redirecting. */
export async function assertUser(min: AppRole = "STUDENT") {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Please sign in to continue.", 401);
  if (!hasRole(user, min)) throw new AuthError("You do not have permission to do that.", 403);
  return user;
}
