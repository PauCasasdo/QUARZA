"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Explore" },
  { href: "/3d", label: "3D" },
  { href: "/collection", label: "Collection" },
  { href: "/compare", label: "Compare" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? Math.min(1, y / h) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={clsx(
          "transition-all duration-500 border-b",
          scrolled
            ? "bg-white/55 backdrop-blur-xl border-[#E8E4DE] shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            : "bg-transparent border-transparent"
        )}
      >
        <div
          className={clsx(
            "mx-auto max-w-[1500px] px-6 md:px-10 flex items-center justify-between transition-all duration-500",
            scrolled ? "h-12" : "h-16"
          )}
        >
          <Link
            href="/"
            className={clsx(
              "font-light transition-all duration-500",
              scrolled ? "tracking-[0.28em] text-[13px]" : "tracking-[0.35em] text-sm"
            )}
          >
            QUARZA
          </Link>
          <nav className="flex items-center gap-5 md:gap-9" aria-label="Primary">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={clsx(
                    "group relative text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-light transition-colors",
                    active ? "text-ink" : "text-stone2 hover:text-ink"
                  )}
                >
                  {l.label}
                  <span
                    className={clsx(
                      "absolute -bottom-1 left-0 h-px bg-ink transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
        {/* scroll progress hairline */}
        <div ref={bar} className="h-px bg-ink/70 origin-left" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}
