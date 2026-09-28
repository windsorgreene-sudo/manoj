"use client";

import { useState, type ComponentProps, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Ripple = { id: number; x: number; y: number; size: number };

/** shadcn Button with a material-style ripple on press. */
export function RippleButton({ className, children, onPointerDown, ...props }: ComponentProps<typeof Button>) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const handle = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const ripple = { id: Date.now(), x: e.clientX - r.left - size / 2, y: e.clientY - r.top - size / 2, size };
    setRipples((prev) => [...prev, ripple]);
    window.setTimeout(() => setRipples((prev) => prev.filter((p) => p.id !== ripple.id)), 650);
    onPointerDown?.(e);
  };
  return (
    <Button className={cn("relative overflow-hidden", className)} onPointerDown={handle} {...props}>
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="ripple-dot" style={{ left: r.x, top: r.y, width: r.size, height: r.size }} />
      ))}
    </Button>
  );
}
