import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import { db } from "@/lib/db";
import { integrations } from "@/lib/env";

const DAY = 86_400_000;
export const PERIOD_DAYS = { MONTHLY: 30, YEARLY: 365, LIFETIME: 36_500 } as const;

let client: Razorpay | null = null;
export function razorpay() {
  if (!integrations.razorpay()) return null;
  client ??= new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID as string, key_secret: process.env.RAZORPAY_KEY_SECRET as string });
  return client;
}

export type Quote = {
  plan: { id: string; slug: string; name: string; description: string; priceInr: number; interval: "MONTHLY" | "YEARLY" | "LIFETIME"; features: string[] };
  coupon: { id: string; code: string; percentOff: number } | null;
  couponError: string | null;
  discountInr: number;
  gstInr: number;
  totalInr: number;
};

/** Prices are GST-inclusive (18%); the breakdown is shown for transparency. */
export async function quote(planSlug: string, couponCode?: string | null): Promise<Quote | null> {
  const plan = await db.plan.findUnique({ where: { slug: planSlug } });
  if (!plan || !plan.isActive || plan.priceInr <= 0) return null;
  let coupon: Quote["coupon"] = null;
  let couponError: string | null = null;
  const code = couponCode?.trim().toUpperCase();
  if (code) {
    const c = await db.coupon.findUnique({ where: { code } });
    if (!c || !c.isActive) couponError = "This coupon code isn't valid.";
    else if (c.expiresAt && c.expiresAt < new Date()) couponError = "This coupon has expired.";
    else if (c.maxUses !== null && c.usedCount >= c.maxUses) couponError = "This coupon has reached its usage limit.";
    else coupon = { id: c.id, code: c.code, percentOff: Math.min(100, Math.max(0, c.percentOff)) };
  }
  const discountInr = coupon ? Math.round((plan.priceInr * coupon.percentOff) / 100) : 0;
  const totalInr = Math.max(1, plan.priceInr - discountInr);
  const gstInr = Math.round(totalInr - totalInr / 1.18);
  return {
    plan: { id: plan.id, slug: plan.slug, name: plan.name, description: plan.description, priceInr: plan.priceInr, interval: plan.interval, features: plan.features },
    coupon,
    couponError,
    discountInr,
    gstInr,
    totalInr,
  };
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  return safeEqual(createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex"), signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  return safeEqual(createHmac("sha256", secret).update(rawBody).digest("hex"), signature);
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Marks a payment as PAID and activates / extends the user's Pro subscription.
 * Idempotent: the CREATED → PAID transition is claimed atomically, so the checkout
 * callback and the webhook can both call this safely.
 */
export async function markPaymentPaid(paymentId: string, providerPaymentId: string | null) {
  const claim = await db.payment.updateMany({ where: { id: paymentId, status: { in: ["CREATED", "FAILED"] } }, data: { status: "PAID", providerPaymentId } });
  const payment = await db.payment.findUnique({ where: { id: paymentId }, include: { subscription: { include: { plan: true } } } });
  if (!payment) return null;
  if (claim.count === 0) return payment; // already processed
  const plan = payment.subscription?.plan;
  if (!plan || !payment.subscriptionId) return payment;

  // Extend from the later of now / current active period end.
  const active = await db.subscription.findFirst({ where: { userId: payment.userId, status: "ACTIVE", currentPeriodEnd: { gt: new Date() } }, orderBy: { currentPeriodEnd: "desc" } });
  const base = active ? active.currentPeriodEnd.getTime() : Date.now();
  const end = new Date(base + PERIOD_DAYS[plan.interval] * DAY);
  await db.$transaction([
    db.subscription.update({ where: { id: payment.subscriptionId }, data: { status: "ACTIVE", currentPeriodEnd: end, cancelledAt: null } }),
    ...(active && active.id !== payment.subscriptionId ? [db.subscription.update({ where: { id: active.id }, data: { status: "EXPIRED" } })] : []),
    db.user.update({ where: { id: payment.userId }, data: { isPro: true } }),
    ...(payment.couponId ? [db.coupon.update({ where: { id: payment.couponId }, data: { usedCount: { increment: 1 } } })] : []),
    db.notification.create({ data: { userId: payment.userId, type: "SYSTEM", title: "Welcome to CodeVerse Pro 👑", body: `${plan.name} is active until ${end.toLocaleDateString("en-IN", { dateStyle: "medium" })}.`, link: "/dashboard/billing" } }),
  ]);
  return payment;
}

/** Creates a pending subscription + payment. Returns the Razorpay order when configured, otherwise a mock order. */
export async function createOrder(userId: string, q: Quote) {
  const sub = await db.subscription.create({ data: { userId, planId: q.plan.id, status: "PAST_DUE", currentPeriodEnd: new Date() } });
  const rz = razorpay();
  const payment = await db.payment.create({ data: { userId, subscriptionId: sub.id, couponId: q.coupon?.id ?? null, amountInr: q.totalInr, provider: rz ? "razorpay" : "mock" } });
  if (!rz) {
    const orderId = `order_mock_${payment.id}`;
    await db.payment.update({ where: { id: payment.id }, data: { providerOrderId: orderId } });
    return { mode: "mock" as const, paymentId: payment.id, orderId, amountPaise: q.totalInr * 100 };
  }
  const order = await rz.orders.create({ amount: q.totalInr * 100, currency: "INR", receipt: payment.id.slice(0, 40), notes: { paymentId: payment.id, plan: q.plan.slug, userId } });
  await db.payment.update({ where: { id: payment.id }, data: { providerOrderId: order.id } });
  return { mode: "razorpay" as const, paymentId: payment.id, orderId: order.id, amountPaise: Number(order.amount), keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? (process.env.RAZORPAY_KEY_ID as string) };
}

/** Lazily expires subscriptions past their period end and drops Pro for users with no active plan. */
export async function expireSubscriptions(userId?: string) {
  const now = new Date();
  const due = await db.subscription.findMany({ where: { status: { in: ["ACTIVE", "CANCELLED"] }, currentPeriodEnd: { lt: now }, ...(userId ? { userId } : {}) }, select: { id: true, userId: true }, take: 500 });
  if (!due.length) return 0;
  await db.subscription.updateMany({ where: { id: { in: due.map((d) => d.id) } }, data: { status: "EXPIRED" } });
  for (const uid of new Set(due.map((d) => d.userId))) {
    const still = await db.subscription.count({ where: { userId: uid, status: { in: ["ACTIVE", "CANCELLED"] }, currentPeriodEnd: { gt: now } } });
    if (!still) await db.user.update({ where: { id: uid }, data: { isPro: false } });
  }
  return due.length;
}
