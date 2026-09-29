import { NextResponse, type NextRequest } from "next/server";
import sanitizeHtml from "sanitize-html";
import { contactSchema } from "@/lib/validators/marketing";
import { emailLayout, sendEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { assertSameOrigin } from "@/lib/csrf";
import { db, hasDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!assertSameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const rl = rateLimit(`contact:${clientIp(req.headers)}`, 3, 10 * 60_000);
  if (!rl.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const clean = (s: string) => sanitizeHtml(s, { allowedTags: [], allowedAttributes: {} });
  const { name, email, subject, message } = parsed.data;
  // Stored for the admin Inbox; the email is a copy for the team.
  if (hasDatabase()) await db.contactMessage.create({ data: { name: clean(name).slice(0, 120), email: email.slice(0, 200), subject: clean(subject).slice(0, 200), message: clean(message).slice(0, 5000) } });
  await sendEmail({
    to: process.env.CONTACT_EMAIL ?? "support@kodshala.com",
    subject: `[Contact] ${clean(subject)}`,
    html: emailLayout(`Message from ${clean(name)}`, `${clean(message).replace(/\n/g, "<br/>")}<br/><br/>Reply to: ${clean(email)}`),
    text: `${name} <${email}>: ${message}`,
  });
  return NextResponse.json({ ok: true });
}
