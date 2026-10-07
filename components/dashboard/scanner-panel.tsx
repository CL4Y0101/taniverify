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
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-stone-800">Panel Pemindai</h2>
        <span className="rounded bg-[#d9a441]/20 px-2 py-0.5 text-xs font-bold text-[#8a6420]">
          SIMULASI
        </span>
      </div>

      <button
        onClick={startScan}
        disabled={phase === "scanning"}
        className={cn(
          "mt-5 flex w-full items-center justify-center rounded-xl px-6 py-4 text-lg font-bold",
          phase === "scanning"
            ? "cursor-wait bg-stone-200 text-stone-500"
            : "bg-[#1c5b3c] text-white hover:bg-[#123c29]"
        )}
      >
        {phase === "scanning" ? "Memindai..." : "Simulasi Pindai"}
      </button>

      {phase === "scanning" && (
        <div className="mt-5">
          <div className="h-3 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-3 rounded-full bg-[#d9a441] transition-[width] duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-sm text-stone-500">
            Membaca UID... {progress}%
          </p>
        </div>
      )}

      {phase === "done" && result && (
        <div
          className={cn(
            "mt-5 rounded-xl border p-5",
            isGenuine ? "border-[#1c5b3c]/30 bg-[#1c5b3c]/5" : "border-red-300 bg-red-50"
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "rounded-md px-3 py-1 text-sm font-bold text-white",
                isGenuine ? "bg-[#1c5b3c]" : "bg-red-600"
              )}
            >
              {isGenuine ? "ASLI" : "PALSU"}
            </span>
            <span className="font-mono text-sm text-stone-600">{result.uid}</span>
          </div>

          {isGenuine && result.sack ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Merk</dt>
                <dd className="font-medium text-stone-800">{result.sack.merk}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Jenis pupuk</dt>
                <dd className="font-medium text-stone-800">
                  {result.sack.jenis} &middot; {result.sack.beratKg} kg
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">No. batch</dt>
                <dd className="font-medium text-stone-800">{result.sack.batch}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Tanggal produksi</dt>
                <dd className="font-medium text-stone-800">{result.sack.tglProduksi}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Distributor</dt>
                <dd className="font-medium text-stone-800">{result.sack.distributor}</dd>
              </div>
            </dl>
          ) : (
            <div className="mt-4 rounded-lg bg-red-100 p-4">
              <p className="text-sm font-semibold text-red-800">Peringatan: karung tidak dikenal</p>
              <p className="mt-1 text-sm text-red-700">{result.reason}</p>
              <p className="mt-2 text-xs text-red-600">
                Jangan gunakan pupuk ini. Laporkan ke distributor atau kelompok tani.
              </p>
            </div>
          )}
        </div>
      )}

      {phase === "idle" && (
        <p className="mt-5 text-center text-sm text-stone-500">
          Tekan tombol untuk mensimulasikan pemindaian tag RFID pada karung pupuk.
        </p>
      )}
    </div>
  );
}
