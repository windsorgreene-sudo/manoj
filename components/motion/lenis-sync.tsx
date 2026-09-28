"use client";

import { useLenis } from "lenis/react";
import { ScrollTrigger } from "@/components/motion/gsap";

/** Keeps GSAP ScrollTrigger in sync with Lenis smooth scrolling. */
export function LenisScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}
