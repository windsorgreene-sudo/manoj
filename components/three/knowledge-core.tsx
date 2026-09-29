"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { bindGlobalPointer, globalPointer, storyProgress } from "@/lib/stores/story";

// ───────── Tech logo badges (drawn to canvas → no network fonts/assets) ─────────
type Logo = { label: string; bg: string; fg: string; radius: number; speed: number; tilt: number; phase: number; atom?: boolean };
const LOGOS: Logo[] = [
  { label: "Py", bg: "#3776AB", fg: "#FFD43B", radius: 2.6, speed: 0.35, tilt: 0.35, phase: 0 },
  { label: "JS", bg: "#F7DF1E", fg: "#111111", radius: 3.0, speed: 0.28, tilt: -0.5, phase: 1.3 },
  { label: "C++", bg: "#00599C", fg: "#FFFFFF", radius: 2.8, speed: 0.31, tilt: 0.9, phase: 2.6 },
  { label: "Java", bg: "#E76F00", fg: "#FFFFFF", radius: 3.3, speed: 0.24, tilt: -0.15, phase: 3.9 },
  { label: "", bg: "#20232A", fg: "#61DAFB", radius: 2.4, speed: 0.4, tilt: 0.6, phase: 5.1, atom: true },
];

function makeLogoTexture(l: Logo) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d") as CanvasRenderingContext2D;
  const r = 56;
  ctx.fillStyle = l.bg;
  ctx.beginPath();
  ctx.roundRect(16, 16, size - 32, size - 32, r);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 6;
  ctx.stroke();
  if (l.atom) {
    ctx.strokeStyle = l.fg;
    ctx.lineWidth = 9;
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((i * Math.PI) / 3);
      ctx.beginPath();
      ctx.ellipse(0, 0, 82, 32, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = l.fg;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 16, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = l.fg;
    ctx.font = `bold ${l.label.length > 2 ? 78 : 104}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(l.label, size / 2, size / 2 + 6);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function OrbitingLogo({ logo }: { logo: Logo }) {
  const ref = useRef<THREE.Sprite>(null);
  const texture = useMemo(() => makeLogoTexture(logo), [logo]);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * logo.speed + logo.phase;
    const s = ref.current;
    if (!s) return;
    const x = Math.cos(t) * logo.radius;
    const z = Math.sin(t) * logo.radius;
    s.position.set(x, Math.sin(t) * logo.radius * Math.sin(logo.tilt) * 0.5, z * Math.cos(logo.tilt));
    const scale = 0.62 + (z + logo.radius) * 0.04;
    s.scale.setScalar(scale);
  });
  return (
    <sprite ref={ref}>
      <spriteMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

// ───────── Crystal planet ─────────
function CrystalPlanet() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.12;
    // tilt toward the pointer
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, globalPointer.y * 0.08, 0.03);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -globalPointer.x * 0.05, 0.03);
    if (shell.current) shell.current.rotation.y -= dt * 0.2;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={group}>
        <mesh>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshStandardMaterial color="#6D28D9" emissive="#4C1D95" emissiveIntensity={0.9} metalness={0.4} roughness={0.15} flatShading />
        </mesh>
        <mesh ref={shell} scale={1.06}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.35} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshBasicMaterial color="#C4B5FD" toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[2.05, 0.012, 8, 160]} />
          <meshBasicMaterial color="#06B6D4" toneMapped={false} transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 1.7, 0.4, 0]}>
          <torusGeometry args={[2.5, 0.008, 8, 160]} />
          <meshBasicMaterial color="#A78BFA" toneMapped={false} transparent opacity={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

// ───────── Mouse-reactive particle field ─────────
/** Deterministic PRNG (mulberry32) so particle layout is stable and render stays pure. */
function prng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rnd = prng(1337);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + rnd() * 10;
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += dt * 0.02;
    p.position.x = THREE.MathUtils.lerp(p.position.x, globalPointer.x * 0.2, 0.02);
    p.position.y = THREE.MathUtils.lerp(p.position.y, globalPointer.y * 0.12, 0.02);
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#A5B4FC" transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ───────── Camera flight through the 4 chapters ─────────
const KEYFRAMES: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [-2.4, 0, 7.5], look: [-2.4, 0, 0] }, // hero, planet sits right of the headline
  { pos: [2.5, 1.2, 6.5], look: [-1.8, 0, 0] }, // Learn
  { pos: [-4.5, -0.8, 5.5], look: [-1.2, 0, 0] }, // Practice
  { pos: [-1.5, 4.5, 5.5], look: [-1.6, 0, 0] }, // Compete
  { pos: [-1.2, 0.4, 5.2], look: [-2, 0, -1] }, // Get Hired
];

const KF_POS = KEYFRAMES.map((k) => new THREE.Vector3(...k.pos));
const KF_LOOK = KEYFRAMES.map((k) => new THREE.Vector3(...k.look));

function CameraRig() {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  useFrame(() => {
    const p = THREE.MathUtils.clamp(storyProgress.current, 0, 1) * (KEYFRAMES.length - 1);
    const i = Math.min(Math.floor(p), KEYFRAMES.length - 2);
    const t = THREE.MathUtils.smoothstep(p - i, 0, 1);
    target.current.copy(KF_POS[i]).lerp(KF_POS[i + 1], t);
    lookTarget.current.copy(KF_LOOK[i]).lerp(KF_LOOK[i + 1], t);
    target.current.x += globalPointer.x * 0.1;
    target.current.y += globalPointer.y * 0.06;
    camera.position.lerp(target.current, 0.06);
    look.current.lerp(lookTarget.current, 0.06);
    camera.lookAt(look.current);
  });
  return null;
}

export default function KnowledgeCore({ visible, lite }: { visible: boolean; lite: boolean }) {
  useEffect(() => bindGlobalPointer(), []);
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#A78BFA" />
      <pointLight position={[-4, -2, 2]} intensity={25} color="#06B6D4" />
      <CrystalPlanet />
      {LOGOS.map((l) => (
        <OrbitingLogo key={l.phase} logo={l} />
      ))}
      <ParticleField count={lite ? 700 : 1800} />
      <CameraRig />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.25} luminanceSmoothing={0.3} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.0007, 0.0005)} radialModulation={false} modulationOffset={0} />
      </EffectComposer>
    </Canvas>
  );
}
