import type { Metadata } from "next";
import Link from "next/link";
import { Award, Globe2, PenLine, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContributorForm } from "@/components/marketing/contributor-form";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Write for Us", description: "Become a Kodshala contributor, teach thousands of learners for free.", alternates: { canonical: "/write-for-us" } };

const PERKS = [
  { Icon: Award, title: "Earn recognition", body: "Contributor badge, XP and a public author page for every published article." },
  { Icon: Users, title: "Reach learners", body: "Your tutorials reach students across India and beyond." },
  { Icon: Globe2, title: "Build your brand", body: "Author page, byline and a contributor badge on your profile." },
  { Icon: PenLine, title: "Editorial support", body: "Our editors review and polish every draft with you." },
];

export default async function WriteForUsPage() {
  const user = await getCurrentUser();
  const existing = user ? await db.contributorApplication.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }) : null;
  return (
    <div className="container-cv grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Teach what you know. <span className="text-gradient">Help others grow.</span></h1>
        <p className="mt-4 text-muted-foreground">We&apos;re looking for engineers and students who can explain DSA, languages and CS fundamentals clearly, with runnable examples.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PERKS.map((p) => (
            <div key={p.title} className="glass p-5">
              <p.Icon className="size-6 text-brand-soft" />
              <h2 className="mt-3 font-semibold">{p.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        {!user ? (
          <div className="glass p-8 text-center">
            <h2 className="text-xl font-semibold">Log in to apply</h2>
            <p className="mt-2 text-sm text-muted-foreground">Applications are linked to your Kodshala account so approved contributors can start writing right away.</p>
            <Button asChild className="mt-6 rounded-xl"><Link href="/login?next=/write-for-us">Log in or sign up</Link></Button>
          </div>
        ) : user.role !== "STUDENT" ? (
          <div className="glass p-8 text-center">
            <h2 className="text-xl font-semibold">You&apos;re already a contributor</h2>
            <Button asChild className="mt-6 rounded-xl"><Link href="/dashboard/articles">Go to my articles</Link></Button>
          </div>
        ) : existing?.status === "PENDING" ? (
          <div className="glass p-8 text-center">
            <h2 className="text-xl font-semibold">Application under review</h2>
            <p className="mt-2 text-sm text-muted-foreground">We usually respond within 5 working days. You&apos;ll get a notification and an email.</p>
          </div>
        ) : (
          <ContributorForm />
        )}
      </div>
    </div>
  );
}
