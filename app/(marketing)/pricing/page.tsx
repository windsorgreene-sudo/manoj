import type { Metadata } from "next";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { FaqSection } from "@/components/marketing/sections";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Pricing",
  description: "CodeVerse is free to start. Pro unlocks premium courses, unlimited AI tutor, mock tests and certificates from ₹499/month.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const [plans, user] = await Promise.all([
    db.plan.findMany({ where: { isActive: true }, orderBy: { priceInr: "asc" } }),
    getCurrentUser(),
  ]);
  return (
    <>
      <section className="container-cv py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Pricing</p>
        <h1 className="mx-auto mt-3 max-w-3xl font-heading text-4xl font-bold md:text-6xl">
          Invest in your career for less than a <span className="text-gradient">pizza a month</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">All core learning is free forever. Pro is for when you want to go all in.</p>
      </section>
      <PricingPlans
        plans={plans.map((p) => ({ slug: p.slug, name: p.name, description: p.description, priceInr: p.priceInr, interval: p.interval, features: p.features }))}
        signedIn={Boolean(user)}
        isPro={Boolean(user?.isPro)}
      />
      <FaqSection />
    </>
  );
}
