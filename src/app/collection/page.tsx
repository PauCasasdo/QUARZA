"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MINERALS } from "@/data/minerals";
import { prefersReducedMotion } from "@/lib/quality";

gsap.registerPlugin(ScrollTrigger);

export default function CollectionPage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-piece]").forEach((el) => {
        gsap.fromTo(
          el.querySelector("[data-visual]"),
          { scale: 1.1, clipPath: "inset(6% 6% 6% 6% round 24px)" },
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: 1 },
          }
        );
        gsap.fromTo(
          el.querySelector("[data-copy]"),
          { opacity: 0, x: 60 },
          {
            opacity: 1, x: 0, ease: "none",
            scrollTrigger: { trigger: el, start: "top 75%", end: "top 35%", scrub: 1 },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="pt-16">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 py-12">
        <p className="text-[11px] tracking-[0.35em] uppercase text-stone2">Collection — eleven silica stories</p>
        <h1 className="text-4xl md:text-6xl font-extralight mt-3">One mineral.<br />Many forms.</h1>
        <p className="mt-5 max-w-2xl font-light text-stone2 leading-relaxed">
          Macrocrystalline quartz, microcrystalline silica and replacement materials — correctly
          distinguished. Procedural renders, honestly labelled provisional until licensed scans arrive.
        </p>

        <div className="mt-16 space-y-24 md:space-y-36">
          {MINERALS.map((m, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={m.id} data-piece className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
                <Link
                  href={`/collection/${m.id}`}
                  data-visual
                  className={`group relative aspect-[4/5] md:aspect-[3/3.2] overflow-hidden rounded-3xl border hairline block ${flip ? "md:order-2" : ""}`}
                  style={{ background: `radial-gradient(ellipse at 50% 35%, #ffffff 0%, #f1efec 55%, ${m.render.color}55 100%)` }}
                >
                  <div
                    className="absolute inset-0 m-auto w-40 md:w-56 h-60 md:h-80 shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, #ffffff99 0%, ${m.render.color} 45%, #00000033 100%)`,
                      clipPath: "polygon(50% 0, 100% 26%, 100% 70%, 50% 100%, 0 70%, 0 26%)",
                    }}
                  />
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase bg-white/70 backdrop-blur px-3 py-1.5 rounded-full">
                    {m.category}
                  </span>
                  <span className="absolute bottom-4 right-4 text-[10px] tracking-[0.25em] uppercase bg-ink text-pearl px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Open 3D →
                  </span>
                </Link>
                <div data-copy className={flip ? "md:order-1 md:text-right" : ""}>
                  <p className="text-[11px] tracking-[0.3em] text-stone2">{m.code}</p>
                  <h2 className="text-4xl md:text-6xl font-extralight mt-3">{m.name.toUpperCase()}</h2>
                  <p className="mt-2 text-sm font-light text-stone2">{m.varietyOf}</p>
                  <p className="mt-4 font-light text-stone2 leading-relaxed max-w-md" style={flip ? { marginLeft: "auto" } : undefined}>
                    {m.description}
                  </p>
                  <p className="mt-3 text-xs tracking-[0.2em] uppercase text-stone2">
                    {m.formula} · {m.crystalSystem} · {m.hardness}
                  </p>
                  <Link href={`/collection/${m.id}`} className="inline-block mt-6 text-[11px] tracking-[0.25em] uppercase border-b border-ink pb-1">
                    Explore →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
