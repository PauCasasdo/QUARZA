"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isDark, sampleVariety, VARIETIES } from "@/animations/story";
import { prefersReducedMotion } from "@/lib/quality";

gsap.registerPlugin(ScrollTrigger);

const StoryCanvas = dynamic(() => import("@/components/3d/StoryCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#FAF9F7]" />,
});

export default function StoryExperience() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [dark, setDark] = useState(false);
  const [varIndex, setVarIndex] = useState(0);
  const [reduced] = useState(() => prefersReducedMotion());
  const darkRef = useRef(false);
  const varRef = useRef(0);

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            progress.current = self.progress;
            const d = isDark(self.progress);
            if (d !== darkRef.current) {
              darkRef.current = d;
              setDark(d);
            }
            const { index } = sampleVariety(self.progress);
            if (index !== varRef.current) {
              varRef.current = index;
              setVarIndex(index);
            }
          },
        },
      });

      // Cinematic text choreography — one scrubbed timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      const scene = (sel: string, at: number, dur = 0.09) => {
        tl.fromTo(
          sel,
          { opacity: 0, y: 60, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: dur, ease: "none" },
          at
        );
        tl.to(
          sel,
          { opacity: 0, y: -60, filter: "blur(8px)", duration: dur, ease: "none" },
          at + dur + 0.02
        );
      };

      // hero out early
      tl.to("[data-scene='hero']", { opacity: 0, y: -80, filter: "blur(10px)", duration: 0.07, ease: "none" }, 0.02);
      scene("[data-scene='form']", 0.13);
      scene("[data-scene='shape']", 0.29);
      scene("[data-scene='structure']", 0.43);
      scene("[data-scene='light']", 0.58);
      scene("[data-scene='macro']", 0.71);
      // varieties finale stays
      tl.fromTo(
        "[data-scene='varieties']",
        { opacity: 0, y: 60, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.06, ease: "none" },
        0.875
      );
      // staggered structure rows
      tl.fromTo(
        "[data-row]",
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.03, stagger: 0.025, ease: "none" },
        0.44
      );
      // light words stagger
      tl.fromTo(
        "[data-word]",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.025, stagger: 0.02, ease: "none" },
        0.62
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const ink = dark ? "text-[#F4F2EE]" : "text-ink";
  const sub = dark ? "text-white/60" : "text-stone2";

  return (
    <section ref={root} className="relative" style={{ height: reduced ? "auto" : "820vh" }} id="story">
      <div className={`${reduced ? "relative" : "sticky top-0"} h-screen overflow-hidden`}>
        <StoryCanvas progress={progress} />

        {/* HERO */}
        <div data-scene="hero" className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none ${ink}`}>
          <p className="text-[11px] tracking-[0.5em] uppercase opacity-70">Quarza presents</p>
          <h1 className="mt-4 text-[18vw] md:text-[9rem] font-extralight tracking-[0.18em] leading-none">QUARZA</h1>
          <p className="mt-4 text-xs md:text-sm tracking-[0.45em] uppercase opacity-70">The world of quartz</p>
          <p className="absolute bottom-10 text-[11px] tracking-[0.3em] uppercase opacity-50 animate-bounce">Scroll ↓</p>
        </div>

        {/* FORM */}
        <div data-scene="form" className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 ${ink}`}>
          <h2 className="text-5xl md:text-8xl font-extralight tracking-[0.08em] text-center px-6">FORMED BY TIME.</h2>
        </div>

        {/* SHAPE */}
        <div data-scene="shape" className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 ${ink}`}>
          <h2 className="text-3xl md:text-6xl font-extralight tracking-wide text-center px-6 max-w-4xl">A CRYSTAL IS MORE THAN A SHAPE.</h2>
        </div>

        {/* STRUCTURE */}
        <div data-scene="structure" className={`absolute inset-0 pointer-events-none opacity-0 ${ink}`}>
          <div className="absolute right-6 md:right-24 top-1/2 -translate-y-1/2 max-w-xs">
            <p className="text-[11px] tracking-[0.35em] uppercase opacity-60">Crystalline structure</p>
            <div className="mt-4 space-y-4">
              <p data-row className="text-4xl md:text-5xl font-extralight">SiO₂</p>
              <p data-row className="text-sm font-light opacity-80">Trigonal crystal system</p>
              <p data-row className="text-sm font-light opacity-80">Mohs hardness: 7</p>
            </div>
          </div>
        </div>

        {/* LIGHT */}
        <div data-scene="light" className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0 ${ink}`}>
          <h2 className="text-4xl md:text-7xl font-extralight tracking-wide text-center px-6">LIGHT REVEALS THE CRYSTAL.</h2>
          <div className="mt-8 flex gap-6 md:gap-10 text-xs md:text-sm tracking-[0.3em] uppercase opacity-80">
            <span data-word>Transparency.</span>
            <span data-word>Refraction.</span>
            <span data-word>Inclusions.</span>
          </div>
        </div>

        {/* MACRO */}
        <div data-scene="macro" className={`absolute inset-0 pointer-events-none opacity-0 ${ink}`}>
          <MacroLabel className="left-[12%] top-[30%]" text="Crystal faces" sub="m {10-10}" />
          <MacroLabel className="right-[12%] top-[38%]" text="Inclusions" sub="fluids · traces" />
          <MacroLabel className="left-[16%] bottom-[28%]" text="Fractures" sub="conchoidal" />
          <MacroLabel className="right-[16%] bottom-[24%]" text="Growth patterns" sub="striations ⊥ c" />
        </div>

        {/* VARIETIES */}
        <div data-scene="varieties" className={`absolute inset-0 pointer-events-none opacity-0 ${ink}`}>
          <div className="absolute left-1/2 top-[16%] -translate-x-1/2 text-center">
            <p className="text-[11px] tracking-[0.4em] uppercase opacity-60">One mineral. Many forms.</p>
          </div>
          <div className="absolute left-1/2 bottom-[9%] -translate-x-1/2 text-center w-full px-6">
            <p key={varIndex} className="text-3xl md:text-6xl font-extralight tracking-[0.1em]">
              {VARIETIES[varIndex].name}
            </p>
            <p className={`mt-3 text-xs md:text-sm tracking-[0.25em] uppercase ${sub}`}>
              {VARIETIES[varIndex].formula} · {VARIETIES[varIndex].note}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {VARIETIES.map((v, i) => (
                <span
                  key={v.name}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === varIndex ? 28 : 12,
                    background: i === varIndex ? "#1a1a1a" : "rgba(0,0,0,0.18)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {reduced && (
        <div className="px-6 py-20 text-center">
          <h1 className="text-6xl font-extralight tracking-[0.18em]">QUARZA</h1>
          <p className="mt-3 text-xs tracking-[0.4em] uppercase text-stone2">The world of quartz</p>
          <p className="mt-6 text-stone2 font-light">Reduced-motion mode: scroll narrative simplified.</p>
        </div>
      )}
    </section>
  );
}

function MacroLabel({ className, text, sub }: { className: string; text: string; sub: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-current opacity-80" />
        <span className="h-px w-10 bg-current opacity-40" />
        <div>
          <p className="text-xs tracking-[0.25em] uppercase">{text}</p>
          <p className="text-[11px] font-light opacity-60">{sub}</p>
        </div>
      </div>
    </div>
  );
}
