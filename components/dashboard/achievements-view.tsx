"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Award, Lock } from "lucide-react";
import { SceneGate } from "@/components/three/scene-gate";
import type { CoinBadge } from "@/components/three/badge-coins";
import { cn, formatDate } from "@/lib/utils";

const BadgeCoins = dynamic(() => import("@/components/three/badge-coins"), { ssr: false, loading: () => <div className="shimmer h-full w-full" /> });

type B = CoinBadge & { description: string; xpReward: number; awardedAt: string | null };

export function AchievementsView({ badges }: { badges: B[] }) {
  const [active, setActive] = useState<string | null>(null);
  const earned = badges.filter((b) => b.earned).length;
  const current = badges.find((b) => b.slug === active);
  return (
    <div className="space-y-6">
      <div className="glass relative h-[460px] overflow-hidden">
        <SceneGate className="absolute inset-0" fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">3D badges are disabled on this device — see the list below.</div>}>
          {(visible) => <BadgeCoins badges={badges} visible={visible} onActive={setActive} />}
        </SceneGate>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4 text-center" aria-live="polite">
          {current ? (
            <p className="text-sm">
              <strong>{current.name}</strong> — {current.description} {current.earned ? `· +${current.xpReward} XP` : "· locked"}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Hover a badge to spin it · {earned}/{badges.length} unlocked</p>
          )}
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="All badges">
        {badges.map((b) => (
          <li key={b.slug} className={cn("glass flex items-center gap-3 p-4", !b.earned && "opacity-60")} onMouseEnter={() => setActive(b.slug)}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full" style={{ background: b.earned ? `${b.color}33` : undefined }}>
              {b.earned ? <Award className="size-5" style={{ color: b.color }} /> : <Lock className="size-4 text-muted-foreground" />}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{b.name} <span className="text-[10px] font-normal text-muted-foreground">{b.tier}</span></p>
              <p className="text-xs text-muted-foreground">{b.description}</p>
              <p className="text-[10px] text-muted-foreground">{b.awardedAt ? `Unlocked ${formatDate(b.awardedAt)}` : `+${b.xpReward} XP`}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
