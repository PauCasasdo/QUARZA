"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Mineral } from "@/data/minerals";
import { createQuartzGeometry, createStripeTexture } from "@/lib/quartzGeometry";
import { prefersReducedMotion } from "@/lib/quality";

function RutileNeedles() {
  const group = useRef<THREE.Group>(null);
  const needles = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: [number, number, number]; len: number }[] = [];
    let s = 42;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    for (let i = 0; i < 26; i++) {
      arr.push({
        pos: [(rnd() - 0.5) * 0.9, (rnd() - 0.5) * 1.8, (rnd() - 0.5) * 0.9],
        rot: [rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI],
        len: 0.5 + rnd() * 1.1,
      });
    }
    return arr;
  }, []);
  return (
    <group ref={group}>
      {needles.map((n, i) => (
        <mesh key={i} position={n.pos} rotation={n.rot}>
          <cylinderGeometry args={[0.008, 0.008, n.len, 5]} />
          <meshStandardMaterial color="#c9973f" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

export default function QuartzCrystal({
  mineral,
  floatEnabled = true,
}: {
  mineral: Mineral;
  floatEnabled?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const reduce = prefersReducedMotion();

  const geometry = useMemo(
    () => createQuartzGeometry(mineral.id.length * 13 + 5),
    [mineral.id]
  );

  const stripeMap = useMemo(() => {
    if (typeof window === "undefined") return null;
    const v = mineral.render.variant;
    if (v === "agate")
      return createStripeTexture(["#efe7db", "#d8cfc4", "#b8a894", "#8f7d6b", "#f5f1ea"], 26);
    if (v === "tiger")
      return createStripeTexture(["#8a5f2e", "#c9973f", "#3d2c17", "#e0b96a", "#6b4a22"], 30);
    if (v === "jasper")
      return createStripeTexture(["#9e4a35", "#7a3524", "#c47a52", "#5d2a1e"], 18);
    return null;
  }, [mineral]);

  useFrame((state) => {
    if (!mesh.current || reduce) return;
    // imperceptible idle shimmer (Float handles position; here subtle rotation wobble is off — keep stable)
    void state;
  });

  const r = mineral.render;
  const isOpaque = (r.transmission ?? 1) < 0.2;

  const material = (
    <meshPhysicalMaterial
      color={r.color}
      roughness={r.roughness}
      metalness={0}
      transmission={isOpaque ? 0 : r.transmission}
      thickness={r.thickness}
      ior={1.54}
      attenuationColor={new THREE.Color(r.color)}
      attenuationDistance={2.2}
      clearcoat={0.6}
      clearcoatRoughness={0.25}
      transparent={isOpaque}
      opacity={isOpaque ? 1 : 1}
      map={stripeMap ?? undefined}
      flatShading
      side={THREE.FrontSide}
    />
  );

  const inner = (
    <group>
      <mesh ref={mesh} geometry={geometry}>
        {material}
      </mesh>
      {r.variant === "rutilated" && <RutileNeedles />}
      {/* inner glow core for milky/rose to fake subsurface */}
      {(r.variant === "rose" || r.variant === "milky" || r.variant === "chalcedony") && (
        <mesh scale={0.82} geometry={geometry}>
          <meshBasicMaterial color={r.color} transparent opacity={0.18} depthWrite={false} />
        </mesh>
      )}
    </group>
  );

  if (!floatEnabled || reduce) return <group>{inner}</group>;

  return (
    <Float speed={1.1} rotationIntensity={0} floatIntensity={0.55} floatingRange={[-0.08, 0.08]}>
      {inner}
    </Float>
  );
}
