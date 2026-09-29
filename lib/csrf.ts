import type { NextRequest } from "next/server";
import { appUrl } from "@/lib/utils";

/**
 * CSRF protection for JSON route handlers: state-changing requests must come from our own origin.
 * (Server Actions are protected by Next.js' built-in Origin check; Better Auth checks trustedOrigins.)
 */
export function assertSameOrigin(req: NextRequest | Request) {
  const origin = req.headers.get("origin");
  if (!origin) {
    // Non-browser clients (no Origin header) must at least not be cross-site fetches.
    const site = req.headers.get("sec-fetch-site");
    return !site || site === "same-origin" || site === "none";
  }
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    const o = new URL(origin);
    if (host && o.host === host) return true;
    const app = appUrl();
    return Boolean(app && new URL(app).host === o.host);
  } catch {
    return false;
  }
}
