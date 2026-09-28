"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

/** Lenis smooth scroll on marketing/learn pages; native scroll inside app panels and for reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const pathname = usePathname();
  const appPanel =
    pathname.startsWith("/admin") || pathname.startsWith("/dashboard") || pathname.startsWith("/problems/") || pathname.startsWith("/playground");
  const enabled = !reduced && !appPanel && finePointer;

  if (!enabled) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
