"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useIsDesktopPointer } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/** Card that enters with a 3D flip and tilts toward the pointer on hover (desktop). */
export function TiltCard({ children, className, index = 0 }: { children: ReactNode; className?: string; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktopPointer();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 18 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!desktop || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateX: 25, y: 40 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: desktop ? rx : 0, rotateY: desktop ? ry : 0, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      className={cn("group relative [transform-style:preserve-3d]", className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: useTransform([glowX, glowY], ([x, y]) => `radial-gradient(400px circle at ${x} ${y}, rgba(124,58,237,0.18), transparent 50%)`) }}
      />
      {children}
    </motion.div>
  );
}
