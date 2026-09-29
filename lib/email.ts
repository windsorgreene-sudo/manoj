import "server-only";
import { Resend } from "resend";
import { integrations } from "@/lib/env";

type Mail = { to: string; subject: string; html: string; text?: string };

const FROM = process.env.EMAIL_FROM ?? "CodeVerse <onboarding@resend.dev>";

/** Sends through Resend when configured; otherwise logs the email to the server console (dev fallback). */
export async function sendEmail(mail: Mail) {
  if (!integrations.resend()) {
    console.info(
      `\n[email:console-fallback] To: ${mail.to}\n   Subject: ${mail.subject}\n   ${mail.text ?? mail.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}\n`,
    );
    return { ok: true as const, fallback: true };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from: FROM, ...mail });
  if (error) {
    console.error("[email] resend error", error);
    return { ok: false as const, fallback: false };
  }
  return { ok: true as const, fallback: false };
}

export function emailLayout(title: string, body: string, cta?: { label: string; url: string }) {
  return `<!doctype html><html><body style="margin:0;background:#0A0A14;font-family:Inter,Arial,sans-serif;color:#EDEDF5">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    <div style="font-size:22px;font-weight:700;margin-bottom:24px"><span style="color:#A78BFA">Code</span>Verse</div>
    <div style="background:#12121F;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:32px">
      <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
      <p style="line-height:1.6;color:#A1A1B8;margin:0 0 24px">${body}</p>
      ${cta ? `<a href="${cta.url}" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600">${cta.label}</a>` : ""}
    </div>
    <p style="color:#5b5b72;font-size:12px;margin-top:24px">You received this email because you have a CodeVerse account.</p>
  </div></body></html>`;
}
