import Link from "next/link";
import { Crown, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CancelSubscriptionButton } from "@/components/payments/cancel-subscription";
import { StatusBadge } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { expireSubscriptions } from "@/lib/payments";
import { requireUser } from "@/lib/session";
import { formatDate, formatInr } from "@/lib/utils";

export const metadata = { title: "Billing" };

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const user = await requireUser("STUDENT", "/dashboard/billing");
  const { welcome } = await searchParams;
  await expireSubscriptions(user.id);
  const [sub, payments] = await Promise.all([
    db.subscription.findFirst({ where: { userId: user.id, status: { in: ["ACTIVE", "CANCELLED"] }, currentPeriodEnd: { gt: new Date() } }, orderBy: { currentPeriodEnd: "desc" }, include: { plan: true } }),
    db.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 30, include: { subscription: { select: { plan: { select: { name: true } } } }, coupon: { select: { code: true } } } }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-bold">Billing</h1>
      {welcome ? <p role="status" className="rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">🎉 Payment received — Pro is active. Enjoy every premium course, mock test and unlimited AI tutor.</p> : null}

      <section className="glass gradient-border p-6" aria-labelledby="plan-h">
        {sub ? (
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand"><Crown className="size-4" /> Current plan</p>
              <h2 id="plan-h" className="mt-1 font-heading text-2xl font-bold">{sub.plan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {sub.status === "CANCELLED" ? `Cancelled — Pro access ends on ${formatDate(sub.currentPeriodEnd)}.` : `Renews on ${formatDate(sub.currentPeriodEnd)} · ${formatInr(sub.plan.priceInr)} / ${sub.plan.interval === "YEARLY" ? "year" : "month"}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {sub.status === "CANCELLED" ? <Button asChild className="rounded-xl"><Link href={`/checkout/${sub.plan.slug}`}>Renew</Link></Button> : <CancelSubscriptionButton until={sub.currentPeriodEnd.toISOString()} />}
              {sub.plan.interval === "MONTHLY" ? <Button asChild variant="outline" className="rounded-xl"><Link href="/checkout/pro-yearly">Switch to yearly (save 17%)</Link></Button> : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 id="plan-h" className="font-heading text-2xl font-bold">Free plan</h2>
              <p className="mt-1 text-sm text-muted-foreground">Upgrade for premium courses, mock tests with analysis, unlimited AI tutor and verified certificates.</p>
            </div>
            <Button asChild size="lg" className="rounded-xl"><Link href="/pricing"><Crown /> See Pro plans</Link></Button>
          </div>
        )}
      </section>

      <section aria-labelledby="pay-h">
        <h2 id="pay-h" className="mb-3 flex items-center gap-2 font-semibold"><Receipt className="size-5" /> Payment history</h2>
        {payments.length ? (
          <div className="glass relative overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="sr-only">Payment history</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Plan</th>
                  <th scope="col" className="px-4 py-3 text-right">Amount</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3">{p.subscription?.plan.name ?? "—"}{p.coupon ? <span className="ml-2 font-mono text-xs text-success">{p.coupon.code}</span> : null}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatInr(p.amountInr)}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.providerPaymentId ?? p.providerOrderId ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No payments yet" description="Your invoices and receipts will appear here." />
        )}
      </section>
    </div>
  );
}
