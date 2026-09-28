"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Capability = "pending" | "ok" | "fallback";

function detectCapability(): Capability {
  if (typeof window === "undefined") return "pending";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "fallback";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return "fallback";
  if ((nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2) return "fallback";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return "fallback";
  } catch {
    return "fallback";
  }
  return "ok";
}

/**
 * Gate for every 3D scene:
 * - static fallback on low-end devices, save-data, reduced motion, or no WebGL
 * - `visible` flag so scenes pause rendering (frameloop="never") when off-screen
 */
export function SceneGate({
  children,
  fallback,
  className,
}: {
  children: (visible: boolean) => ReactNode;
  fallback: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cap, setCap] = useState<Capability>("pending");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Capability can only be read in the browser; defer one frame so first paint stays fast.
    const id = requestAnimationFrame(() => setCap(detectCapability()));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const onVis = () => setVisible(document.visibilityState === "visible" && el.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {cap === "ok" ? children(visible) : fallback}
    </div>
  );
}
