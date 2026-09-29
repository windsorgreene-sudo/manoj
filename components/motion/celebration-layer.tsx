"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Award, Flame, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCelebrateStore, type Celebration } from "@/lib/stores/celebrate-store";

async function confetti(big: boolean) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: fire } = await import("canvas-confetti");
  const colors = ["#7C3AED", "#06B6D4", "#84CC16", "#F59E0B", "#A78BFA"];
  fire({ particleCount: big ? 160 : 90, spread: big ? 100 : 70, origin: { y: 0.7 }, colors, disableForReducedMotion: true });
  if (big) window.setTimeout(() => fire({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 250);
  if (big) window.setTimeout(() => fire({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 400);
}

/** Helper for any client: shows XP toast / confetti / level-up modal from an award result. */
export function useCelebrate() {
  const celebrate = useCelebrateStore((s) => s.celebrate);
  return (c: Celebration | null | undefined) => {
    if (!c) return;
    if (c.accepted || c.leveledUp || (c.badges && c.badges.length)) void confetti(Boolean(c.leveledUp || c.badges?.length));
    if (c.xp && !c.leveledUp) toast.success(`+${c.xp} XP`, { description: c.streak ? `${c.streak}-day streak` : undefined, icon: <Sparkles className="size-4 text-warning" /> });
    if (c.leveledUp || (c.badges && c.badges.length)) celebrate(c);
  };
}

/** Level-up modal + badge-unlock animation. Mounted once in Providers. */
export function CelebrationLayer() {
  const current = useCelebrateStore((s) => s.current);
  const clear = useCelebrateStore((s) => s.clear);
  useEffect(() => {
    if (!current) return;
    const t = window.setTimeout(clear, 8000);
    return () => window.clearTimeout(t);
  }, [current, clear]);

  return (
    <Dialog open={Boolean(current)} onOpenChange={(o) => !o && clear()}>
      <DialogContent className="max-w-sm overflow-hidden rounded-3xl border-brand/40 text-center">
        <AnimatePresence>
          {current ? (
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="space-y-4 py-4">
              <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.45),transparent_60%)]" />
              {current.leveledUp ? (
                <>
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="mx-auto grid size-28 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan text-4xl font-bold text-white shadow-[0_0_60px_rgba(124,58,237,0.7)]"
                  >
                    {current.level}
                  </motion.div>
                  <DialogTitle className="font-heading text-3xl">Level up!</DialogTitle>
                  <DialogDescription>You reached level {current.level}. New challenges unlocked.</DialogDescription>
                </>
              ) : (
                <>
                  <DialogTitle className="font-heading text-2xl">Badge unlocked!</DialogTitle>
                  <DialogDescription>You earned a new achievement.</DialogDescription>
                </>
              )}
              {current.badges?.length ? (
                <div className="flex flex-wrap justify-center gap-3">
                  {current.badges.map((b, i) => (
                    <motion.div
                      key={b.slug}
                      initial={{ y: 30, opacity: 0, rotateY: 180 }}
                      animate={{ y: 0, opacity: 1, rotateY: 0 }}
                      transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                      className="glass flex items-center gap-2 rounded-2xl px-3 py-2"
                    >
                      <Award className="size-5" style={{ color: b.color }} />
                      <span className="text-sm font-semibold">{b.name}</span>
                    </motion.div>
                  ))}
                </div>
              ) : null}
              {current.streak ? (
                <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Flame className="flame size-4 text-warning" /> {current.streak}-day streak
                </p>
              ) : null}
              <Button onClick={clear} className="rounded-xl">
                Keep going
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
