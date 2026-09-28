"use client";

import dynamic from "next/dynamic";
import { SceneGate } from "@/components/three/scene-gate";

const WireframeShapes = dynamic(() => import("@/components/three/wireframe-shapes"), { ssr: false });

function StaticFallback() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute left-[15%] top-[20%] size-40 rotate-12 rounded-3xl border border-brand/40" />
      <div className="absolute bottom-[18%] right-[12%] size-32 -rotate-6 rounded-full border border-cyan/40" />
      <div className="absolute right-[30%] top-[12%] size-20 rotate-45 border border-brand-soft/40" />
    </div>
  );
}

export function AuthBackground() {
  return (
    <SceneGate className="absolute inset-0" fallback={<StaticFallback />}>
      {(visible) => <WireframeShapes visible={visible} />}
    </SceneGate>
  );
}
