"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatInr } from "@/lib/utils";

export type PlanView = { slug: string; name: string; description: string; priceInr: number; interval: "MONTHLY" | "YEARLY" | "LIFETIME"; features: string[] };

export function PricingPlans({ plans, signedIn, isPro }: { plans: PlanView[]; signedIn: boolean; isPro: boolean }) {
  const [yearly, setYearly] = useState(false);
  const free = plans.find((p) => p.interval === "LIFETIME");
  const pro = plans.find((p) => p.interval === (yearly ? "YEARLY" : "MONTHLY"));

  return (
    <section id="plans" className="container-cv pb-16">
      <div className="mb-10 flex justify-center">
        <div className="glass inline-flex rounded-2xl p-1" role="radiogroup" aria-label="Billing period">
          {[
            { v: false, label: "Monthly" },
            { v: true, label: "Yearly · save 17%" },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              role="radio"
              aria-checked={yearly === o.v}
              onClick={() => setYearly(o.v)}
              className={cn("rounded-xl px-4 py-2 text-sm font-medium transition-colors", yearly === o.v ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground")}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {free ? (
          <div className="glass flex flex-col p-8">
            <h2 className="text-xl font-semibold">{free.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{free.description}</p>
            <p className="mt-6 font-heading text-5xl font-bold">₹0</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {free.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="size-4 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-8 h-11 rounded-xl">
              <Link href={signedIn ? "/dashboard" : "/signup"}>{signedIn ? "Go to dashboard" : "Start free"}</Link>
            </Button>
          </div>
        ) : null}
        {pro ? (
          <div className="glass gradient-border relative flex flex-col p-8 shadow-[0_0_60px_-20px_rgba(124,58,237,0.8)]">
            <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-brand to-cyan px-3 py-1 text-xs font-semibold text-white">Most popular</span>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Crown className="size-5 text-warning" /> {pro.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{pro.description}</p>
            <p className="mt-6 font-heading text-5xl font-bold">
              {formatInr(pro.priceInr)}
              <span className="text-base font-normal text-muted-foreground">/{yearly ? "year" : "month"}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {pro.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="size-4 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
            {isPro ? (
              <Button disabled className="mt-8 h-11 rounded-xl">
                You&apos;re on Pro 🎉
              </Button>
            ) : (
              <Button asChild className="mt-8 h-11 rounded-xl bg-brand hover:bg-brand/90">
                <Link href={signedIn ? `/checkout/${pro.slug}` : `/signup?next=${encodeURIComponent(`/checkout/${pro.slug}`)}`}>Upgrade to Pro</Link>
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
