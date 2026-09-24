"use client";
import { Html } from "@react-three/drei";
import type { Mineral } from "@/data/minerals";
import { useState } from "react";

export default function Hotspots({ mineral }: { mineral: Mineral }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <group>
      {mineral.hotspots.map((h) => (
        <group key={h.id} position={h.position}>
          <mesh>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#1a1a1a" transparent opacity={0.85} depthTest={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.35} depthWrite={false} />
          </mesh>
          <Html center distanceFactor={9} zIndexRange={[20, 0]}>
            <div className="relative">
              <button
                onClick={() => setOpen(open === h.id ? null : h.id)}
                aria-label={h.title}
                className="w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-ink text-pearl text-[10px] leading-none flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                {open === h.id ? "×" : "+"}
              </button>
              {open === h.id && (
                <div className="absolute left-4 -top-4 w-64 glass rounded-xl p-4 shadow-xl text-left">
                  <p className="text-[11px] tracking-[0.18em] uppercase mb-1">{h.title}</p>
                  <p className="text-xs font-light leading-relaxed text-stone2">{h.body}</p>
                </div>
              )}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
