import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t hairline bg-pearl/80">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-12 grid md:grid-cols-3 gap-8 text-sm font-light">
        <div>
          <p className="tracking-[0.35em] text-xs mb-4">QUARZA</p>
          <p className="text-stone2 leading-relaxed max-w-xs">
            Una experiencia digital inmersiva dedicada al cuarzo. Geometrías
            procedurales provisionales — arquitectura lista para modelos GLB
            con licencia.
          </p>
        </div>
        <div className="text-stone2 space-y-2">
          <p className="text-ink tracking-[0.2em] text-[11px] uppercase mb-3">Secciones</p>
          <Link className="block hover:text-ink" href="/">Explore</Link>
          <Link className="block hover:text-ink" href="/3d">3D Explorer</Link>
          <Link className="block hover:text-ink" href="/collection">Collection</Link>
          <Link className="block hover:text-ink" href="/compare">Compare</Link>
        </div>
        <div className="text-stone2">
          <p className="text-ink tracking-[0.2em] text-[11px] uppercase mb-3">Nota científica</p>
          <p className="leading-relaxed">
            Propiedades según Mindat.org e IMA. No se presentan geometrías
            aproximadas como escaneos reales.
          </p>
        </div>
      </div>
    </footer>
  );
}
