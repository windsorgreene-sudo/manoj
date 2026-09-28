"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PresentationControls, Stars } from "@react-three/drei";
import type { Group } from "three";

const SUIT = "#E8E8F0";
const TRIM = "#7C3AED";

function Limb({ position, rotation, length = 0.55 }: { position: [number, number, number]; rotation: [number, number, number]; length?: number }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <capsuleGeometry args={[0.16, length, 8, 16]} />
      <meshStandardMaterial color={SUIT} roughness={0.6} />
    </mesh>
  );
}

function AstronautModel() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.12;
  });
  return (
    <group ref={ref}>
      {/* helmet */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshStandardMaterial color={SUIT} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.06, 0.3]} scale={[1, 0.78, 0.6]}>
        <sphereGeometry args={[0.4, 48, 48]} />
        <meshStandardMaterial color="#0B0B1A" metalness={0.9} roughness={0.08} emissive="#06B6D4" emissiveIntensity={0.25} />
      </mesh>
      {/* torso + backpack */}
      <mesh position={[0, 0.2, 0]}>
        <capsuleGeometry args={[0.45, 0.55, 8, 24]} />
        <meshStandardMaterial color={SUIT} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.3, -0.45]}>
        <boxGeometry args={[0.7, 0.8, 0.3]} />
        <meshStandardMaterial color="#C9C9D6" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.35, 0.44]}>
        <boxGeometry args={[0.36, 0.22, 0.06]} />
        <meshStandardMaterial color={TRIM} emissive={TRIM} emissiveIntensity={0.8} />
      </mesh>
      {/* arms & legs */}
      <Limb position={[-0.62, 0.35, 0]} rotation={[0, 0, 0.9]} />
      <Limb position={[0.62, 0.45, 0.05]} rotation={[0.3, 0, -1.3]} />
      <Limb position={[-0.24, -0.6, 0]} rotation={[0.2, 0, 0.15]} length={0.6} />
      <Limb position={[0.26, -0.58, 0.1]} rotation={[-0.35, 0, -0.1]} length={0.6} />
      {/* tether */}
      <mesh position={[1.4, 0.9, -0.6]} rotation={[0, 0, 0.8]}>
        <torusGeometry args={[0.9, 0.02, 8, 64, Math.PI]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

export default function AstronautScene({ visible }: { visible: boolean }) {
  return (
    <Canvas dpr={[1, 2]} frameloop={visible ? "always" : "never"} camera={{ position: [0, 0.4, 5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-3, -2, 2]} intensity={20} color="#7C3AED" />
      <Stars radius={60} depth={40} count={2500} factor={3} fade speed={0.6} />
      <PresentationControls global cursor snap={false} rotation={[0.1, -0.4, 0]} polar={[-Math.PI / 3, Math.PI / 3]} azimuth={[-Math.PI, Math.PI]}>
        <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.2}>
          <AstronautModel />
        </Float>
      </PresentationControls>
    </Canvas>
  );
}
