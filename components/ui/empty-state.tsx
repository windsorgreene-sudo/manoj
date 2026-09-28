"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const Lottie = dynamic(() => import("lottie-react").then((m) => m.Lottie), { ssr: false, loading: () => <StaticIllustration /> });

function StaticIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
      <circle cx="100" cy="100" r="64" fill="none" stroke="#7C3AED" strokeOpacity="0.45" strokeWidth="2" />
      <circle cx="100" cy="100" r="32" fill="#7C3AED" />
      <circle cx="164" cy="100" r="7" fill="#06B6D4" />
      <circle cx="50" cy="100" r="5" fill="#A78BFA" />
    </svg>
  );
}

/** Empty state with a Lottie illustration (static SVG for reduced motion). */
export function EmptyState({ title, description, action, className }: { title: string; description?: string; action?: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("glass flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)} role="status">
      <div className="size-32">{reduced ? <StaticIllustration /> : <Lottie src="/lottie/empty.json" autoplay loop className="size-32" aria-hidden />}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
