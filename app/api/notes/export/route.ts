import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { winAnsi, wrap } from "@/lib/pdf-text";

/** Exports all of the user's notes & highlights as a PDF. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notes = await db.note.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, include: { article: { select: { title: true } } } });

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  let page = pdf.addPage([595, 842]);
  let y = 790;
  const newPageIfNeeded = (h: number) => {
    if (y - h < 50) {
      page = pdf.addPage([595, 842]);
      y = 790;
    }
  };
  const write = (text: string, f = font, size = 11, color = rgb(0.1, 0.1, 0.15), indent = 50) => {
    for (const line of wrap(winAnsi(text), Math.floor((495 - (indent - 50)) / (size * 0.5)))) {
      newPageIfNeeded(size + 6);
      page.drawText(line, { x: indent, y, size, font: f, color });
      y -= size + 5;
    }
  };

  write("Kodshala - Notes & Highlights", bold, 20, rgb(0.49, 0.23, 0.93));
  write(`${user.name} - exported ${new Date().toLocaleDateString("en-IN")} - ${notes.length} notes`, font, 10, rgb(0.4, 0.4, 0.5));
  y -= 10;
  for (const n of notes) {
    newPageIfNeeded(60);
    write(n.article?.title ?? "Personal note", bold, 12);
    if (n.highlight) write(`"${n.highlight}"`, italic, 10, rgb(0.35, 0.35, 0.45), 62);
    write(n.body.replace(/\*\*|`/g, ""), font, 11);
    y -= 12;
  }
  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="kodshala-notes.pdf"', "Cache-Control": "no-store" },
  });
}
