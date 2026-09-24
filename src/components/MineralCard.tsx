"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Mineral } from "@/data/minerals";

export default function MineralCard({ mineral, index = 0 }: { mineral: Mineral; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/collection/${mineral.id}`}
        className="group block rounded-2xl border hairline bg-white/70 overflow-hidden hover:shadow-xl transition-shadow"
      >
        <div className="aspect-[4/3] relative flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 40%, #ffffff 0%, #f1efec 55%, #e6e1d8 100%)` }}>
          <div
            className="w-20 h-28 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3 shadow-2xl"
            style={{
              background: `linear-gradient(135deg, #ffffff88 0%, ${mineral.render.color} 45%, #00000022 100%)`,
              clipPath: "polygon(50% 0, 100% 26%, 100% 70%, 50% 100%, 0 70%, 0 26%)",
              filter: "saturate(0.9)",
            }}
          />
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase bg-white/70 backdrop-blur px-2.5 py-1 rounded-full">
            {mineral.category}
          </span>
        </div>
        <div className="p-5">
          <p className="text-[10px] tracking-[0.25em] text-stone2">{mineral.code}</p>
          <h3 className="text-lg font-light mt-1 group-hover:underline underline-offset-4">{mineral.name}</h3>
          <p className="text-xs font-light text-stone2 mt-1">{mineral.formula} · {mineral.crystalSystem}</p>
        </div>
      </Link>
    </motion.div>
  );
}
