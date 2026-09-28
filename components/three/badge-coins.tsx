"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export type CoinBadge = { slug: string; name: string; color: string; tier: string; earned: boolean };

function faceTexture(b: CoinBadge) {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d") as CanvasRenderingContext2D;
  const col = b.earned ? b.color : "#3A3A4F";
  const g = ctx.createRadialGradient(s / 2, s / 2, 10, s / 2, s / 2, s / 2);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.25, col);
  g.addColorStop(1, "#0A0A14");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2 - 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = b.earned ? "#ffffff" : "#8A8AA0";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 44px system-ui, sans-serif";
  const words = b.name.split(" ");
  words.slice(0, 2).forEach((w, i) => ctx.fillText(w, s / 2, s / 2 + (i - (Math.min(2, words.length) - 1) / 2) * 50));
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.fillText(b.earned ? b.tier : "LOCKED", s / 2, s - 46);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Coin({ badge, position, onHover, active }: { badge: CoinBadge; position: [number, number, number]; onHover: (slug: string | null) => void; active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(() => faceTexture(badge), [badge]);
  useEffect(() => () => tex.dispose(), [tex]);
  const spin = useRef(0);
  useFrame((_, dt) => {
    if (!ref.current) return;
    spin.current = THREE.MathUtils.lerp(spin.current, active ? 6 : 0.4, dt * 3);
    ref.current.rotation.y += dt * spin.current;
  });
  const edge = badge.earned ? badge.color : "#2A2A3C";
  return (
    <Float speed={active ? 3 : 1} floatIntensity={active ? 0.6 : 0.2} rotationIntensity={0}>
      <group
        ref={ref}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(badge.slug);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "";
        }}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.14, 48]} />
          <meshStandardMaterial color={edge} metalness={0.9} roughness={0.25} emissive={edge} emissiveIntensity={badge.earned ? 0.25 : 0} />
        </mesh>
        <mesh position={[0, 0, 0.075]}>
          <circleGeometry args={[0.76, 48]} />
          <meshStandardMaterial map={tex} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, -0.075]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.76, 48]} />
          <meshStandardMaterial map={tex} metalness={0.3} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

function Grid({ badges, active, setActive }: { badges: CoinBadge[]; active: string | null; setActive: (s: string | null) => void }) {
  const { viewport } = useThree();
  const cols = Math.max(2, Math.min(5, Math.floor(viewport.width / 2)));
  const rows = Math.ceil(badges.length / cols);
  return (
    <>
      {badges.map((b, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return <Coin key={b.slug} badge={b} active={active === b.slug} onHover={setActive} position={[(c - (cols - 1) / 2) * 2, ((rows - 1) / 2 - r) * 2, 0]} />;
      })}
    </>
  );
}

export default function BadgeCoins({ badges, visible, onActive }: { badges: CoinBadge[]; visible: boolean; onActive: (slug: string | null) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const set = (s: string | null) => {
    setActive(s);
    onActive(s);
  };
  const rows = Math.ceil(badges.length / 5);
  return (
    <Canvas dpr={[1, 2]} frameloop={visible ? "always" : "never"} camera={{ position: [0, 0, rows * 2 + 4], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 8]} intensity={2.5} />
      <pointLight position={[-6, -4, 6]} intensity={40} color="#06B6D4" />
      <Grid badges={badges} active={active} setActive={set} />
    </Canvas>
  );
}
