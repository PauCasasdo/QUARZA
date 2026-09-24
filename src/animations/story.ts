import * as THREE from "three";

/** Scroll-story keyframes. Progress p in 0..1 across the pinned story. */
export interface CamKey {
  p: number;
  dist: number;
  height: number;
  orbit: number; // radians around Y
  scale: number;
}

export const CAM_KEYS: CamKey[] = [
  { p: 0.0, dist: 5.2, height: 0.7, orbit: 0.0, scale: 1.0 },
  { p: 0.14, dist: 5.0, height: 0.6, orbit: 0.6, scale: 1.0 },
  { p: 0.28, dist: 4.2, height: 0.5, orbit: 1.2, scale: 1.05 },
  { p: 0.42, dist: 3.4, height: 0.4, orbit: 1.9, scale: 1.1 },
  { p: 0.56, dist: 3.6, height: 0.3, orbit: 2.8, scale: 1.12 },
  { p: 0.68, dist: 2.4, height: 0.2, orbit: 3.6, scale: 1.35 },
  { p: 0.8, dist: 1.7, height: 0.1, orbit: 4.2, scale: 1.9 },
  { p: 0.9, dist: 3.2, height: 0.5, orbit: 4.8, scale: 1.15 },
  { p: 1.0, dist: 4.4, height: 0.6, orbit: 5.4, scale: 1.05 },
];

export function sampleCam(p: number): { dist: number; height: number; orbit: number; scale: number } {
  const c = THREE.MathUtils.clamp(p, 0, 1);
  let i = 0;
  while (i < CAM_KEYS.length - 2 && CAM_KEYS[i + 1].p < c) i++;
  const a = CAM_KEYS[i];
  const b = CAM_KEYS[i + 1];
  const t = THREE.MathUtils.smoothstep((c - a.p) / Math.max(1e-5, b.p - a.p), 0, 1);
  return {
    dist: THREE.MathUtils.lerp(a.dist, b.dist, t),
    height: THREE.MathUtils.lerp(a.height, b.height, t),
    orbit: THREE.MathUtils.lerp(a.orbit, b.orbit, t),
    scale: THREE.MathUtils.lerp(a.scale, b.scale, t),
  };
}

/** Background ramp: warm white → pearl grey → dark → light with tint */
export const BG_STOPS: { p: number; color: string }[] = [
  { p: 0.0, color: "#FAF9F7" },
  { p: 0.45, color: "#F4F2EE" },
  { p: 0.58, color: "#D9D6D0" },
  { p: 0.68, color: "#3A3835" },
  { p: 0.78, color: "#171615" },
  { p: 0.88, color: "#EDEAE4" },
  { p: 1.0, color: "#FAF9F7" },
];

const _ca = new THREE.Color();
const _cb = new THREE.Color();
export function sampleBg(p: number, out: THREE.Color): THREE.Color {
  const c = THREE.MathUtils.clamp(p, 0, 1);
  let i = 0;
  while (i < BG_STOPS.length - 2 && BG_STOPS[i + 1].p < c) i++;
  const a = BG_STOPS[i];
  const b = BG_STOPS[i + 1];
  const t = THREE.MathUtils.smoothstep((c - a.p) / Math.max(1e-5, b.p - a.p), 0, 1);
  _ca.set(a.color);
  _cb.set(b.color);
  out.copy(_ca).lerp(_cb, t);
  return out;
}

export function isDark(p: number): boolean {
  return p > 0.6 && p < 0.85;
}

/** Variety ramp for final scene (7 macro varieties) */
export interface VarietyStop {
  name: string;
  color: string;
  roughness: number;
  transmission: number;
  formula: string;
  note: string;
}

export const VARIETIES: VarietyStop[] = [
  { name: "CLEAR QUARTZ", color: "#ffffff", roughness: 0.04, transmission: 1.0, formula: "SiO₂", note: "Almost pure silica" },
  { name: "AMETHYST", color: "#8b6fbf", roughness: 0.08, transmission: 0.92, formula: "SiO₂ · Fe⁴⁺", note: "Trace iron + irradiation" },
  { name: "ROSE QUARTZ", color: "#eec3c3", roughness: 0.18, transmission: 0.75, formula: "SiO₂ · Ti", note: "Fibrous inclusions" },
  { name: "SMOKY QUARTZ", color: "#6b5d4f", roughness: 0.1, transmission: 0.85, formula: "SiO₂ · Al", note: "Aluminium colour centres" },
  { name: "CITRINE", color: "#d9a94a", roughness: 0.08, transmission: 0.9, formula: "SiO₂ · Fe³⁺", note: "Iron, often heated amethyst" },
  { name: "MILKY QUARTZ", color: "#f2efe9", roughness: 0.38, transmission: 0.35, formula: "SiO₂ · fluids", note: "Clouded by fluid inclusions" },
  { name: "RUTILATED QUARTZ", color: "#f5f0e6", roughness: 0.06, transmission: 0.97, formula: "SiO₂ + TiO₂", note: "Golden rutile needles" },
];

export function sampleVariety(p: number): { v: VarietyStop; index: number; local: number } {
  // varieties live in p 0.86..1.0
  const c = THREE.MathUtils.clamp((p - 0.855) / 0.145, 0, 1);
  const fi = c * (VARIETIES.length - 1);
  const index = Math.min(VARIETIES.length - 1, Math.floor(fi));
  return { v: VARIETIES[index], index, local: fi - index };
}

export function lerpVarietyProps(p: number, out: { color: THREE.Color; roughness: number; transmission: number }): void {
  const c = THREE.MathUtils.clamp((p - 0.855) / 0.145, 0, 1);
  const fi = c * (VARIETIES.length - 1);
  const i = Math.min(VARIETIES.length - 2, Math.floor(fi));
  const t = THREE.MathUtils.smoothstep(fi - i, 0, 1);
  const a = VARIETIES[i];
  const b = VARIETIES[Math.min(VARIETIES.length - 1, i + 1)];
  _ca.set(a.color);
  _cb.set(b.color);
  out.color.copy(_ca).lerp(_cb, t);
  out.roughness = THREE.MathUtils.lerp(a.roughness, b.roughness, t);
  out.transmission = THREE.MathUtils.lerp(a.transmission, b.transmission, t);
}
