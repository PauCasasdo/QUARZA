"use client";
import { MutableRefObject, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { createQuartzGeometry } from "@/lib/quartzGeometry";
import { sampleCam, sampleBg, lerpVarietyProps, isDark } from "@/animations/story";
import type { MutableRefObject as R } from "react";

export type ProgressRef = MutableRefObject<number>;

function StoryCrystal({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  const keyRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const geometry = useMemo(() => createQuartzGeometry(7), []);
  const props = useMemo(
    () => ({ color: new THREE.Color("#ffffff"), roughness: 0.05, transmission: 1 }),
    []
  );
  const bg = useMemo(() => new THREE.Color("#FAF9F7"), []);
  const { camera } = useThree();

  useFrame((state, delta) => {
    const p = progress.current;
    const cam = sampleCam(p);
    sampleBg(p, bg);
    state.scene.background = bg;
    state.scene.fog = null;

    // rotation driven by scroll + tiny idle drift
    if (group.current) {
      group.current.rotation.y = p * Math.PI * 4.2 + state.clock.elapsedTime * 0.05;
      group.current.rotation.x = 0.12 + Math.sin(p * Math.PI * 2) * 0.08;
      const s = cam.scale;
      group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, s, 2.5, delta));
      group.current.position.y = THREE.MathUtils.lerp(0, -0.15, p);
    }

    // camera dolly + orbit, smoothly damped
    const cx = Math.sin(cam.orbit) * cam.dist;
    const cz = Math.cos(cam.orbit) * cam.dist;
    const target = new THREE.Vector3(cx, cam.height, cz);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.x, 2.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.y, 2.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.z, 2.2, delta);
    camera.lookAt(0, 0.1, 0);

    // lighting arc: bright studio → dramatic dark → soft return
    const dark = isDark(p) ? 1 : 0;
    if (keyRef.current) keyRef.current.intensity = THREE.MathUtils.lerp(1.4, 2.4, dark);
    if (rimRef.current) {
      rimRef.current.intensity = THREE.MathUtils.lerp(0.6, 3.2, dark);
      rimRef.current.position.x = Math.sin(p * 6.28) * 4;
    }

    // material morph in varieties segment
    lerpVarietyProps(p, props);
    if (mat.current) {
      mat.current.color.copy(props.color);
      mat.current.attenuationColor.copy(props.color);
      mat.current.roughness = props.roughness;
      mat.current.transmission = props.transmission;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          ref={mat}
          color="#ffffff"
          roughness={0.05}
          metalness={0}
          transmission={1}
          thickness={1.6}
          ior={1.54}
          attenuationDistance={2.2}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          flatShading
        />
      </mesh>
      {/* golden needles fade in only for rutilated segment */}
      <RutileFade progress={progress} />
      <pointLight ref={keyRef} position={[4, 5, 3]} intensity={1.4} color="#fff6ea" />
      <pointLight ref={rimRef} position={[-4, 1, -3]} intensity={0.6} color="#cfe0ff" />
      <ambientLight intensity={0.5} />
      <ContactShadows position={[0, -1.75, 0]} opacity={0.25} scale={9} blur={2.8} far={4} color="#8a8478" />
      <Environment preset="city" />
    </group>
  );
}

function RutileFade({ progress }: { progress: R<number> }) {
  const g = useRef<THREE.Group>(null);
  const needles = useMemo(() => {
    let s = 42;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    return Array.from({ length: 22 }, () => ({
      pos: [(rnd() - 0.5) * 0.9, (rnd() - 0.5) * 1.8, (rnd() - 0.5) * 0.9] as [number, number, number],
      rot: [rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI] as [number, number, number],
      len: 0.5 + rnd() * 1.1,
    }));
  }, []);
  useFrame(() => {
    if (!g.current) return;
    // visible only near end of variety ramp (index ~6)
    const c = THREE.MathUtils.clamp((progress.current - 0.855) / 0.145, 0, 1);
    const target = THREE.MathUtils.smoothstep((c - 0.82) / 0.18, 0, 1);
    g.current.visible = target > 0.02;
    g.current.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m && "opacity" in m) {
        m.transparent = true;
        m.opacity = target;
      }
    });
  });
  return (
    <group ref={g} visible={false}>
      {needles.map((n, i) => (
        <mesh key={i} position={n.pos} rotation={n.rot}>
          <cylinderGeometry args={[0.008, 0.008, n.len, 5]} />
          <meshStandardMaterial color="#c9973f" metalness={0.85} roughness={0.25} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

export default function StoryCanvas({ progress }: { progress: ProgressRef }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0.4, 0.7, 5.2], fov: 36 }}
      gl={{ antialias: true, alpha: false }}
      style={{ position: "absolute", inset: 0 }}
    >
      <StoryCrystal progress={progress} />
    </Canvas>
  );
}
