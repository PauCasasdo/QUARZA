import Link from "next/link";
import Explorer from "@/components/sections/Explorer";

export const metadata = { title: "3D Explorer — QUARZA" };

export default function Explorer3DPage() {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 pt-10">
        <p className="text-[11px] tracking-[0.35em] uppercase text-stone2">
          <Link href="/" className="hover:text-ink transition-colors">← Explore</Link>
          <span className="mx-3 opacity-40">/</span>3D Explorer
        </p>
      </div>
      <Explorer compact />
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 pb-24 -mt-6 flex flex-wrap gap-3">
        <Link href="/compare" className="text-[11px] tracking-[0.2em] uppercase rounded-full bg-ink text-pearl px-6 py-3">
          Compare specimens →
        </Link>
        <Link href="/collection" className="text-[11px] tracking-[0.2em] uppercase rounded-full border border-ink/20 px-6 py-3 hover:bg-ink hover:text-pearl transition-colors">
          Full collection
        </Link>
      </div>
    </div>
  );
}
