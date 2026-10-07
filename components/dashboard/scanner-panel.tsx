"use client";

import { useEffect, useRef, useState } from "react";
import { simulateScan, type ScanRecord } from "@/lib/simulation";
import { cn } from "@/lib/utils";

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

      <div className="relative min-h-[228px] px-5 py-5">
        {phase === "scanning" && <div className="dash-scanline" aria-hidden="true" />}

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
            <p className="text-emerald-100/80">&gt; Membaca UID...</p>
            <p className="mt-3 text-3xl font-bold text-amber tabular-nums">
              {progress}
              <span className="text-lg">%</span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
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
