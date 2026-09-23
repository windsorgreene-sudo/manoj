"use client";

import confetti from "canvas-confetti";

// Fires a celebratory confetti burst. Respects prefers-reduced-motion.
export function fireConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#2f7bec", "#7c3aed", "#10b981", "#f59e0b"];
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.7 },
    colors,
    disableForReducedMotion: true,
  });
  setTimeout(
    () =>
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        disableForReducedMotion: true,
      }),
    150,
  );
  setTimeout(
    () =>
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        disableForReducedMotion: true,
      }),
    250,
  );
}
