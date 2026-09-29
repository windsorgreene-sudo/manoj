"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertUser, AuthError } from "@/lib/session";
import { createOrder, markPaymentPaid, quote, razorpay, verifyCheckoutSignature } from "@/lib/payments";
import { rateLimit } from "@/lib/rate-limit";
import type { Result } from "@/lib/actions/learn";

const id = z.string().min(1).max(60);
const slug = z.string().min(1).max(60).regex(/^[a-z0-9-]+$/);
const coupon = z.string().trim().max(40).optional().nullable();

async function guard<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: e.message, unauth: e.status === 401 };
    if (e instanceof z.ZodError) return { ok: false, error: e.issues[0]?.message ?? "Invalid input" };
    if (e instanceof Error && e.message.startsWith("USER:")) return { ok: false, error: e.message.slice(5) };
    console.error("[payments]", e);
    return { ok: false, error: "Payment service error. You have not been charged — please try again." };
  }
}

export async function previewQuote(input: { plan: string; coupon?: string | null }) {
  return guard(async () => {
    const user = await assertUser();
    const d = z.object({ plan: slug, coupon }).parse(input);
    if (!rateLimit(`quote:${user.id}`, 20, 60_000).success) throw new Error("USER:Too many attempts — wait a minute.");
    const q = await quote(d.plan, d.coupon);
    if (!q) throw new Error("USER:This plan isn't available.");
    return { couponError: q.couponError, coupon: q.coupon ? { code: q.coupon.code, percentOff: q.coupon.percentOff } : null, discountInr: q.discountInr, gstInr: q.gstInr, totalInr: q.totalInr, priceInr: q.plan.priceInr };
  });
}

export async function startCheckout(input: { plan: string; coupon?: string | null }) {
  return guard(async () => {
    const user = await assertUser();
    const d = z.object({ plan: slug, coupon }).parse(input);
    if (!rateLimit(`checkout:${user.id}`, 6, 60_000).success) throw new Error("USER:Too many attempts — wait a minute.");
    const q = await quote(d.plan, d.coupon);
    if (!q) throw new Error("USER:This plan isn't available.");
    if (q.couponError) throw new Error(`USER:${q.couponError}`);
    const order = await createOrder(user.id, q);
    return { ...order, name: user.name, email: user.email, planName: q.plan.name };
  });
}

async function ownPayment(userId: string, paymentId: string) {
  const p = await db.payment.findUnique({ where: { id: paymentId } });
  if (!p || p.userId !== userId) throw new Error("USER:Payment not found.");
  return p;
}

/** Mock checkout (only when Razorpay keys are missing). */
export async function confirmMockPayment(input: { paymentId: string; outcome: "success" | "failure" }) {
  return guard(async () => {
    const user = await assertUser();
    const d = z.object({ paymentId: id, outcome: z.enum(["success", "failure"]) }).parse(input);
    if (razorpay()) throw new Error("USER:Mock payments are disabled when Razorpay is configured.");
    const p = await ownPayment(user.id, d.paymentId);
    if (p.provider !== "mock") throw new Error("USER:Invalid payment.");
    if (d.outcome === "failure") {
      await db.payment.updateMany({ where: { id: p.id, status: "CREATED" }, data: { status: "FAILED" } });
      return { paid: false };
    }
    await markPaymentPaid(p.id, `pay_mock_${p.id.slice(-10)}`);
    revalidatePath("/dashboard/billing");
    return { paid: true };
  });
}

export async function verifyRazorpayPayment(input: { paymentId: string; orderId: string; razorpayPaymentId: string; signature: string }) {
  return guard(async () => {
    const user = await assertUser();
    const d = z.object({ paymentId: id, orderId: z.string().max(80), razorpayPaymentId: z.string().max(80), signature: z.string().max(200) }).parse(input);
    const p = await ownPayment(user.id, d.paymentId);
    if (p.providerOrderId !== d.orderId) throw new Error("USER:Order mismatch.");
    if (!verifyCheckoutSignature(d.orderId, d.razorpayPaymentId, d.signature)) {
      await db.payment.updateMany({ where: { id: p.id, status: "CREATED" }, data: { status: "FAILED" } });
      throw new Error("USER:We couldn't verify this payment. If money was deducted it will be refunded automatically.");
    }
    await markPaymentPaid(p.id, d.razorpayPaymentId);
    revalidatePath("/dashboard/billing");
    return { paid: true };
  });
}

export async function markCheckoutAbandoned(paymentId: string) {
  return guard(async () => {
    const user = await assertUser();
    const p = await ownPayment(user.id, id.parse(paymentId));
    await db.payment.updateMany({ where: { id: p.id, status: "CREATED" }, data: { status: "FAILED" } });
    return null;
  });
}

/** Cancels auto-renewal: Pro stays active until the end of the paid period. */
export async function cancelSubscription() {
  return guard(async () => {
    const user = await assertUser();
    const sub = await db.subscription.findFirst({ where: { userId: user.id, status: "ACTIVE", currentPeriodEnd: { gt: new Date() } }, orderBy: { currentPeriodEnd: "desc" } });
    if (!sub) throw new Error("USER:You don't have an active subscription.");
    await db.subscription.update({ where: { id: sub.id }, data: { status: "CANCELLED", cancelledAt: new Date() } });
    revalidatePath("/dashboard/billing");
    return { until: sub.currentPeriodEnd.toISOString() };
  });
}
