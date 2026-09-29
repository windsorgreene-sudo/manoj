import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Crown } from "lucide-react";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { integrations } from "@/lib/env";
import { expireSubscriptions, quote } from "@/lib/payments";
import { CheckoutForm } from "@/components/payments/checkout-form";
import { Button } from "@/components/ui/button";
import { formatDate, formatInr } from "@/lib/utils";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

type Props = { params: Promise<{ plan: string }>; searchParams: Promise<{ coupon?: string }> };

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { plan: slug } = await params;
  const { coupon } = await searchParams;
  const user = await requireUser("STUDENT", `/checkout/${slug}`);
  const q = await quote(slug.slice(0, 60), coupon?.slice(0, 40));
  if (!q) notFound();
  await expireSubscriptions(user.id);
  const active = await db.subscription.findFirst({ where: { userId: user.id, status: { in: ["ACTIVE", "CANCELLED"] }, currentPeriodEnd: { gt: new Date() } }, orderBy: { currentPeriodEnd: "desc" }, include: { plan: { select: { name: true } } } });
  const alt = await db.plan.findFirst({ where: { isActive: true, priceInr: { gt: 0 }, slug: { not: q.plan.slug } }, select: { slug: true, name: true, priceInr: true, interval: true } });

  return (
    <div className="container-cv py-10 md:py-14">
      <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Pricing</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_420px]">
        <section aria-labelledby="plan-h">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand"><Crown className="size-3.5" /> CodeVerse Pro</p>
          <h1 id="plan-h" className="mt-4 font-heading text-3xl font-bold md:text-4xl">{q.plan.name}</h1>
          <p className="mt-2 text-muted-foreground">{q.plan.description}</p>
          <p className="mt-4 font-heading text-4xl font-bold">{formatInr(q.plan.priceInr)}<span className="text-base font-normal text-muted-foreground"> / {q.plan.interval === "YEARLY" ? "year" : "month"}</span></p>
          <ul className="mt-8 space-y-3">
            {q.plan.features.map((f) => (
              <li key={f} className="flex items-start gap-3"><Check className="mt-0.5 size-5 shrink-0 text-success" /> {f}</li>
            ))}
          </ul>
          {alt ? (
            <p className="mt-8 text-sm text-muted-foreground">
              Prefer {alt.interval === "YEARLY" ? "yearly" : "monthly"} billing?{" "}
              <Link href={`/checkout/${alt.slug}`} className="text-cyan underline">Switch to {alt.name} ({formatInr(alt.priceInr)})</Link>
            </p>
          ) : null}
          {active ? (
            <p className="glass mt-6 p-4 text-sm">You already have <b>{active.plan.name}</b> until {formatDate(active.currentPeriodEnd)}. Paying now extends your Pro access from that date.</p>
          ) : null}
        </section>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <CheckoutForm
            plan={{ slug: q.plan.slug, name: q.plan.name }}
            mockMode={!integrations.razorpay()}
            initial={{ priceInr: q.plan.priceInr, discountInr: q.discountInr, gstInr: q.gstInr, totalInr: q.totalInr, coupon: q.coupon ? { code: q.coupon.code, percentOff: q.coupon.percentOff } : null }}
          />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By paying you agree to our <Link href="/terms" className="underline">Terms</Link>. Cancel anytime from <Link href="/dashboard/billing" className="underline">Billing</Link>.
          </p>
          <Button asChild variant="ghost" className="mt-2 w-full rounded-xl"><Link href="/pricing">Compare plans</Link></Button>
        </div>
      </div>
    </div>
  );
}
