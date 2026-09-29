"use client";

import dynamic from "next/dynamic";
import { Crown, Medal } from "lucide-react";
import { SceneGate } from "@/components/three/scene-gate";
import type { PodiumEntry } from "@/components/three/podium";
import { cn } from "@/lib/utils";

const PodiumScene = dynamic(() => import("@/components/three/podium"), { ssr: false, loading: () => <div className="shimmer h-full rounded-2xl" /> });

/** Static 2D podium for low-end devices / reduced motion / no WebGL. */
function FlatPodium({ entries }: { entries: PodiumEntry[] }) {
  const order = [2, 1, 3];
  return (
    <div className="flex h-full items-end justify-center gap-3 px-4 pb-4">
      {order.map((rank) => {
        const e = entries.find((x) => x.rank === rank);
        if (!e) return null;
        return (
          <div key={rank} className="flex w-28 flex-col items-center gap-2 sm:w-36">
            {rank === 1 ? <Crown className="size-8 text-warning" aria-hidden /> : <Medal className={cn("size-7", rank === 2 ? "text-slate-300" : "text-amber-700")} aria-hidden />}
            <p className="w-full truncate text-center text-sm font-semibold">{e.name}</p>
            <p className="text-xs text-muted-foreground">{e.score} pts</p>
            <div className={cn("glass gradient-border flex w-full items-start justify-center rounded-t-2xl pt-3 font-heading text-3xl font-bold", rank === 1 ? "h-40" : rank === 2 ? "h-28" : "h-20")}>#{rank}</div>
          </div>
        );
      })}
    </div>
  );
}

export function PodiumStage({ entries }: { entries: PodiumEntry[] }) {
  if (!entries.length) return null;
  return (
    <section aria-label={`Podium: ${entries.map((e) => `#${e.rank} ${e.name}`).join(", ")}`} className="glass overflow-hidden">
      <SceneGate className="h-[300px] w-full md:h-[380px]" fallback={<FlatPodium entries={entries} />}>
        {(visible) => <PodiumScene entries={entries} visible={visible} />}
      </SceneGate>
    </section>
  );
}
