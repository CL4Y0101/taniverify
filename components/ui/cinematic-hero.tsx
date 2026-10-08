// src/components/ui/cinematic-hero.tsx
"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .text-paper-shadow {
      color: #FAF6EE;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }

  .text-card-heading {
      color: #FFFFFF;
      text-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), 0 2px 4px rgba(0, 0, 0, 0.4);
  }

  .premium-depth-card {
      background: linear-gradient(145deg, #1C5B3C 0%, #0F2E20 100%);
      box-shadow:
          0 40px 100px -20px rgba(15, 46, 32, 0.55),
          0 20px 40px -20px rgba(15, 46, 32, 0.45),
          inset 0 1px 2px rgba(255, 255, 255, 0.18),
          inset 0 -2px 4px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.07) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .iphone-bezel {
      background: linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 60%, #2c2c2e 100%);
      box-shadow:
          inset 0 0 0 2px #48484a,
          inset 0 0 0 6px #000,
          0 40px 80px -15px rgba(0,0,0,0.55),
          0 15px 25px -5px rgba(0,0,0,0.45);
      transform-style: preserve-3d;
  }

  .iphone-screen {
      background: linear-gradient(180deg, #123c29 0%, #0b2417 100%);
      box-shadow: inset 0 2px 12px rgba(0,0,0,0.6);
  }

  .dynamic-island {
      background: #000;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
  }

  .hardware-btn {
      background: linear-gradient(90deg, #2E5B42 0%, #14301F 100%);
      box-shadow:
          -2px 0 5px rgba(0,0,0,0.6),
          inset -1px 0 1px rgba(255,255,255,0.12),
          inset 1px 0 2px rgba(0,0,0,0.6);
      border-left: 1px solid rgba(255,255,255,0.06);
  }

  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 45%);
  }

  .scanline {
      position: absolute; left: 8%; right: 8%; height: 2px;
      background: #D9A441;
      box-shadow: 0 0 8px rgba(217, 164, 65, 0.8);
      animation: scanline-move 2.6s ease-in-out infinite;
  }

  @keyframes scanline-move {
      0%, 100% { top: 10%; }
      50% { top: 84%; }
  }

  .widget-solid {
      background: #FAF6EE;
      box-shadow: 0 10px 24px rgba(0,0,0,0.35);
      border: 1px solid rgba(28, 91, 60, 0.25);
  }

  .floating-badge-solid {
      background: #FAF6EE;
      box-shadow:
          0 25px 50px -12px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(28, 91, 60, 0.2);
  }

  .btn-amber {
      background: #D9A441;
      color: #1A1207;
      box-shadow: 0 12px 24px -6px rgba(185, 134, 47, 0.55), inset 0 1px 1px rgba(255,255,255,0.35);
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-amber:hover {
      transform: translateY(-3px);
      background: #E2B155;
      box-shadow: 0 18px 32px -6px rgba(185, 134, 47, 0.6), inset 0 1px 1px rgba(255,255,255,0.35);
  }
  .btn-amber:active { transform: translateY(1px); }

  .btn-outline-paper {
      background: transparent;
      color: #FAF6EE;
      box-shadow: inset 0 0 0 2px rgba(250, 246, 238, 0.7);
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-outline-paper:hover {
      transform: translateY(-3px);
      background: rgba(250, 246, 238, 0.12);
  }
  .btn-outline-paper:active { transform: translateY(1px); }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 214;
      stroke-dashoffset: 214;
      stroke-linecap: round;
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

function IphoneMockup() {
  return (
    <div className="relative w-[270px] h-[570px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform">
      <div className="absolute top-[110px] -left-[3px] w-[3px] h-[28px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
      <div className="absolute top-[155px] -left-[3px] w-[3px] h-[52px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
      <div className="absolute top-[155px] -right-[3px] w-[3px] h-[80px] hardware-btn rounded-r-md z-0" aria-hidden="true" />

      <div className="iphone-screen relative m-2.5 rounded-[2.4rem] overflow-hidden flex-1 flex flex-col">
        <div className="dynamic-island absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-[22px] rounded-full z-20" aria-hidden="true" />
        <div className="screen-glare absolute inset-0 pointer-events-none z-10" aria-hidden="true" />

        <div className="flex items-center justify-between px-7 pt-3.5 text-[#FAF6EE] relative z-10">
          <span className="text-[13px] font-semibold tracking-wide">9:41</span>
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
              <rect x="0" y="7" width="3" height="4" rx="0.5" />
              <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
              <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" />
              <rect x="13" y="0" width="3" height="11" rx="0.5" opacity="0.35" />
            </svg>
            <svg width="15" height="11" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M1.5 4.5a10 10 0 0 1 13 0" />
              <path d="M4.5 7.5a6 6 0 0 1 7 0" />
              <circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            <svg width="24" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" opacity="0.4" />
              <rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" />
              <path d="M23.5 4v4a2.2 2.2 0 0 0 0-4z" fill="currentColor" opacity="0.4" />
            </svg>
          </span>
        </div>

        <div className="flex items-center gap-2.5 px-5 mt-4 relative z-10">
          <Image
            src="/images/taniverify-logo.webp"
            alt="Logo TaniVerify"
            width={36}
            height={36}
            className="h-9 w-9 rounded-[10px]"
          />
          <div>
            <p className="text-[#FAF6EE] text-[15px] font-bold leading-tight">TaniVerify</p>
            <p className="text-[#FAF6EE]/50 text-[11px]">Pemindai RFID</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#FAF6EE]/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            RC522
          </span>
        </div>

        <div className="mx-4 mt-4 rounded-2xl bg-white/[0.07] border border-white/10 p-4 relative z-10 overflow-hidden">
          <div className="scanline" aria-hidden="true" />
          <p className="text-[#FAF6EE]/50 text-[10px] tracking-[0.18em] font-semibold">UID TERBACA</p>
          <p className="text-[#FAF6EE] font-mono text-[17px] font-semibold mt-1">04:A3:2B:9C</p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#1C5B3C] px-3 py-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5.2" stroke="#fff" strokeWidth="1.4" />
              <path d="M3.8 6.2l1.6 1.6 2.8-3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white text-[13px] font-bold tracking-wide">ASLI</span>
          </div>
          <div className="mt-3 space-y-0.5 text-[12px] text-[#FAF6EE]/75">
            <p>Urea &middot; 50 kg</p>
            <p className="text-[#FAF6EE]/50">Batch TS-U-2026-041</p>
          </div>
        </div>

        <div className="mx-4 mt-3 rounded-2xl bg-[#D9A441] py-3 text-center relative z-10">
          <span className="text-[#1A1207] text-[14px] font-bold">Pindai Ulang</span>
        </div>

        <div className="mt-auto relative z-10">
          <div className="flex items-center justify-around border-t border-white/10 bg-black/25 px-6 py-2.5">
            <span className="flex flex-col items-center gap-1 text-[#FAF6EE]/40">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 10.5L10 3.5l7 7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 9.5V16h10V9.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[9px]">Beranda</span>
            </span>
            <span className="flex flex-col items-center gap-1 text-[#D9A441]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 7V3h4M17 13v4h-4M3 3l4 4M17 17l-4-4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="3.2" />
              </svg>
              <span className="text-[9px] font-semibold">Pindai</span>
            </span>
            <span className="flex flex-col items-center gap-1 text-[#FAF6EE]/40">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="10" cy="10" r="7" />
                <path d="M10 5.5V10l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[9px]">Riwayat</span>
            </span>
          </div>
          <div className="flex justify-center bg-black/25 pb-2 pt-1">
            <div className="w-28 h-[4px] rounded-full bg-white/80" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CinematicHero({
  brandName = "TaniVerify",
  tagline1 = "Pupuk asli,",
  tagline2 = "panen terjaga.",
  cardHeading = "Verifikasi di tangan.",
  cardDescription = (
    <>
      <span className="text-white font-semibold">TaniVerify</span> adalah purwarupa
      pemindai genggam berbasis ESP32-C6 dan modul RC522. Tempelkan ke tag RFID di
      karung pupuk, dan perangkat langsung memberi tahu asli atau palsu lewat LCD
      dan buzzer.
    </>
  ),
  metricValue = 2,
  metricLabel = "detik per pindai",
  ctaHeading = "Coba simulasinya.",
  ctaDescription = "Jalankan simulasi pemindai di dashboard: pindai karung contoh, lihat hasil verifikasinya, lalu catat dosis untuk tiap petak sawah.",
  className,
  ...props
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    // cegah browser me-restore posisi scroll (mis. tombol back): hero harus
    // selalu mulai dari atas, kalau tidak teksnya ke-load dalam keadaan blur
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    let introTl: gsap.core.Timeline;
    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)" });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "expo.out" })
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4500",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(".hero-text-wrapper", { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        .fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .to(".progress-ring", { strokeDashoffset: 40, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(".counter-val", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out" }, "-=2.0")
        .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
        .fromTo(".card-left-text", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        .to({}, { duration: isMobile ? 0.9 : 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: isMobile ? 0.6 : 1.5 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        .to(".main-card", {
          width: isMobile ? "92vw" : "85vw",
          height: isMobile ? "92vh" : "85vh",
          borderRadius: isMobile ? "32px" : "40px",
          ease: "expo.inOut",
          duration: 1.8
        }, "pullback")
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);

    // Kalau halaman di-restore dari bfcache (tombol back), React tidak
    // me-remount sehingga inline style GSAP yang basi (hero blur/fade dari
    // posisi scroll sebelum pergi) tetap nempel: reset paksa di sini.
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      introTl.restart();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      ctx.revert();
    };
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#faf6ee] text-stone-800 font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />

      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform">
        <h1 className="text-track gsap-reveal text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight leading-[1.06] mb-2 text-[#1c5b3c]">
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter leading-[1.06] text-stone-800">
          {tagline2}
        </h1>
      </div>

      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-[#1c5b3c]">
          {ctaHeading}
        </h2>
        <p className="text-stone-600 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/dashboard" className="btn-amber flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg">
            Buka Dashboard Simulasi
          </Link>
          <a href="#cara-kerja" className="btn-outline-paper flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg text-[#1c5b3c]! shadow-[inset_0_0_0_2px_rgba(28,91,60,0.6)]! hover:bg-[#1c5b3c]/5!">
            Cara Kerja
          </a>
        </div>
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">

            <div className="card-left-text gsap-reveal order-1 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left z-20 w-full">
              <h2 className="text-card-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {cardHeading}
              </h2>
              <p className="text-[#FAF6EE]/85 text-base md:text-lg leading-relaxed max-w-md">
                {cardDescription}
              </p>
              <div className="phone-widget gsap-reveal widget-solid rounded-xl px-4 py-3 mt-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1c5b3c]" aria-hidden="true" />
                <span className="text-sm font-medium text-stone-700">RC522 terhubung</span>
              </div>
              <div className="phone-widget gsap-reveal widget-solid rounded-xl px-4 py-3 mt-3 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441]" aria-hidden="true" />
                <span className="text-sm font-medium text-stone-700">Daftar UID tersimpan lokal</span>
              </div>
            </div>

            <div className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[380px] lg:h-[560px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.72] md:scale-90 lg:scale-100">
                <div ref={mockupRef} className="will-change-transform">
                  <IphoneMockup />
                </div>
              </div>

              <div className="floating-badge gsap-reveal floating-badge-solid absolute top-8 -left-2 md:left-6 rounded-xl px-4 py-3 z-20 flex items-center gap-3">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(28,91,60,0.15)" strokeWidth="8" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#D9A441" strokeWidth="8" className="progress-ring" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#1c5b3c]">
                    <span className="counter-val">0</span>
                  </span>
                </div>
                <p className="text-xs text-stone-600 max-w-[90px]">{metricLabel}</p>
              </div>
              <div className="floating-badge gsap-reveal floating-badge-solid absolute bottom-10 -right-2 md:right-6 rounded-xl px-4 py-3 z-20">
                <p className="text-sm font-bold text-stone-800">Buzzer + LCD</p>
                <p className="text-xs text-stone-600">status terbaca langsung</p>
              </div>
            </div>

            <div className="card-right-text gsap-reveal order-3 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="text-card-heading text-6xl md:text-[5rem] lg:text-[6.5rem] font-black uppercase tracking-tighter lg:mt-0">
                {brandName}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
