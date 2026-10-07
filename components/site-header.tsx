"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#fitur", label: "Fitur", id: "fitur" },
  { href: "#cara-kerja", label: "Cara Kerja", id: "cara-kerja" },
  { href: "#perangkat", label: "Perangkat", id: "perangkat" },
  { href: "#tim", label: "Tim", id: "tim" },
];

export function SiteHeader() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => obs.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  const go =
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setOpen(false);
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-[#faf6ee]/95 backdrop-blur transition-all duration-300",
        scrolled
          ? "border-stone-200 shadow-[0_6px_24px_rgba(28,91,60,0.10)]"
          : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/taniverify-logo.webp"
            alt="Logo TaniVerify"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg transition-transform duration-300 hover:rotate-12"
          />
          <span className="text-lg font-bold text-stone-800">TaniVerify</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={go(l.href)}
                className={cn(
                  "group relative rounded-full px-4 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "font-semibold text-[#1c5b3c]"
                    : "text-stone-600 hover:bg-[#1c5b3c]/8 hover:text-[#1c5b3c]"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute inset-x-4 bottom-1 h-0.5 origin-left rounded-full bg-[#1c5b3c] transition-transform duration-300",
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#1c5b3c] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#123c29] hover:shadow-lg"
          >
            Dashboard Simulasi
          </Link>
          <button
            className="rounded-lg p-2 text-stone-700 transition-colors hover:bg-stone-200/60 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* panel menu mobile */}
      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-in-out md:hidden",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="space-y-1 px-4 pb-5">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={go(l.href)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-[#1c5b3c]/10 font-semibold text-[#1c5b3c]"
                    : "text-stone-600 hover:bg-stone-200/50"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full bg-[#1c5b3c] transition-opacity",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
