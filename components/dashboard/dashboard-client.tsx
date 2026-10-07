"use client";

import { useState } from "react";
import Link from "next/link";
import { ScannerPanel } from "@/components/dashboard/scanner-panel";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { DoseLogPanel } from "@/components/dashboard/dose-log";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import {
  loadDoseLogs,
  saveDoseLogs,
  type DoseLog,
  type ScanRecord,
} from "@/lib/simulation";

export function DashboardClient() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(() => loadDoseLogs());

  const addScan = (record: ScanRecord) => {
    setScans((prev) => [record, ...prev]);
  };

  const addDoseLog = (log: DoseLog) => {
    setDoseLogs((prev) => {
      const next = [log, ...prev];
      saveDoseLogs(next);
      return next;
    });
  };

  const deleteDoseLog = (id: string) => {
    setDoseLogs((prev) => {
      const next = prev.filter((l) => l.id !== id);
      saveDoseLogs(next);
      return next;
    });
  };

  const asli = scans.filter((s) => s.verdict === "asli").length;
  const palsu = scans.filter((s) => s.verdict === "palsu").length;

  return (
    <div className="min-h-screen bg-[#faf6ee]">
      <header className="border-b border-stone-200 bg-[#faf6ee]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-stone-500 hover:text-[#1c5b3c]">
              &larr; Beranda
            </Link>
            <span className="text-stone-300">|</span>
            <h1 className="text-lg font-bold text-stone-800">Dashboard Simulasi</h1>
            <span className="rounded bg-[#d9a441]/20 px-2 py-0.5 text-xs font-bold text-[#8a6420]">
              SIMULASI
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1c5b3c] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1c5b3c]" />
            </span>
            RC522 Terhubung (simulasi)
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
        <p className="rounded-xl border border-[#d9a441]/40 bg-[#d9a441]/10 p-4 text-sm text-stone-700">
          Ini adalah simulasi antarmuka pendamping perangkat. Hasil pindai
          diambil dari basis data contoh dan tidak mencerminkan karung sungguhan.
        </p>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ScannerPanel onScan={addScan} />
          </div>
          <div className="lg:col-span-2">
            <StatsCards
              total={scans.length}
              asli={asli}
              palsu={palsu}
              doseLogs={doseLogs.length}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <DoseLogPanel logs={doseLogs} onAdd={addDoseLog} onDelete={deleteDoseLog} />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed scans={scans} />
          </div>
        </div>
      </main>
    </div>
  );
}
