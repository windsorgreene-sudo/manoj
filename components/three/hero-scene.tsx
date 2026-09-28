"use client";

import dynamic from "next/dynamic";
import { SceneGate } from "@/components/three/scene-gate";
import { useMediaQuery } from "@/hooks/use-media-query";

const KnowledgeCore = dynamic(() => import("@/components/three/knowledge-core"), { ssr: false, loading: () => <CoreFallback /> });

/** Static fallback: CSS-only "planet" for low-end devices, reduced motion or no WebGL. */
export function CoreFallback() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <div className="relative size-[min(60vw,420px)] md:translate-x-[22vw]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#C4B5FD_0%,#7C3AED_35%,#2E1065_70%,transparent_72%)] shadow-[0_0_120px_40px_rgba(124,58,237,0.35)]" />
        <div className="absolute -inset-[18%] rounded-full border border-cyan/40 [transform:rotateX(70deg)]" />
        <div className="absolute -inset-[32%] rounded-full border border-brand-soft/30 [transform:rotateX(60deg)_rotateY(20deg)]" />
      </div>
    </div>
  );
}

export function HeroScene() {
  const lite = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <SceneGate className="absolute inset-0" fallback={<CoreFallback />}>
        {(visible) => <KnowledgeCore visible={visible} lite={lite} />}
      </SceneGate>
      {/* legibility scrim for the text column */}
      <div aria-hidden className="absolute inset-0 bg-background/45 md:bg-transparent md:bg-[linear-gradient(90deg,var(--cv-bg)_0%,color-mix(in_oklab,var(--cv-bg),transparent_40%)_35%,transparent_60%)]" />
    </>
  );
}
