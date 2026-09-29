import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { sendEmail, emailLayout } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { assertSameOrigin } from "@/lib/csrf";
import { db, hasDatabase } from "@/lib/db";

const schema = z.object({ email: z.email().max(200) });

export async function POST(req: NextRequest) {
  if (!assertSameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const rl = rateLimit(`newsletter:${clientIp(req.headers)}`, 5, 60_000);
  if (!rl.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  if (hasDatabase()) await db.newsletterSubscriber.upsert({ where: { email }, update: { unsubscribedAt: null }, create: { email } });
  await sendEmail({
    to: email,
    subject: "You're subscribed to the Kodshala weekly digest",
    html: emailLayout("Welcome aboard!", "Every Sunday you'll get the best new tutorials, the week's hardest problem and upcoming contests."),
  });
  return NextResponse.json({ ok: true });
}
