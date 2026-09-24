"use client";

import { useEffect, useRef, useState } from "react";

// Counts up from 0 to `value` when it scrolls into view. If `value` is not a
// number (e.g. "EN + Hinglish"), it just renders the text. Respects
// prefers-reduced-motion by showing the final value immediately.
export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1200,
  className = "",
}: {
  value: number | string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const numeric = typeof value === "number" ? value : null;
  const [display, setDisplay] = useState<string>(numeric === null ? String(value) : "0");

  useEffect(() => {
    if (numeric === null) return;
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(String(numeric));
      return;
    }

    let raf = 0;
    let started = false;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(String(Math.round(eased * numeric)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [numeric, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {numeric !== null ? suffix : ""}
    </span>
  );
}
