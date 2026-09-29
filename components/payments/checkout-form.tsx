"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, Loader2, Lock, ShieldCheck, Tag, TestTube2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { confirmMockPayment, markCheckoutAbandoned, previewQuote, startCheckout, verifyRazorpayPayment } from "@/lib/actions/payments";
import { formatInr } from "@/lib/utils";

type Pricing = { priceInr: number; discountInr: number; gstInr: number; totalInr: number; coupon: { code: string; percentOff: number } | null };

type RazorpayResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (r: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
};
type RazorpayCtor = new (o: RazorpayOptions) => { open: () => void; on: (evt: string, cb: () => void) => void };

function loadRazorpay(): Promise<RazorpayCtor | null> {
  const w = window as Window & { Razorpay?: RazorpayCtor };
  if (w.Razorpay) return Promise.resolve(w.Razorpay);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(w.Razorpay ?? null);
    s.onerror = () => resolve(null);
    document.body.appendChild(s);
  });
}

export function CheckoutForm({ plan, initial, mockMode }: { plan: { slug: string; name: string }; initial: Pricing; mockMode: boolean }) {
  const router = useRouter();
  const [pricing, setPricing] = useState<Pricing>(initial);
  const [code, setCode] = useState(initial.coupon?.code ?? "");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [paying, setPaying] = useState(false);
  const [mock, setMock] = useState<{ paymentId: string; amountPaise: number } | null>(null);

  const success = async () => {
    // Refresh the cached session cookie so `isPro` flips immediately.
    await authClient.getSession({ query: { disableCookieCache: true } }).catch(() => undefined);
    toast.success("Payment successful — welcome to Pro! 👑");
    router.push("/dashboard/billing?welcome=1");
    router.refresh();
  };

  const apply = async (value: string | null) => {
    setApplying(true);
    const r = await previewQuote({ plan: plan.slug, coupon: value });
    setApplying(false);
    if (!r.ok) return void toast.error(r.error);
    setCouponMsg(r.data.couponError);
    setPricing({ priceInr: r.data.priceInr, discountInr: r.data.discountInr, gstInr: r.data.gstInr, totalInr: r.data.totalInr, coupon: r.data.coupon });
    if (!value) setCode("");
  };

  const pay = async () => {
    setPaying(true);
    const r = await startCheckout({ plan: plan.slug, coupon: pricing.coupon?.code ?? null });
    if (!r.ok) {
      setPaying(false);
      if (r.unauth) return void router.push(`/login?next=/checkout/${plan.slug}`);
      return void toast.error(r.error);
    }
    const o = r.data;
    if (o.mode === "mock") {
      setMock({ paymentId: o.paymentId, amountPaise: o.amountPaise });
      setPaying(false);
      return;
    }
    const Rzp = await loadRazorpay();
    if (!Rzp) {
      setPaying(false);
      return void toast.error("Couldn't load Razorpay. Check your connection or disable ad-blockers.");
    }
    const rzp = new Rzp({
      key: o.keyId,
      amount: o.amountPaise,
      currency: "INR",
      name: "CodeVerse",
      description: o.planName,
      order_id: o.orderId,
      prefill: { name: o.name, email: o.email },
      theme: { color: "#7C3AED" },
      handler: async (resp) => {
        const v = await verifyRazorpayPayment({ paymentId: o.paymentId, orderId: resp.razorpay_order_id, razorpayPaymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature });
        setPaying(false);
        if (!v.ok) return void toast.error(v.error);
        await success();
      },
      modal: {
        ondismiss: () => {
          setPaying(false);
          void markCheckoutAbandoned(o.paymentId);
        },
      },
    });
    rzp.on("payment.failed", () => toast.error("Payment failed — you can try again with another method."));
    rzp.open();
  };

  const finishMock = async (outcome: "success" | "failure") => {
    if (!mock) return;
    setPaying(true);
    const r = await confirmMockPayment({ paymentId: mock.paymentId, outcome });
    setPaying(false);
    setMock(null);
    if (!r.ok) return void toast.error(r.error);
    if (!r.data.paid) return void toast.error("Payment failed (simulated). You have not been charged.");
    await success();
  };

  return (
    <div className="glass space-y-6 p-6 md:p-8">
      <h2 className="font-heading text-xl font-semibold">Order summary</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt>{plan.name}</dt><dd className="tabular-nums">{formatInr(pricing.priceInr)}</dd></div>
        {pricing.coupon ? (
          <div className="flex justify-between text-success"><dt>Coupon {pricing.coupon.code} (−{pricing.coupon.percentOff}%)</dt><dd className="tabular-nums">−{formatInr(pricing.discountInr)}</dd></div>
        ) : null}
        <div className="flex justify-between text-muted-foreground"><dt>Includes GST (18%)</dt><dd className="tabular-nums">{formatInr(pricing.gstInr)}</dd></div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatInr(pricing.totalInr)}</dd></div>
      </dl>

      <form
        className="space-y-1.5"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) void apply(code.trim());
        }}
      >
        <Label htmlFor="coupon">Coupon code</Label>
        {pricing.coupon ? (
          <div className="flex items-center justify-between rounded-xl border border-success/50 bg-success/10 px-3 py-2 text-sm">
            <span className="flex items-center gap-2 font-mono text-success"><Tag className="size-4" /> {pricing.coupon.code}</span>
            <button type="button" aria-label="Remove coupon" onClick={() => void apply(null)} className="rounded p-1 hover:bg-accent"><X className="size-4" /></button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="LAUNCH50" className="font-mono uppercase" autoComplete="off" aria-invalid={Boolean(couponMsg)} aria-describedby={couponMsg ? "coupon-err" : undefined} />
            <Button type="submit" variant="outline" className="rounded-xl" disabled={applying || !code.trim()}>{applying ? <Loader2 className="animate-spin" /> : null} Apply</Button>
          </div>
        )}
        {couponMsg ? <p id="coupon-err" role="alert" className="text-sm text-danger">{couponMsg}</p> : null}
      </form>

      <Button size="lg" className="w-full rounded-xl" onClick={() => void pay()} disabled={paying}>
        {paying ? <Loader2 className="animate-spin" /> : <Lock />} Pay {formatInr(pricing.totalInr)}
      </Button>
      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-success" /> {mockMode ? "Test mode — no real money is charged." : "Secured by Razorpay · UPI, cards, netbanking & wallets"}
      </p>

      <Dialog open={Boolean(mock)} onOpenChange={(o) => (!o && mock ? void finishMock("failure") : undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><TestTube2 className="size-5 text-warning" /> Mock checkout</DialogTitle>
            <DialogDescription>Razorpay keys aren&apos;t configured, so this is a simulated payment of {formatInr((mock?.amountPaise ?? 0) / 100)}. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to take real payments.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><CreditCard className="size-4" /> Test card 4111 1111 1111 1111 · any CVV · any future date</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" disabled={paying} onClick={() => void finishMock("failure")}>Simulate failure</Button>
            <Button className="rounded-xl" disabled={paying} onClick={() => void finishMock("success")}>{paying ? <Loader2 className="animate-spin" /> : null} Simulate success</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
