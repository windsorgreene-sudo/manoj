"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { TypewriterCode } from "@/components/marketing/typewriter-code";
import { gsap, SplitText, useGSAP } from "@/components/motion/gsap";

export function Hero({ learners }: { learners: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hero-headline", { type: "words", wordsClass: "inline-block will-change-transform" });
        gsap.set(".hero-headline", { opacity: 1 });
        gsap.from(split.words, { yPercent: 110, opacity: 0, rotateX: -60, filter: "blur(8px)", stagger: 0.07, duration: 0.9, ease: "expo.out", delay: 0.15 });
        gsap.from(".hero-fade", { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.7, ease: "power3.out" });
        return () => split.revert();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-headline", { opacity: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative z-10 flex min-h-dvh items-center pt-8 pb-24">
      <div className="container-cv grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="hero-fade glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
            <Sparkles className="size-3.5 text-cyan" /> Now with an AI tutor that hints — never spoils
          </p>
          <h1 className="hero-headline font-heading text-[2.6rem] leading-[1.05] font-bold opacity-0 sm:text-6xl lg:text-7xl [perspective:600px]">
            Learn it. Code it. <span className="text-gradient">Compete</span> and get hired.
          </h1>
          <p className="hero-fade mt-6 max-w-xl text-lg text-muted-foreground">
            CodeVerse brings tutorials, a 6-language browser IDE, 30+ curated problems, weekly contests and progress tracking into one beautifully fast platform.
          </p>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button asChild size="lg" className="h-12 rounded-2xl bg-brand px-6 text-base shadow-[0_0_40px_-8px_rgba(124,58,237,0.9)] hover:bg-brand/90">
                <Link href="/signup">
                  Start learning free <ArrowRight />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="outline" className="glass h-12 rounded-2xl px-6 text-base">
                <Link href="/problems">
                  <PlayCircle /> Solve a problem
                </Link>
              </Button>
            </Magnetic>
          </div>
          <p className="hero-fade mt-6 text-sm text-muted-foreground">Join {learners} learners · No credit card required</p>
        </div>
        <div className="hero-fade flex justify-center lg:justify-end">
          <TypewriterCode />
        </div>
      </div>
    </section>
  );
}
