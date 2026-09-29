"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { LenisScrollTriggerSync } from "@/components/motion/lenis-sync";

/** Jumps to the top on route changes (Lenis otherwise keeps animating from the old position). */
function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis || window.location.hash) return;
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);
  return null;
}

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
    // Elements marked data-lenis-prevent (code editors, dialogs, sheets) keep native scrolling.
    <ReactLenis root options={{ lerp: 0.12, smoothWheel: true, anchors: { offset: -80 }, prevent: (node) => Boolean(node.closest("[data-lenis-prevent], [role=dialog], .monaco-editor")) }}>
      <LenisScrollTriggerSync />
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
