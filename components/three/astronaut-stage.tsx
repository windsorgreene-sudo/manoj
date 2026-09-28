"use client";

import dynamic from "next/dynamic";
import { SceneGate } from "@/components/three/scene-gate";

const AstronautScene = dynamic(() => import("@/components/three/astronaut"), { ssr: false });

function Fallback() {
  return (
    <div aria-hidden className="flex h-full items-center justify-center text-[120px] motion-safe:animate-float">
      🧑‍🚀
    </div>
  );
}

export function AstronautStage() {
  return (
    <SceneGate className="h-[340px] w-full cursor-grab active:cursor-grabbing md:h-[420px]" fallback={<Fallback />}>
      {(visible) => <AstronautScene visible={visible} />}
    </SceneGate>
  );
}
