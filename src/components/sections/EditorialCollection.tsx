"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MINERALS } from "@/data/minerals";
import { prefersReducedMotion } from "@/lib/quality";

gsap.registerPlugin(ScrollTrigger);

const FEATURED = ["amethyst", "rose-quartz", "smoky-quartz", "citrine", "tigers-eye", "agate"];

export default function EditorialCollection() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-piece]").forEach((el) => {
        gsap.fromTo(
          el.querySelector("[data-visual]"),
          { scale: 1.12, clipPath: "inset(6% 6% 6% 6% round 24px)" },
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
            opacity: 1,
            x: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 75%", end: "top 35%", scrub: 1 },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="collection" className="mx-auto max-w-[1500px] px-6 md:px-10 py-24 md:py-36 scroll-mt-16">
      <p className="text-[11px] tracking-[0.35em] uppercase text-stone2">03 — Collection</p>
      <h2 className="text-4xl md:text-6xl font-extralight mt-3 max-w-3xl">A gallery with room to breathe.</h2>

      <div className="mt-16 space-y-24 md:space-y-36">
        {FEATURED.map((fid, i) => {
          const m = MINERALS.find((x) => x.id === fid)!;
          const flip = i % 2 === 1;
          return (
            <article key={fid} data-piece className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${flip ? "" : ""}`}>
              <div data-visual className={`relative aspect-[4/5] md:aspect-[3/3.4] overflow-hidden rounded-3xl border hairline ${flip ? "md:order-2" : ""}`}
                style={{ background: `radial-gradient(ellipse at 50% 35%, #ffffff 0%, #f1efec 55%, ${m.render.color}55 100%)` }}>
                <div
                  className="absolute inset-0 m-auto w-40 md:w-56 h-60 md:h-80 shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, #ffffff99 0%, ${m.render.color} 45%, #00000033 100%)`,
                    clipPath: "polygon(50% 0, 100% 26%, 100% 70%, 50% 100%, 0 70%, 0 26%)",
                  }}
                />
                <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase bg-white/70 backdrop-blur px-3 py-1.5 rounded-full">
                  {m.category}
                </span>
              </div>
              <div data-copy className={flip ? "md:order-1 md:text-right" : ""}>
                <p className="text-[11px] tracking-[0.3em] text-stone2">{m.code}</p>
                <h3 className="text-4xl md:text-6xl font-extralight mt-3 tracking-wide">{m.name.toUpperCase()}</h3>
                <p className="mt-4 text-stone2 font-light leading-relaxed max-w-md md:ml-0" style={flip ? { marginLeft: "auto" } : undefined}>
                  {m.description} {m.localities.split("·")[0].trim()} and beyond.
                </p>
                <p className="mt-3 text-xs tracking-[0.2em] uppercase text-stone2">{m.formula} · {m.hardness}</p>
                <Link href={`/collection/${m.id}`} className="inline-block mt-6 text-[11px] tracking-[0.25em] uppercase border-b border-ink pb-1 hover:opacity-60 transition-opacity">
                  Explore →
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-20 text-center">
        <Link href="/collection" className="inline-block text-[11px] tracking-[0.25em] uppercase rounded-full bg-ink text-pearl px-8 py-3.5">
          View all eleven specimens
        </Link>
      </div>
    </section>
  );
}
