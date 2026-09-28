/** Only allow same-site relative redirects (prevents open redirects via ?next=). */
export function safeNext(next: string | undefined | null, fallback = "/dashboard") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
