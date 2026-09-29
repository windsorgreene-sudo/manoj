import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { markPaymentPaid, verifyWebhookSignature } from "@/lib/payments";

export const dynamic = "force-dynamic";

type RazorpayEvent = {
  event: string;
  payload?: { payment?: { entity?: { id?: string; order_id?: string } }; order?: { entity?: { id?: string } } };
};

/**
 * Razorpay webhook (configure in Dashboard → Settings → Webhooks with events payment.captured, order.paid, payment.failed).
 * The signature is an HMAC-SHA256 of the raw body using RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, sig)) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  let evt: RazorpayEvent;
  try {
    evt = JSON.parse(raw) as RazorpayEvent;
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }
  const orderId = evt.payload?.payment?.entity?.order_id ?? evt.payload?.order?.entity?.id;
  const providerPaymentId = evt.payload?.payment?.entity?.id ?? null;
  if (!orderId) return NextResponse.json({ ok: true, ignored: true });
  const payment = await db.payment.findUnique({ where: { providerOrderId: orderId }, select: { id: true } });
  if (!payment) return NextResponse.json({ ok: true, unknownOrder: true });

  if (evt.event === "payment.captured" || evt.event === "order.paid") await markPaymentPaid(payment.id, providerPaymentId);
  else if (evt.event === "payment.failed") await db.payment.updateMany({ where: { id: payment.id, status: "CREATED" }, data: { status: "FAILED", providerPaymentId } });
  else if (evt.event === "refund.processed") await db.payment.update({ where: { id: payment.id }, data: { status: "REFUNDED" } });
  return NextResponse.json({ ok: true });
}
