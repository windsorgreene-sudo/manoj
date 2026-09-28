"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

/** Counts from 0 to `value` when scrolled into view. */
export function CountUp({ value, suffix = "", duration = 1.8 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${new Intl.NumberFormat("en-IN").format(Math.round(v))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration]);
  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      0{suffix}
    </span>
  );
}
