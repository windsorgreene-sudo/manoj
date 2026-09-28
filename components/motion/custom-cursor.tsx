"use client";

import { useEffect, useRef } from "react";
import { useIsDesktopPointer } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Custom cursor (desktop, fine pointer only). Grows over interactive elements. */
export function CustomCursor() {
  const desktop = useIsDesktopPointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!desktop || reduced) return;
    let x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      raf = 0,
      shown = false;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        wrap.current?.style.setProperty("opacity", "1");
      }
      const target = e.target as HTMLElement | null;
      const interactive = Boolean(target?.closest("a,button,[role=button],input,textarea,select,[data-cursor=hover]"));
      ring.current?.classList.toggle("scale-[1.8]", interactive);
      ring.current?.classList.toggle("border-cyan", interactive);
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("has-custom-cursor");
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [desktop, reduced]);

  if (!desktop || reduced) return null;
  return (
    <div ref={wrap} aria-hidden className="cursor-dot pointer-events-none fixed inset-0 z-[100] opacity-0 transition-opacity">
      <div ref={dot} className="fixed left-0 top-0 size-1.5 rounded-full bg-brand-soft" />
      <div
        ref={ring}
        className="fixed left-0 top-0 size-8 rounded-full border border-brand-soft/60 transition-[scale,border-color] duration-200"
      />
    </div>
  );
}
