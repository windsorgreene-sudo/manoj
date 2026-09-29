import { NextResponse, type NextRequest } from "next/server";
import { getCertificate, renderCertificatePdf } from "@/lib/certificates";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** Certificate PDF. Certificates are public by design (anyone with the ID can verify / download). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  if (!rateLimit(`cert:${clientIp(req.headers)}`, 20, 60_000).success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const { code } = await params;
  const cert = await getCertificate(code.toUpperCase());
  if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  const bytes = await renderCertificatePdf(cert);
  const inline = req.nextUrl.searchParams.get("inline") === "1";
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="kodshala-${cert.code}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
