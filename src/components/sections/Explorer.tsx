"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MINERALS, getMineral } from "@/data/minerals";
import SectionReveal from "@/components/SectionReveal";

const CrystalViewer = dynamic(() => import("@/components/Viewer/CrystalViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] md:h-[600px] rounded-3xl bg-[#f4f2ee] border hairline flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border border-ink/20 border-t-ink animate-spin" />
    </div>
  ),
});

const EXPLORER_IDS = [
  "clear-quartz",
  "amethyst",
  "rose-quartz",
  "smoky-quartz",
  "citrine",
  "milky-quartz",
  "rutilated-quartz",
];

export default function Explorer({ compact = false }: { compact?: boolean }) {
  const [id, setId] = useState(EXPLORER_IDS[0]);
  const [science, setScience] = useState(false);
  const mineral = getMineral(id);
  const idx = EXPLORER_IDS.indexOf(id);

  return (
    <section id="explorer" className={`mx-auto max-w-[1500px] px-6 md:px-10 scroll-mt-16 ${compact ? "py-8 md:py-10" : "py-24 md:py-36"}`}>
      <SectionReveal className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone2">{compact ? "Interactive explorer" : "02 — Interactive explorer"}</p>
          <h2 className="text-4xl md:text-6xl font-extralight mt-3">Touch the specimen.</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setScience(!science)}
            className={`text-[11px] tracking-[0.2em] uppercase rounded-full px-5 py-2.5 border transition-colors ${science ? "bg-ink text-pearl border-ink" : "border-ink/20 hover:bg-ink hover:text-pearl"}`}
          >
            {science ? "● Scientific" : "○ Scientific"}
          </button>
          <Link href="/compare" className="text-[11px] tracking-[0.2em] uppercase rounded-full px-5 py-2.5 bg-ink text-pearl">
            Compare →
          </Link>
        </div>
      </SectionReveal>

      <div className="grid lg:grid-cols-[240px_1fr_300px] gap-6 items-stretch">
        {/* variety index */}
        <nav className="order-2 lg:order-1 flex lg:flex-col gap-1 overflow-x-auto no-scrollbar" aria-label="Varieties">
          {EXPLORER_IDS.map((vid, i) => {
            const m = MINERALS.find((x) => x.id === vid)!;
            const active = vid === id;
            return (
              <button
                key={vid}
                onClick={() => setId(vid)}
                className={`group flex items-baseline gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap transition-all ${active ? "bg-ink text-pearl" : "hover:bg-ink/5"}`}
              >
                <span className={`text-[11px] tracking-[0.2em] ${active ? "opacity-60" : "text-stone2"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs tracking-[0.18em] uppercase">{m.name}</span>
              </button>
            );
          })}
        </nav>

        {/* viewer with animated mineral swap */}
        <div className="order-1 lg:order-2 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <CrystalViewer mineral={mineral} scienceMode={science} heightClass="h-[480px] md:h-[600px]" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* data panel */}
        <aside className="order-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-2xl p-6 border hairline lg:sticky lg:top-24"
            >
              <p className="text-[11px] tracking-[0.3em] text-stone2">{mineral.code}</p>
              <h3 className="text-2xl font-extralight mt-2">{mineral.name.toUpperCase()}</h3>
              <p className="text-stone2 font-light mt-1">{mineral.formula}</p>
              <dl className="mt-5 space-y-2.5 text-sm font-light">
                {[
                  ["System", mineral.crystalSystem],
                  ["Hardness", mineral.hardness],
                  ["Colour", mineral.color],
                  ["Transparency", mineral.transparency],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b hairline pb-2">
                    <dt className="text-stone2">{k}</dt><dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs font-light text-stone2 leading-relaxed">{mineral.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-stone2">{String(idx + 1).padStart(2, "0")} / {String(EXPLORER_IDS.length).padStart(2, "0")}</span>
                <div className="flex gap-2">
                  <button
                    aria-label="Previous mineral"
                    onClick={() => setId(EXPLORER_IDS[(idx - 1 + EXPLORER_IDS.length) % EXPLORER_IDS.length])}
                    className="w-9 h-9 rounded-full border border-ink/20 hover:bg-ink hover:text-pearl transition-colors"
                  >←</button>
                  <button
                    aria-label="Next mineral"
                    onClick={() => setId(EXPLORER_IDS[(idx + 1) % EXPLORER_IDS.length])}
                    className="w-9 h-9 rounded-full border border-ink/20 hover:bg-ink hover:text-pearl transition-colors"
                  >→</button>
                </div>
              </div>
              <Link href={`/collection/${mineral.id}`} className="block mt-5 text-center text-[11px] tracking-[0.2em] uppercase rounded-full bg-ink text-pearl px-4 py-2.5">
                Open full file →
              </Link>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </section>
  );
}
