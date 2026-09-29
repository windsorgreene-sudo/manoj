"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Lightweight page enter transition (used from template.tsx files).
 * Only opacity + transform are animated — both are GPU-composited, so it stays at 60fps
 * even on pages with glass/backdrop-blur and 3D canvases (filter: blur was too expensive).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
