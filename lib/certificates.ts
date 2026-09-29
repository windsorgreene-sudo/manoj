import "server-only";
import { randomBytes } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { winAnsi } from "@/lib/pdf-text";
import { appUrl } from "@/lib/utils";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

function randomCode(topic: string) {
  const prefix = topic.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase().padEnd(2, "X");
  const bytes = randomBytes(4);
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `CV-${prefix}-${new Date().getUTCFullYear()}-${suffix}`;
}

export const CODE_PATTERN = /^CV-[A-Z]{2}-\d{4}-[A-Z0-9]{4,8}$/;
export const verifyUrl = (code: string) => `${appUrl()}/verify/${code}`;

/** Issues (or returns the existing) certificate for a completed course. Idempotent per (user, course). */
export async function issueCertificate(userId: string, courseId: string) {
  const existing = await db.certificate.findUnique({ where: { userId_courseId: { userId, courseId } } });
  if (existing) return existing;
  const course = await db.course.findUnique({ where: { id: courseId }, select: { topic: true } });
  for (let i = 0; i < 5; i++) {
    try {
      return await db.certificate.create({ data: { userId, courseId, code: randomCode(course?.topic ?? "CV") } });
    } catch (e) {
      const again = await db.certificate.findUnique({ where: { userId_courseId: { userId, courseId } } });
      if (again) return again;
      if (i === 4) throw e;
    }
  }
  throw new Error("Could not issue certificate");
}

export async function getCertificate(code: string) {
  if (!CODE_PATTERN.test(code)) return null;
  return db.certificate.findUnique({
    where: { code },
    include: { user: { select: { name: true, username: true } }, course: { select: { title: true, slug: true, level: true, durationMins: true, topic: true } } },
  });
}

type CertData = NonNullable<Awaited<ReturnType<typeof getCertificate>>>;

/** Landscape A4 certificate with a QR code linking to the public verification page. */
export async function renderCertificatePdf(cert: CertData) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`CodeVerse Certificate - ${cert.course.title}`);
  pdf.setAuthor("CodeVerse");
  pdf.setSubject(`Certificate ${cert.code}`);
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();
  const [serif, serifBold, sans, sansBold] = await Promise.all([
    pdf.embedFont(StandardFonts.TimesRoman),
    pdf.embedFont(StandardFonts.TimesRomanBold),
    pdf.embedFont(StandardFonts.Helvetica),
    pdf.embedFont(StandardFonts.HelveticaBold),
  ]);
  const ink = rgb(0.06, 0.06, 0.12);
  const violet = rgb(0.486, 0.227, 0.929);
  const cyan = rgb(0.024, 0.714, 0.831);
  const muted = rgb(0.4, 0.4, 0.5);

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.985, 0.982, 1) });
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: violet, borderWidth: 3 });
  page.drawRectangle({ x: 34, y: 34, width: width - 68, height: height - 68, borderColor: cyan, borderWidth: 0.8 });
  page.drawRectangle({ x: 24, y: height - 34, width: width - 48, height: 10, color: violet });

  const center = (text: string, y: number, size: number, font = serif, color = ink) => {
    const t = winAnsi(text);
    page.drawText(t, { x: (width - font.widthOfTextAtSize(t, size)) / 2, y, size, font, color });
  };

  center("CODEVERSE", height - 92, 16, sansBold, violet);
  center("CERTIFICATE OF COMPLETION", height - 140, 30, serifBold);
  center("This certifies that", height - 190, 14, serif, muted);
  let nameSize = 40;
  while (serifBold.widthOfTextAtSize(winAnsi(cert.user.name), nameSize) > width - 200 && nameSize > 20) nameSize -= 2;
  center(cert.user.name, height - 245, nameSize, serifBold);
  page.drawLine({ start: { x: width / 2 - 180, y: height - 258 }, end: { x: width / 2 + 180, y: height - 258 }, thickness: 1, color: cyan });
  center("has successfully completed the course", height - 290, 14, serif, muted);
  let courseSize = 24;
  while (sansBold.widthOfTextAtSize(winAnsi(cert.course.title), courseSize) > width - 200 && courseSize > 14) courseSize -= 1;
  center(cert.course.title, height - 330, courseSize, sansBold, violet);
  const hrs = Math.max(1, Math.round(cert.course.durationMins / 60));
  center(`${cert.course.level[0] + cert.course.level.slice(1).toLowerCase()} level  -  approx. ${hrs} hour${hrs > 1 ? "s" : ""} of learning`, height - 356, 11, sans, muted);

  const issued = cert.issuedAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  page.drawText("Issued on", { x: 90, y: 118, size: 10, font: sans, color: muted });
  page.drawText(winAnsi(issued), { x: 90, y: 100, size: 13, font: sansBold, color: ink });
  page.drawText("Certificate ID", { x: 90, y: 76, size: 10, font: sans, color: muted });
  page.drawText(cert.code, { x: 90, y: 58, size: 13, font: sansBold, color: ink });

  page.drawLine({ start: { x: width / 2 - 90, y: 100 }, end: { x: width / 2 + 90, y: 100 }, thickness: 0.8, color: ink });
  center("Priya Verma, Founder & Lead Instructor", 84, 11, sans, ink);
  center("CodeVerse Learning Pvt. Ltd.", 70, 9, sans, muted);

  const qr = await QRCode.toBuffer(verifyUrl(cert.code), { type: "png", margin: 1, width: 240, color: { dark: "#0F0F1F", light: "#FFFFFF" } });
  const qrImg = await pdf.embedPng(qr);
  page.drawImage(qrImg, { x: width - 90 - 96, y: 52, width: 96, height: 96 });
  const scan = "Scan to verify";
  page.drawText(scan, { x: width - 90 - 48 - sans.widthOfTextAtSize(scan, 9) / 2, y: 40, size: 9, font: sans, color: muted });

  return pdf.save();
}
