"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { TiltCard } from "@/components/motion/tilt-card";
import { CourseCard } from "@/components/marketing/course-card";
import type { CourseCardData } from "@/lib/queries/courses";

/** Horizontal course carousel: pinned + scrubbed on desktop, swipeable scroll-snap on touch / reduced motion. */
export function CourseCarousel({ courses }: { courses: CourseCardData[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 64);
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
        return () => ScrollTrigger.refresh();
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative z-10 overflow-hidden py-24" aria-labelledby="popular-courses">
      <div className="container-cv mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="popular-courses" className="mt-3 font-heading text-3xl font-bold md:text-5xl">
            Structured learning, <span className="text-gradient">zero fluff</span>
          </h2>
        </div>
        <Link href="/courses" className="flex items-center gap-1 text-sm font-semibold hover:underline">
          View all courses <ArrowRight className="size-4" />
        </Link>
      </div>
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:px-8 lg:w-max lg:snap-none lg:overflow-visible lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))]"
        data-lenis-prevent-touch
      >
        {courses.map((c, i) => (
          <TiltCard key={c.id} index={i} className="w-[82vw] max-w-[360px] shrink-0 snap-start sm:w-[360px]">
            <CourseCard course={c} />
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
