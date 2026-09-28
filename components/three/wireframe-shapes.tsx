"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

function Shape({ position, color, kind, speed }: { position: [number, number, number]; color: string; kind: number; speed: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.2 * speed;
    ref.current.rotation.y += dt * 0.3 * speed;
  });
  return (
    <Float speed={1.2 * speed} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh ref={ref} position={position}>
        {kind === 0 ? (
          <icosahedronGeometry args={[1, 1]} />
        ) : kind === 1 ? (
          <torusKnotGeometry args={[0.7, 0.22, 90, 12]} />
        ) : kind === 2 ? (
          <octahedronGeometry args={[1, 0]} />
        ) : (
          <torusGeometry args={[0.8, 0.25, 12, 36]} />
        )}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
      </mesh>
    </Float>
  );
}

const SHAPES: { position: [number, number, number]; color: string; kind: number; speed: number }[] = [
  { position: [-3.2, 1.6, -2], color: "#7C3AED", kind: 0, speed: 1 },
  { position: [3, -1.4, -1.5], color: "#06B6D4", kind: 1, speed: 0.8 },
  { position: [2.6, 2.2, -3], color: "#A78BFA", kind: 2, speed: 1.2 },
  { position: [-2.4, -2, -2.5], color: "#06B6D4", kind: 3, speed: 0.9 },
  { position: [0.2, 0.2, -5], color: "#7C3AED", kind: 1, speed: 0.6 },
];

export default function WireframeShapes({ visible }: { visible: boolean }) {
  return (
    <Canvas dpr={[1, 2]} frameloop={visible ? "always" : "never"} camera={{ position: [0, 0, 6], fov: 55 }} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}>
      {SHAPES.map((s, i) => (
        <Shape key={i} {...s} />
      ))}
    </Canvas>
  );
}
