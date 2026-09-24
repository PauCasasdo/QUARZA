"use client";
import { Suspense, useRef, useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Mineral } from "@/data/minerals";
import QuartzCrystal from "./QuartzCrystal";
import Hotspots from "./Hotspots";
import { prefersReducedMotion, webglAvailable } from "@/lib/quality";

const CAM_HOME = { pos: [2.6, 1.4, 3.4] as [number, number, number], target: [0, 0.15, 0] as [number, number, number] };

/**
 * Entering/exiting fullscreen resizes the wrapper abruptly and the WebGL
 * renderer can keep the previous drawing-buffer size + camera aspect
 * (stretched or low-res image). After the layout settles, force both
 * back in sync with the container.
 */
function FullscreenResizer() {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    const fix = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const parent = gl.domElement.parentElement as HTMLElement | null;
          const w = parent?.clientWidth || size.width;
          const h = parent?.clientHeight || size.height;
          if (!w || !h) return;
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.setSize(w, h, false);
          gl.domElement.style.width = `${w}px`;
          gl.domElement.style.height = `${h}px`;
          if (camera instanceof THREE.PerspectiveCamera) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
          }
        });
      });
    };
    document.addEventListener("fullscreenchange", fix);
    window.addEventListener("orientationchange", fix);
    return () => {
      document.removeEventListener("fullscreenchange", fix);
      window.removeEventListener("orientationchange", fix);
    };
  }, [gl, camera, size.width, size.height]);

  return null;
}

export default function CrystalViewer({
  mineral,
  scienceMode = false,
  autoRotateDefault = true,
  heightClass = "h-[520px] md:h-[640px]",
  syncToken,
  onCameraChange,
}: {
  mineral: Mineral;
  scienceMode?: boolean;
  autoRotateDefault?: boolean;
  heightClass?: string;
  syncToken?: { pos: [number, number, number]; target: [number, number, number]; n: number } | null;
  onCameraChange?: (pos: [number, number, number], target: [number, number, number]) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault && !prefersReducedMotion());
  const [pausedByUser, setPausedByUser] = useState(false);
  const [ready, setReady] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !webglAvailable()) setNoGL(true);
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, []);

  // external sync (compare mode)
  useEffect(() => {
    if (!syncToken || !controlsRef.current) return;
    const c = controlsRef.current;
    c.object.position.set(...syncToken.pos);
    c.target.set(...syncToken.target);
    c.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncToken?.n]);

  const handleStart = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setPausedByUser(true);
  }, []);

  const handleEnd = useCallback(() => {
    const c = controlsRef.current;
    if (c && onCameraChange) {
      const p = c.object.position;
      const t = c.target;
      onCameraChange([p.x, p.y, p.z], [t.x, t.y, t.z]);
    }
    // resume autorotate after 3s idle if toggle is on
    resumeTimer.current = setTimeout(() => setPausedByUser(false), 3000);
  }, [onCameraChange]);

  const reset = useCallback(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.object.position.set(...CAM_HOME.pos);
    c.target.set(...CAM_HOME.target);
    c.update();
  }, []);

  const zoom = useCallback((dir: 1 | -1) => {
    const c = controlsRef.current;
    if (!c) return;
    const p = c.object.position.clone();
    p.multiplyScalar(dir === 1 ? 0.85 : 1.18);
    const len = p.length();
    if (len < 1.6 || len > 10) return;
    c.object.position.copy(p);
    c.update();
  }, []);

  const fullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }, []);

  if (noGL) {
    return (
      <div className={`${heightClass} rounded-3xl bg-gradient-to-br from-white via-mist to-[#e3ddd4] flex items-center justify-center`}>
        <div className="text-center px-8">
          <div className="mx-auto w-28 h-40 bg-white/70 blur-[1px] shadow-2xl" style={{ clipPath: "polygon(50% 0, 100% 28%, 100% 72%, 50% 100%, 0 72%, 0 28%)" }} />
          <p className="mt-6 text-sm font-light text-stone2">WebGL no disponible — vista simplificada de {mineral.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`quarza-viewer relative ${heightClass} rounded-3xl overflow-hidden bg-[#f4f2ee] border hairline`}>
      {!ready && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#f4f2ee]">
          <div className="w-10 h-10 rounded-full border border-ink/20 border-t-ink animate-spin" />
          <p className="text-[11px] tracking-[0.25em] uppercase text-stone2">Preparando cristal…</p>
        </div>
      )}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: CAM_HOME.pos, fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.05;
        }}
      >
        <FullscreenResizer />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} />
        <Suspense fallback={null}>
          <QuartzCrystal mineral={mineral} />
          {scienceMode && <Hotspots mineral={mineral} />}
          <ContactShadows position={[0, -1.7, 0]} opacity={0.28} scale={8} blur={2.6} far={4} color="#8a8478" />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          target={CAM_HOME.target}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.75}
          minDistance={1.7}
          maxDistance={9}
          autoRotate={autoRotate && !pausedByUser}
          autoRotateSpeed={0.9}
          makeDefault
          onStart={handleStart}
          onEnd={handleEnd}
        />
      </Canvas>

      {/* discreet bottom control bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="glass rounded-full px-2 py-1.5 flex items-center gap-1 shadow-lg">
          <CtrlBtn label={autoRotate && !pausedByUser ? "Pausar rotación" : "Rotación auto"} active={autoRotate} onClick={() => setAutoRotate(!autoRotate)}>
            {autoRotate && !pausedByUser ? <PauseIcon /> : <RotateIcon />}
          </CtrlBtn>
          <CtrlBtn label="Acercar" onClick={() => zoom(1)}><PlusIcon /></CtrlBtn>
          <CtrlBtn label="Alejar" onClick={() => zoom(-1)}><MinusIcon /></CtrlBtn>
          <CtrlBtn label="Vista inicial" onClick={reset}><ResetIcon /></CtrlBtn>
          <CtrlBtn label="Pantalla completa" onClick={fullscreen}><ExpandIcon /></CtrlBtn>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-20">
        <span className="text-[10px] tracking-[0.22em] uppercase bg-white/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/60">
          BETA
        </span>
      </div>
    </div>
  );
}

function CtrlBtn({ children, label, onClick, active }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${active ? "bg-ink text-pearl" : "hover:bg-ink/10 text-ink"}`}
    >
      {children}
    </button>
  );
}

const RotateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></svg>
);
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
);
const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" /></svg>
);
const ResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /></svg>
);
const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></svg>
);
