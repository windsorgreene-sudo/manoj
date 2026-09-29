import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Rocket, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { getPlatformStats } from "@/lib/queries/courses";

export const metadata: Metadata = { title: "About", description: "The story, mission and team behind Kodshala.", alternates: { canonical: "/about" } };
export const revalidate = 3600;

const VALUES = [
  { Icon: Target, title: "Learn by doing", body: "Every concept is one click away from running code." },
  { Icon: Heart, title: "Hints, not spoilers", body: "We protect the 'aha' moment, that's where learning happens." },
  { Icon: Users, title: "Built for Bharat", body: "Fast on budget phones, priced for students, available in Hinglish." },
  { Icon: Rocket, title: "Craft matters", body: "A learning tool should feel as good as the products you'll build." },
];

const TEAM = [
  { name: "Priya Verma", role: "Founder & Lead Instructor", bio: "Ex-Google engineer, taught 40k+ students DSA." },
  { name: "Rahul Khanna", role: "Head of Content", bio: "Writes the articles you bookmark at 2 AM." },
  { name: "Neha Kapoor", role: "Engineering Lead", bio: "Built the judge, the IDE and the contest engine." },
  { name: "Aditya Menon", role: "Design Lead", bio: "The reason the 3D planet exists." },
];

export default async function AboutPage() {
  const stats = await getPlatformStats();
  return (
    <div className="container-cv py-16">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-6xl">
          We&apos;re building the <span className="text-gradient">coding universe</span> we wished we had.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Kodshala started in a hostel room in 2024 with one question: why does learning to code require five different websites? Today we host {stats.articles} tutorials,
          {" "}{stats.problems} practice problems and {stats.contests} contests on one fast, beautiful platform.
        </p>
      </section>
      <section className="mt-24">
        <SectionHeading title="What we believe" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="glass p-6">
              <v.Icon className="size-7 text-brand-soft" />
              <h2 className="mt-4 font-semibold">{v.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-24">
        <SectionHeading title="The team" subtitle="Small team, big ambitions." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name} className="glass p-6 text-center">
              <div aria-hidden className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan text-lg font-bold text-white">
                {m.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <h3 className="mt-4 font-semibold">{m.name}</h3>
              <p className="text-xs text-cyan">{m.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-24 text-center">
        <h2 className="font-heading text-3xl font-bold">Want to teach thousands of learners?</h2>
        <p className="mt-2 text-muted-foreground">Your name goes on every tutorial you publish.</p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/write-for-us">Write for us</Link>
        </Button>
      </section>
    </div>
  );
}
