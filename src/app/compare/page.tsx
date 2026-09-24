"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MINERALS, getMineral } from "@/data/minerals";

const CrystalViewer = dynamic(() => import("@/components/Viewer/CrystalViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-3xl bg-[#f4f2ee] border hairline flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border border-ink/20 border-t-ink animate-spin" />
    </div>
  ),
});

const ROWS: { key: string; label: string; get: (m: ReturnType<typeof getMineral>) => string }[] = [
  { key: "formula", label: "Chemical composition", get: (m) => m.formula },
  { key: "system", label: "Crystal system", get: (m) => m.crystalSystem },
  { key: "hardness", label: "Hardness", get: (m) => m.hardness },
  { key: "density", label: "Density", get: (m) => m.density },
  { key: "color", label: "Colour", get: (m) => m.color },
  { key: "transp", label: "Transparency", get: (m) => m.transparency },
  { key: "formation", label: "Geological formation", get: (m) => m.formation },
  { key: "local", label: "Main deposits", get: (m) => m.localities },
];

export default function ComparePage() {
  const [leftId, setLeftId] = useState("clear-quartz");
  const [rightId, setRightId] = useState("amethyst");
  const [sync, setSync] = useState(true);
  const [syncToken, setSyncToken] = useState<{ pos: [number, number, number]; target: [number, number, number]; n: number } | null>(null);

  const left = getMineral(leftId);
  const right = getMineral(rightId);

  const pushSync = (pos: [number, number, number], target: [number, number, number]) => {
    if (!sync) return;
    setSyncToken((t) => ({ pos, target, n: (t?.n ?? 0) + 1 }));
  };

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-12">
        <p className="text-[11px] tracking-[0.3em] uppercase text-stone2">Comparator</p>
        <h1 className="text-3xl md:text-5xl font-extralight mt-3">Two minerals, one gaze</h1>
        <p className="mt-4 max-w-2xl font-light text-stone2 leading-relaxed">
          Rotate and zoom each specimen independently. Enable camera sync to observe both from the
          same angle. Identical properties stay discreet; differences are gently highlighted.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Selector value={leftId} onChange={setLeftId} label="Left specimen" />
          <button
            onClick={() => { setLeftId(rightId); setRightId(leftId); }}
            className="text-[11px] tracking-[0.18em] uppercase rounded-full border border-ink/20 px-4 py-2.5 hover:bg-ink hover:text-pearl transition-colors"
          >
            ⇄ Swap
          </button>
          <Selector value={rightId} onChange={setRightId} label="Right specimen" />
          <button
            onClick={() => setSync(!sync)}
            className={`text-[11px] tracking-[0.18em] uppercase rounded-full px-4 py-2.5 border transition-colors ${sync ? "bg-ink text-pearl border-ink" : "border-ink/20"}`}
          >
            {sync ? "● Cameras synced" : "○ Sync cameras"}
          </button>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-stone2 mb-2">{left.code} — {left.name}</p>
            <CrystalViewer mineral={left} heightClass="h-[420px] md:h-[520px]" syncToken={null} onCameraChange={pushSync} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-stone2 mb-2">{right.code} — {right.name}</p>
            <CrystalViewer mineral={right} heightClass="h-[420px] md:h-[520px]" syncToken={sync ? syncToken : null} />
          </div>
        </div>

        <div className="mt-10 rounded-2xl border hairline bg-white/70 overflow-hidden">
          <div className="grid grid-cols-[160px_1fr_1fr] md:grid-cols-[220px_1fr_1fr] text-[11px] tracking-[0.18em] uppercase text-stone2 border-b hairline">
            <div className="p-4">Property</div>
            <div className="p-4 border-l hairline">{left.name}</div>
            <div className="p-4 border-l hairline">{right.name}</div>
          </div>
          {ROWS.map((r) => {
            const a = r.get(left);
            const b = r.get(right);
            const same = a === b;
            return (
              <div key={r.key} className={`grid grid-cols-[160px_1fr_1fr] md:grid-cols-[220px_1fr_1fr] border-b hairline last:border-0 text-sm font-light ${same ? "opacity-60" : ""}`}>
                <div className="p-4 text-stone2 text-[11px] tracking-[0.15em] uppercase">{r.label}</div>
                <div className={`p-4 border-l hairline leading-relaxed ${same ? "" : "bg-[#faf6ef]"}`}>{a}</div>
                <div className={`p-4 border-l hairline leading-relaxed ${same ? "" : "bg-[#faf6ef] font-normal"}`}>{b}</div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs font-light text-stone2">Soft cream highlight = difference · muted rows = identical. No aggressive colours, per QUARZA guidelines.</p>
      </div>
    </div>
  );
}

function Selector({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm font-light">
      <span className="text-[11px] tracking-[0.18em] uppercase text-stone2">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border hairline bg-white px-4 py-2.5 text-sm font-light"
      >
        {MINERALS.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
    </label>
  );
}
