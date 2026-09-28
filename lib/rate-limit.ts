import "server-only";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateLimitResult = { success: boolean; remaining: number; resetAt: number };

/**
 * Fixed-window in-memory rate limiter. Good for a single instance / serverless warm instance.
 * For multi-region production swap for Upstash/Redis with the same signature.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + windowMs };
    buckets.set(key, fresh);
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    return { success: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }
  bucket.count += 1;
  return { success: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count), resetAt: bucket.resetAt };
}

export const limits = {
  codeRun: { limit: 20, windowMs: 60_000 },
  submit: { limit: 10, windowMs: 60_000 },
  ai: { limit: 15, windowMs: 60_000 },
  write: { limit: 30, windowMs: 60_000 },
} as const;

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headers.get("x-real-ip") ?? "local";
}
