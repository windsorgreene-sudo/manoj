"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export type LabNode = { id: number; label: string; pos: [number, number, number]; info: string };
export type LabEdge = [number, number];

function NodeMesh({ node, selected, lit, onSelect }: { node: LabNode; selected: boolean; lit: boolean; onSelect: (id: number) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = selected ? 1.35 : hover ? 1.15 : 1;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), Math.min(1, dt * 10));
  });
  const color = selected ? "#F59E0B" : lit ? "#84CC16" : "#7C3AED";
  return (
    <group position={node.pos}>
      <mesh
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} roughness={0.3} metalness={0.2} />
      </mesh>
      <Html center distanceFactor={9} pointerEvents="none">
        <span className="pointer-events-none select-none font-mono text-sm font-bold text-white drop-shadow">{node.label}</span>
      </Html>
    </group>
  );
}

function AutoRotate({ enabled }: { enabled: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (enabled && g.current) g.current.rotation.y += dt * 0.08;
  });
  return <group ref={g} />;
}

export default function DsLabScene({
  nodes,
  edges,
  lit,
  selected,
  onSelect,
  visible,
}: {
  nodes: LabNode[];
  edges: LabEdge[];
  lit: Set<number>;
  selected: number | null;
  onSelect: (id: number | null) => void;
  visible: boolean;
}) {
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  return (
    <Canvas dpr={[1, 2]} frameloop={visible ? "always" : "never"} camera={{ position: [0, 2, 14], fov: 50 }} onPointerMissed={() => onSelect(null)} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[8, 10, 8]} intensity={120} color="#ffffff" />
      <pointLight position={[-8, -4, -6]} intensity={60} color="#06B6D4" />
      <AutoRotate enabled={selected === null} />
      {edges.map(([a, b]) => {
        const na = byId.get(a),
          nb = byId.get(b);
        if (!na || !nb) return null;
        const on = lit.has(a) && lit.has(b);
        return <Line key={`${a}-${b}`} points={[na.pos, nb.pos]} color={on ? "#84CC16" : "#6B6B8A"} lineWidth={on ? 3 : 1.5} transparent opacity={0.9} />;
      })}
      {nodes.map((n) => (
        <NodeMesh key={n.id} node={n} selected={selected === n.id} lit={lit.has(n.id)} onSelect={onSelect} />
      ))}
      <OrbitControls enableDamping makeDefault minDistance={4} maxDistance={30} />
    </Canvas>
  );
}
