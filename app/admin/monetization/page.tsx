import { CreditCard, IndianRupee, TrendingUp, Users } from "lucide-react";
import type { Prisma } from "@/lib/generated/prisma/client";
import { ActionButton } from "@/components/admin/action-button";
import { CouponForm, PlanEditor } from "@/components/admin/monetization-forms";
import { PageHeader, Pagination, SearchForm, StatusBadge, Table, selectCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { markRefunded, setCouponActive } from "@/lib/actions/admin/monetization";
import { db } from "@/lib/db";
import { integrations } from "@/lib/env";
import { expireSubscriptions } from "@/lib/payments";
import { formatDate, formatInr, nowMs } from "@/lib/utils";

export const metadata = { title: "Monetization" };

type SP = Promise<{ q?: string; status?: string; page?: string }>;
const PAGE = 25;
const STATUSES = ["CREATED", "PAID", "FAILED", "REFUNDED"] as const;

export default async function MonetizationPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  await expireSubscriptions();
  const status = STATUSES.find((s) => s === sp.status);
  const q = sp.q?.trim().slice(0, 100);
  const page = Math.max(1, Number(sp.page) || 1);
  const where: Prisma.PaymentWhereInput = {
    ...(status ? { status } : {}),
    ...(q ? { OR: [{ user: { email: { contains: q, mode: "insensitive" } } }, { user: { name: { contains: q, mode: "insensitive" } } }, { providerOrderId: { contains: q } }, { providerPaymentId: { contains: q } }] } : {}),
  };
  const since30 = new Date(nowMs() - 30 * 86_400_000);
  const [plans, coupons, activeSubs, rev30, revAll, payTotal, payments] = await Promise.all([
    db.plan.findMany({ orderBy: { priceInr: "asc" }, include: { _count: { select: { subscriptions: { where: { status: "ACTIVE" } } } } } }),
    db.coupon.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { payments: { where: { status: "PAID" } } } } } }),
    db.subscription.findMany({ where: { status: "ACTIVE", currentPeriodEnd: { gt: new Date() } }, select: { plan: { select: { priceInr: true, interval: true } } } }),
    db.payment.aggregate({ where: { status: "PAID", createdAt: { gte: since30 } }, _sum: { amountInr: true }, _count: { _all: true } }),
    db.payment.aggregate({ where: { status: "PAID" }, _sum: { amountInr: true } }),
    db.payment.count({ where }),
    db.payment.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE, include: { user: { select: { name: true, email: true } }, subscription: { select: { plan: { select: { name: true } } } }, coupon: { select: { code: true } } } }),
  ]);
  const mrr = Math.round(activeSubs.reduce((s, x) => s + (x.plan.interval === "YEARLY" ? x.plan.priceInr / 12 : x.plan.interval === "MONTHLY" ? x.plan.priceInr : 0), 0));
  const params = { q, status, page: String(page) };
  const kpis = [
    { label: "MRR", value: formatInr(mrr), Icon: TrendingUp },
    { label: "Active subscriptions", value: String(activeSubs.length), Icon: Users },
    { label: "Revenue (30d)", value: formatInr(rev30._sum.amountInr ?? 0), Icon: IndianRupee },
    { label: "Lifetime revenue", value: formatInr(revAll._sum.amountInr ?? 0), Icon: CreditCard },
  ];

  return (
    <>
      <PageHeader title="Monetization" description={integrations.razorpay() ? "Razorpay is connected." : "Razorpay keys missing — checkout runs in mock mode."} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="glass p-5">
            <k.Icon className="size-5 text-cyan" aria-hidden />
            <p className="mt-3 text-xs text-muted-foreground">{k.label}</p>
            <p className="font-heading text-2xl font-bold tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>

      <section aria-labelledby="plans-h" className="mt-10">
        <h2 id="plans-h" className="mb-3 font-semibold">Plans</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} className="space-y-1">
              <PlanEditor plan={{ id: p.id, slug: p.slug, name: p.name, description: p.description, priceInr: p.priceInr, interval: p.interval, features: p.features, isActive: p.isActive }} />
              <p className="px-1 text-xs text-muted-foreground">{p._count.subscriptions} active subscriber(s)</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="coupons-h" className="mt-10 space-y-3">
        <h2 id="coupons-h" className="font-semibold">Coupons</h2>
        <CouponForm />
        <Table caption="Coupons">
          <thead><tr><th scope="col" className={`${thCls} px-4 py-3`}>Code</th><th scope="col" className={`${thCls} px-4 py-3`}>Discount</th><th scope="col" className={`${thCls} px-4 py-3`}>Used</th><th scope="col" className={`${thCls} px-4 py-3`}>Expires</th><th scope="col" className={`${thCls} px-4 py-3`}>Status</th><th scope="col" className={`${thCls} px-4 py-3`}><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className={trCls}>
                <td className={`${tdCls} font-mono`}>{c.code}</td>
                <td className={tdCls}>{c.percentOff}%</td>
                <td className={`${tdCls} tabular-nums`}>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                <td className={tdCls}>{c.expiresAt ? formatDate(c.expiresAt) : "Never"}</td>
                <td className={tdCls}><StatusBadge status={!c.isActive ? "ARCHIVED" : c.expiresAt && c.expiresAt.getTime() < nowMs() ? "EXPIRED" : "ACTIVE"} /></td>
                <td className={`${tdCls} text-right`}>
                  <ActionButton size="xs" variant="ghost" action={setCouponActive.bind(null, { id: c.id, isActive: !c.isActive })} success={c.isActive ? "Coupon disabled" : "Coupon enabled"}>{c.isActive ? "Disable" : "Enable"}</ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section aria-labelledby="pay-h" className="mt-10 space-y-3">
        <h2 id="pay-h" className="font-semibold">Payments <span className="text-sm font-normal text-muted-foreground">({payTotal})</span></h2>
        <SearchForm
          base="/admin/monetization"
          params={params}
          placeholder="Search email, name, order or payment id…"
          extra={
            <select name="status" defaultValue={status ?? ""} className={selectCls} aria-label="Status">
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          }
        />
        <Table caption="Payments">
          <thead><tr><th scope="col" className={`${thCls} px-4 py-3`}>Date</th><th scope="col" className={`${thCls} px-4 py-3`}>User</th><th scope="col" className={`${thCls} px-4 py-3`}>Plan</th><th scope="col" className={`${thCls} px-4 py-3 text-right`}>Amount</th><th scope="col" className={`${thCls} px-4 py-3`}>Status</th><th scope="col" className={`${thCls} px-4 py-3`}>Provider</th><th scope="col" className={`${thCls} px-4 py-3`}><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className={trCls}>
                <td className={`${tdCls} whitespace-nowrap text-muted-foreground`}>{formatDate(p.createdAt, { dateStyle: "medium", timeStyle: "short" })}</td>
                <td className={tdCls}><p className="font-medium">{p.user.name}</p><p className="text-xs text-muted-foreground">{p.user.email}</p></td>
                <td className={tdCls}>{p.subscription?.plan.name ?? "—"}{p.coupon ? <span className="ml-1 font-mono text-xs text-success">{p.coupon.code}</span> : null}</td>
                <td className={`${tdCls} text-right tabular-nums`}>{formatInr(p.amountInr)}</td>
                <td className={tdCls}><StatusBadge status={p.status} /></td>
                <td className={`${tdCls} text-xs`}><p>{p.provider}</p><p className="font-mono text-muted-foreground">{p.providerPaymentId ?? p.providerOrderId ?? ""}</p></td>
                <td className={`${tdCls} text-right`}>{p.status === "PAID" ? <ActionButton size="xs" variant="ghost" className="text-danger" action={markRefunded.bind(null, p.id)} confirm="Mark as refunded and end this subscription? (Issue the refund in Razorpay separately.)" success="Marked refunded">Refund</ActionButton> : null}</td>
              </tr>
            ))}
            {!payments.length ? <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">No payments match.</td></tr> : null}
          </tbody>
        </Table>
        <Pagination page={page} pages={Math.max(1, Math.ceil(payTotal / PAGE))} base="/admin/monetization" params={params} />
      </section>
    </>
  );
}
