"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin top progress bar for client-side navigations, so every link click gets instant feedback
 * while the next page loads. Starts on internal link clicks, completes when the URL changes.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return; // same page / hash link
      if (timer.current) window.clearTimeout(timer.current);
      setState("loading");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setState((s) => (s === "loading" ? "done" : s));
      timer.current = window.setTimeout(() => setState("idle"), 350);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, search]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[150] h-0.5">
      <div
        className="h-full origin-left bg-gradient-to-r from-brand via-cyan to-brand shadow-[0_0_10px_rgba(6,182,212,0.7)] transition-[transform,opacity] ease-out"
        style={{
          transform: `scaleX(${state === "idle" ? 0 : state === "loading" ? 0.8 : 1})`,
          opacity: state === "idle" ? 0 : 1,
          transitionDuration: state === "loading" ? "8s" : state === "done" ? "200ms" : "0ms",
        }}
      />
    </div>
  );
}
