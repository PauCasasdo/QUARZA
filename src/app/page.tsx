"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import StoryExperience from "@/components/sections/StoryExperience";
import EditorialCollection from "@/components/sections/EditorialCollection";
import SectionReveal from "@/components/SectionReveal";

const CrystalViewer = dynamic(() => import("@/components/Viewer/CrystalViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-3xl bg-[#f4f2ee] border hairline flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border border-ink/20 border-t-ink animate-spin" />
    </div>
  ),
});

import { getMineral } from "@/data/minerals";

export default function HomePage() {
  return (
    <div className="pt-0">
      {/* 01 — STORY */}
      <StoryExperience />

      {/* 02 — EXPLORER TEASER */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 py-20 md:py-28">
        <SectionReveal>
          <Link href="/3d" className="group block rounded-3xl bg-ink text-pearl p-8 md:p-14 overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[11px] tracking-[0.35em] uppercase opacity-60">02 — Interactive explorer</p>
                <h2 className="text-4xl md:text-6xl font-extralight mt-3">Touch the specimen.</h2>
                <p className="mt-4 font-light opacity-70 leading-relaxed max-w-md">
                  Rotate, zoom, switch between seven varieties and activate scientific mode —
                  in a dedicated full-screen explorer.
                </p>
              </div>
              <span className="text-[11px] tracking-[0.25em] uppercase rounded-full bg-pearl text-ink px-8 py-3.5 group-hover:scale-105 transition-transform">
                Enter explorer →
              </span>
            </div>
          </Link>
        </SectionReveal>
      </section>

      {/* 03 — EDITORIAL COLLECTION */}
      <EditorialCollection />

      {/* 04 — COMPARE TEASER */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 pb-28">
        <SectionReveal className="rounded-3xl border hairline bg-white/70 p-8 md:p-14 grid md:grid-cols-2 gap-10 items-center overflow-hidden">
          <div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-stone2">04 — Compare</p>
            <h2 className="text-3xl md:text-5xl font-extralight mt-3">Amethyst vs Rose Quartz.</h2>
            <p className="mt-4 text-stone2 font-light leading-relaxed max-w-md">
              Two specimens side by side. Sync rotation and watch identical properties stay quiet
              while differences surface softly.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/compare" className="text-[11px] tracking-[0.2em] uppercase rounded-full bg-ink text-pearl px-6 py-3">
                Open comparator
              </Link>
              <Link href="/collection" className="text-[11px] tracking-[0.2em] uppercase rounded-full border border-ink/20 px-6 py-3 hover:bg-ink hover:text-pearl transition-colors">
                Collection
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MiniViewer id="amethyst" label="Amethyst" />
            <MiniViewer id="tigers-eye" label="Tiger's Eye" />
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}

function MiniViewer({ id, label }: { id: string; label: string }) {
  const m = getMineral(id);
  return (
    <div>
      <p className="text-[10px] tracking-[0.25em] uppercase text-stone2 mb-2">{label}</p>
      <CrystalViewer mineral={m} heightClass="h-[240px] md:h-[300px]" autoRotateDefault={true} />
    </div>
  );
}
