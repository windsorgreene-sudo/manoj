import "server-only";
import { db, hasDatabase } from "@/lib/db";

/** Reads a feature flag (admin → Settings). Missing flags fall back to `fallback`. */
export async function isFlagEnabled(key: string, fallback = true) {
  if (!hasDatabase()) return fallback;
  try {
    const f = await db.featureFlag.findUnique({ where: { key }, select: { enabled: true } });
    return f ? f.enabled : fallback;
  } catch {
    return fallback;
  }
}
