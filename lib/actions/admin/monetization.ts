"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminAction, audit } from "@/lib/admin";
import { expireSubscriptions } from "@/lib/payments";

const id = z.string().min(1).max(64);

const planSchema = z.object({
  id,
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().min(2).max(200),
  priceInr: z.number().int().min(0).max(1_000_000),
  features: z.array(z.string().trim().min(1).max(120)).max(15),
  isActive: z.boolean(),
});

export async function savePlan(input: z.input<typeof planSchema>) {
  return adminAction(async (actor) => {
    const d = planSchema.parse(input);
    const p = await db.plan.update({ where: { id: d.id }, data: { name: d.name, description: d.description, priceInr: d.priceInr, features: d.features, isActive: d.isActive } });
    await audit(actor, "plan.update", "Plan", p.slug, { priceInr: d.priceInr, isActive: d.isActive });
    revalidatePath("/pricing");
    revalidatePath("/admin/monetization");
    return null;
  });
}

const couponSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{3,20}$/, "3–20 letters/digits"),
  percentOff: z.number().int().min(1).max(100),
  maxUses: z.number().int().min(1).max(1_000_000).nullable(),
  expiresAt: z.string().datetime({ offset: true }).nullable(),
});

export async function createCoupon(input: z.input<typeof couponSchema>) {
  return adminAction(async (actor) => {
    const d = couponSchema.parse(input);
    if (await db.coupon.findUnique({ where: { code: d.code } })) throw new Error("USER:A coupon with this code already exists.");
    await db.coupon.create({ data: { code: d.code, percentOff: d.percentOff, maxUses: d.maxUses, expiresAt: d.expiresAt ? new Date(d.expiresAt) : null } });
    await audit(actor, "coupon.create", "Coupon", d.code, { percentOff: d.percentOff });
    revalidatePath("/admin/monetization");
    return null;
  });
}

export async function setCouponActive(input: { id: string; isActive: boolean }) {
  return adminAction(async (actor) => {
    const d = z.object({ id, isActive: z.boolean() }).parse(input);
    const c = await db.coupon.update({ where: { id: d.id }, data: { isActive: d.isActive } });
    await audit(actor, d.isActive ? "coupon.enable" : "coupon.disable", "Coupon", c.code);
    revalidatePath("/admin/monetization");
    return null;
  });
}

/** Records a refund (issue the actual refund from the Razorpay dashboard) and ends the subscription. */
export async function markRefunded(paymentId: string) {
  return adminAction(async (actor) => {
    const p = await db.payment.findUnique({ where: { id: id.parse(paymentId) } });
    if (!p || p.status !== "PAID") throw new Error("USER:Only paid payments can be refunded.");
    await db.payment.update({ where: { id: p.id }, data: { status: "REFUNDED" } });
    if (p.subscriptionId) await db.subscription.update({ where: { id: p.subscriptionId }, data: { status: "CANCELLED", cancelledAt: new Date(), currentPeriodEnd: new Date(Date.now() - 1000) } });
    await expireSubscriptions(p.userId);
    await audit(actor, "payment.refund", "Payment", p.id, { amountInr: p.amountInr });
    revalidatePath("/admin/monetization");
    return null;
  });
}
