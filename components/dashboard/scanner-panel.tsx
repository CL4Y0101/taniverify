"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { simulateScan, type ScanRecord } from "@/lib/simulation";
import { cn } from "@/lib/utils";

const Device3D = dynamic(
  () => import("@/components/dashboard/device-3d").then((m) => m.Device3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-sm text-emerald-100/40">memuat model 3D...</p>
      </div>
    ),
  }
);

type Phase = "idle" | "scanning" | "done";

interface ScannerPanelProps {
  onScan: (record: ScanRecord) => void;
}

export function ScannerPanel({ onScan }: ScannerPanelProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanRecord | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startScan = () => {
    if (phase === "scanning") return;
    setPhase("scanning");
    setProgress(0);
    setResult(null);

    const started = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - started;
      const pct = Math.min(Math.round((elapsed / 1800) * 100), 100);
      setProgress(pct);
      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        const record = simulateScan();
        setResult(record);
        setPhase("done");
        onScan(record);
      }
    }, 60);
  };

  const isGenuine = result?.verdict === "asli";

  return (
    <div className="overflow-hidden rounded-2xl bg-[#0b1f16] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <p className="text-xs font-bold tracking-[0.22em] text-amber">
          PANEL PEMINDAI
        </p>
        <span className="rounded bg-amber/15 px-2 py-0.5 text-[11px] font-bold tracking-wide text-amber">
          SIMULASI
        </span>
      </div>

      <div className="relative h-[330px] md:h-[360px]">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1c5b3c]/40 blur-3xl"
          aria-hidden="true"
        />
        <Device3D
          phase={phase}
          progress={progress}
          result={result ? { verdict: result.verdict, uid: result.uid } : null}
          onScanRequest={startScan}
        />
        <p className="pointer-events-none absolute bottom-1 left-0 right-0 text-center font-mono text-[11px] text-emerald-100/35">
          seret untuk memutar &middot; klik tombol kuning untuk memindai
        </p>
      </div>

      <div className="relative min-h-[120px] px-5 pb-1">
        {phase === "idle" && (
          <div className="font-mono text-[13px] leading-6 text-emerald-100/60">
            <p>&gt; RC522 siap.</p>
            <p>&gt; Dekatkan tag RFID ke pemindai,</p>
            <p>
              &gt; lalu tekan <span className="text-amber">PINDAI</span>
              <span className="cursor-blink" aria-hidden="true" />
            </p>
          </div>
        )}

        {phase === "scanning" && (
          <div className="font-mono text-[13px] leading-6">
            <p className="text-emerald-100/80">
              &gt; Membaca UID...{" "}
              <span className="text-amber tabular-nums">{progress}%</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-amber transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {phase === "done" && result && (
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "rounded-md px-3 py-1 text-sm font-bold tracking-wide text-white",
                  isGenuine ? "bg-field" : "bg-red-600"
                )}
              >
                {isGenuine ? "ASLI" : "PALSU"}
              </span>
              <span className="font-mono text-[15px] text-amber">{result.uid}</span>
            </div>

            {isGenuine && result.sack ? (
              <dl className="mt-4 space-y-1.5 font-mono text-[13px]">
                {[
                  ["merk", result.sack.merk],
                  ["jenis", `${result.sack.jenis} · ${result.sack.beratKg} kg`],
                  ["batch", result.sack.batch],
                  ["produksi", result.sack.tglProduksi],
                  ["distributor", result.sack.distributor],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="w-24 shrink-0 text-emerald-100/40">{k}</dt>
                    <dd className="text-emerald-50">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="mt-4 font-mono text-[13px] leading-6">
                <p className="text-red-400">&gt; UID tidak terdaftar.</p>
                <p className="text-red-300/80">{result.reason}</p>
                <p className="mt-2 text-emerald-100/50">
                  &gt; Jangan gunakan pupuk ini. Laporkan ke distributor atau
                  kelompok tani.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={startScan}
          disabled={phase === "scanning"}
          className={cn(
            "w-full rounded-xl py-4 text-lg font-bold tracking-wide transition-colors",
            phase === "scanning"
              ? "cursor-wait bg-white/10 text-white/40"
              : "bg-amber text-[#1a1207] hover:bg-amber-deep"
          )}
        >
          {phase === "scanning" ? "MEMINDAI..." : "PINDAI"}
        </button>
        <p className="mt-2 text-center font-mono text-[11px] text-emerald-100/35">
          hasil pindai dari basis data contoh
        </p>
      </div>
    </div>
  );
}
