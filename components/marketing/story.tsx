"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { BookOpen, Briefcase, Code2, Trophy } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { HeroScene } from "@/components/three/hero-scene";
import { storyProgress } from "@/lib/stores/story";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  {
    kicker: "Chapter 01",
    title: "Learn",
    Icon: BookOpen,
    color: "text-brand-soft",
    body: "37 in-depth tutorials with language tabs, runnable code and inline quizzes. Highlight anything to save it as a note.",
    href: "/tutorials",
    cta: "Browse tutorials",
  },
  {
    kicker: "Chapter 02",
    title: "Practice",
    Icon: Code2,
    color: "text-cyan",
    body: "A LeetCode-grade workspace: Monaco editor, 6 languages, sample + hidden tests and instant verdicts with runtime and memory.",
    href: "/problems",
    cta: "Open the problem set",
  },
  {
    kicker: "Chapter 03",
    title: "Compete",
    Icon: Trophy,
    color: "text-warning",
    body: "Weekly rated contests with live leaderboards, rating changes and a 3D podium for the top three.",
    href: "/contests",
    cta: "See contests",
  },
  {
    kicker: "Chapter 04",
    title: "Get Hired",
    Icon: Briefcase,
    color: "text-success",
    body: "Company-wise sheets, mock tests, verified certificates and a public profile that shows recruiters your real progress.",
    href: "/sheets",
    cta: "Explore DSA sheets",
  },
];

/** 3D background + hero + pinned 4-chapter camera flight. */
export function StoryExperience({ hero }: { hero: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      storyProgress.current = 0;
      const total = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          storyProgress.current = self.progress;
        },
      });
      // Chapter section is pinned with CSS sticky (robust with Lenis); ScrollTrigger scrubs its progress.
      const chapters = ScrollTrigger.create({
        trigger: ".story-track",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => setActive(Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length))),
      });
      gsap.fromTo(".story-rail", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".story-track", start: "top top", end: "bottom bottom", scrub: true } });
      return () => {
        total.kill();
        chapters.kill();
        storyProgress.current = 0;
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      {/* Sticky 3D canvas behind hero + story; pauses automatically once scrolled past */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-40 lg:opacity-100">
        <div className="sticky top-0 h-dvh">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.18),transparent_60%)]" />
          <HeroScene />
          {/* Keeps the headline readable over the scene */}
          <div className="absolute inset-y-0 left-0 hidden w-[55%] bg-gradient-to-r from-background via-background/85 to-transparent lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>

      {hero}

      <section className="story-track relative z-10 h-[400dvh] motion-reduce:h-auto" aria-label="How CodeVerse works">
       <div className="story-pin sticky top-0 flex min-h-dvh items-center motion-reduce:static motion-reduce:py-16">
        <div className="container-cv grid gap-10 lg:grid-cols-2">
          <div className="relative min-h-[320px]">
            {CHAPTERS.map((c, i) => (
              <article
                key={c.title}
                aria-hidden={active !== i}
                className={cn(
                  "glass absolute inset-0 flex flex-col justify-center p-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-10",
                  active === i ? "translate-y-0 opacity-100 blur-0" : active > i ? "-translate-y-8 opacity-0 blur-sm" : "translate-y-8 opacity-0 blur-sm",
                  "motion-reduce:relative motion-reduce:mb-4 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0",
                )}
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.kicker}</p>
                <h2 className={cn("mt-3 flex items-center gap-3 font-heading text-4xl font-bold md:text-5xl", c.color)}>
                  <c.Icon className="size-9" /> {c.title}
                </h2>
                <p className="mt-4 max-w-md text-lg text-muted-foreground">{c.body}</p>
                <Link href={c.href} tabIndex={active === i ? 0 : -1} className="mt-6 inline-flex w-fit items-center gap-1 py-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline">
                  {c.cta} →
                </Link>
              </article>
            ))}
          </div>
          <ol className="hidden flex-col justify-center gap-3 lg:flex" aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <li key={c.title} className="flex items-center gap-4">
                <span className={cn("h-px transition-all duration-500", active === i ? "w-16 bg-cyan" : "w-8 bg-border")} />
                <span className={cn("font-heading text-2xl transition-colors", active === i ? "text-foreground" : "text-muted-foreground/60")}>{c.title}</span>
              </li>
            ))}
          </ol>
        </div>
        <span aria-hidden className="story-rail absolute right-6 top-1/4 hidden h-1/2 w-px origin-top bg-gradient-to-b from-brand to-cyan lg:block" />
       </div>
      </section>
    </div>
  );
}
