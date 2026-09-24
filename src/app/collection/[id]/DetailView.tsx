"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { notFound } from "next/navigation";
import { getMineral, MINERALS } from "@/data/minerals";

const CrystalViewer = dynamic(() => import("@/components/Viewer/CrystalViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] md:h-[640px] rounded-3xl bg-[#f4f2ee] border hairline flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border border-ink/20 border-t-ink animate-spin" />
    </div>
  ),
});

const KNOWN = new Set(MINERALS.map((m) => m.id));

export default function DetailView({ id }: { id: string }) {
  const [science, setScience] = useState(true);
  if (!KNOWN.has(id)) return notFound();
  const mineral = getMineral(id);

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <Link href="/collection" className="text-[11px] tracking-[0.2em] uppercase text-stone2 hover:text-ink">← Collection</Link>
          <div className="mt-4">
            <CrystalViewer mineral={mineral} scienceMode={science} heightClass="h-[62vh] md:h-[74vh]" />
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="glass rounded-2xl p-6 border hairline">
            <p className="text-[11px] tracking-[0.3em] text-stone2">{mineral.code}</p>
            <h1 className="text-3xl font-extralight mt-2">{mineral.name.toUpperCase()}</h1>
            <p className="text-stone2 font-light mt-1">{mineral.varietyOf}</p>
            <p className="text-xl font-light mt-2">{mineral.formula}</p>
            <span className="inline-block mt-3 text-[10px] tracking-[0.2em] uppercase bg-white/70 border hairline rounded-full px-3 py-1">{mineral.category}</span>
            <p className="mt-4 text-sm font-light leading-relaxed">{mineral.description}</p>
            <button
              onClick={() => setScience(!science)}
              className={`mt-5 w-full text-[11px] tracking-[0.18em] uppercase rounded-full px-4 py-2.5 border transition-colors ${science ? "bg-ink text-pearl border-ink" : "border-ink/20 hover:bg-ink hover:text-pearl"}`}
            >
              {science ? "● Scientific mode on" : "○ Scientific mode"}
            </button>
            <dl className="mt-6 space-y-3 text-sm font-light">
              {[
                ["Crystal system", mineral.crystalSystem],
                ["Hardness", mineral.hardness],
                ["Density", mineral.density],
                ["Colour", mineral.color],
                ["Transparency", mineral.transparency],
                ["Lustre", mineral.lustre],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b hairline pb-2">
                  <dt className="text-stone2 shrink-0">{k}</dt><dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 space-y-4 text-sm font-light">
              <div><p className="text-[11px] tracking-[0.2em] uppercase text-stone2 mb-1">Formation</p><p className="leading-relaxed">{mineral.formation}</p></div>
              <div><p className="text-[11px] tracking-[0.2em] uppercase text-stone2 mb-1">Geology</p><p className="leading-relaxed">{mineral.geology}</p></div>
              <div><p className="text-[11px] tracking-[0.2em] uppercase text-stone2 mb-1">Main localities</p><p className="leading-relaxed">{mineral.localities}</p></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
