"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export type PodiumEntry = { rank: number; name: string; score: number };

const PLACE = {
  1: { x: 0, h: 2.2, color: "#F59E0B" },
  2: { x: -2.2, h: 1.5, color: "#CBD5E1" },
  3: { x: 2.2, h: 1.0, color: "#B45309" },
} as const;

function labelTexture(e: PodiumEntry) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d") as CanvasRenderingContext2D;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 120px system-ui, sans-serif";
  ctx.fillText(`#${e.rank}`, 256, 120);
  ctx.font = "600 44px system-ui, sans-serif";
  const name = e.name.length > 18 ? `${e.name.slice(0, 17)}…` : e.name;
  ctx.fillText(name, 256, 185);
  ctx.fillStyle = "#A5F3FC";
  ctx.font = "500 34px system-ui, sans-serif";
  ctx.fillText(`${e.score} pts`, 256, 232);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Block({ entry, delay }: { entry: PodiumEntry; delay: number }) {
  const place = PLACE[entry.rank as 1 | 2 | 3];
  const group = useRef<THREE.Group>(null);
  const trophy = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => labelTexture(entry), [entry]);
  useEffect(() => () => tex.dispose(), [tex]);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    const k = Math.min(1, Math.max(0, (t.current - delay) / 0.9));
    const eased = 1 - (1 - k) ** 3;
    if (group.current) group.current.scale.y = Math.max(0.001, eased);
    if (trophy.current) {
      trophy.current.rotation.y += dt * 1.2;
      trophy.current.visible = k >= 1;
    }
  });
  return (
    <group position={[place.x, 0, 0]}>
      <group ref={group}>
        <mesh position={[0, place.h / 2, 0]}>
          <boxGeometry args={[1.9, place.h, 1.9]} />
          <meshStandardMaterial color="#1A1A2E" metalness={0.6} roughness={0.35} emissive="#7C3AED" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, place.h / 2, 0.951]}>
          <planeGeometry args={[1.8, 0.9]} />
          <meshBasicMaterial map={tex} transparent />
        </mesh>
        <mesh position={[0, place.h + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.9, 1.9]} />
          <meshStandardMaterial color={place.color} metalness={0.9} roughness={0.2} emissive={place.color} emissiveIntensity={0.25} />
        </mesh>
      </group>
      <Float speed={2} floatIntensity={0.4} rotationIntensity={0}>
        <mesh ref={trophy} position={[0, place.h + 0.75, 0]}>
          <torusKnotGeometry args={[0.28, 0.1, 96, 12]} />
          <meshStandardMaterial color={place.color} metalness={1} roughness={0.15} emissive={place.color} emissiveIntensity={0.35} />
        </mesh>
      </Float>
    </group>
  );
}

function Rig() {
  useFrame(({ camera, clock }) => {
    camera.position.x = Math.sin(clock.elapsedTime * 0.25) * 1.5;
    camera.lookAt(0, 1.2, 0);
  });
  return null;
}

/** 3D contest podium: blocks rise in order 3 → 2 → 1, then trophies spin. */
export default function Podium({ entries, visible }: { entries: PodiumEntry[]; visible: boolean }) {
  const order = [3, 2, 1];
  return (
    <Canvas dpr={[1, 2]} frameloop={visible ? "always" : "never"} camera={{ position: [0, 3, 7.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 8, 6]} intensity={2.4} />
      <pointLight position={[-5, 3, 4]} intensity={30} color="#06B6D4" />
      <pointLight position={[5, 3, 4]} intensity={30} color="#7C3AED" />
      {entries
        .filter((e) => e.rank >= 1 && e.rank <= 3)
        .map((e) => (
          <Block key={e.rank} entry={e} delay={order.indexOf(e.rank) * 0.45} />
        ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#0A0A14" metalness={0.4} roughness={0.8} />
      </mesh>
      <Sparkles count={60} scale={[8, 4, 3]} position={[0, 2.5, 0]} size={3} speed={0.4} color="#F59E0B" />
      <Rig />
    </Canvas>
  );
}
