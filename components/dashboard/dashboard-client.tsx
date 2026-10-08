"use client";

import Link from "next/link";
import Image from "next/image";
import { ScannerPanel } from "@/components/dashboard/scanner-panel";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { DoseLogPanel } from "@/components/dashboard/dose-log";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import {
  loadDoseLogs,
  saveDoseLogs,
  type DoseLog,
  type ScanRecord,
} from "@/lib/simulation";
import { useEffect, useMemo, useState } from "react";

export function DashboardClient() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [liveScans, setLiveScans] = useState<ScanRecord[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(() => loadDoseLogs());

  // Dengarkan pindaian dari perangkat ESP32 (collection `scans`,
  // dokumen dengan sumber="perangkat"). Muncul otomatis tanpa refresh.
  useEffect(() => {
    const q = query(
      collection(db, "scans"),
      orderBy("waktu", "desc"),
      limit(25)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: ScanRecord[] = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data.sumber !== "perangkat") return;
          const t = data.waktu as { toDate?: () => Date } | undefined;
          const iso =
            t && typeof t.toDate === "function"
              ? t.toDate().toISOString()
              : new Date().toISOString();
          const uid = String(data.uid ?? "?");
          const verdict = data.verdict === "palsu" ? "palsu" : "asli";
          list.push({
            id: d.id,
            waktu: iso,
            uid,
            verdict,
            ...(verdict === "asli"
              ? {
                  sack: {
                    uid,
                    merk: String(data.merk ?? "-"),
                    jenis: String(data.jenis ?? "-"),
                    beratKg: 0,
                    batch: "-",
                    tglProduksi: "-",
                    distributor: "perangkat",
                  },
                }
              : {
                  reason: String(
                    data.reason ?? "UID tidak terdaftar di basis data"
                  ),
                }),
          });
        });
        setLiveScans(list);
      },
      () => {
        // Kalau listener gagal, mode simulasi tetap jalan normal.
      }
    );
    return () => unsub();
  }, []);

  const allScans = useMemo(
    () =>
      [...liveScans, ...scans].sort(
        (a, b) => +new Date(b.waktu) - +new Date(a.waktu)
      ),
    [liveScans, scans]
  );

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

  const asli = allScans.filter((s) => s.verdict === "asli").length;
  const palsu = allScans.filter((s) => s.verdict === "palsu").length;

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-field-deep text-[#faf6ee]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="shrink-0 text-sm text-white/60 hover:text-white"
            >
              &larr; <span className="hidden sm:inline">Beranda</span>
            </Link>
            <span className="text-white/20">|</span>
            <Image
              src="/images/taniverify-logo.webp"
              alt="Logo TaniVerify"
              width={30}
              height={30}
              className="h-[30px] w-[30px] rounded-lg"
            />
            <h1 className="text-[15px] font-bold md:text-base">
              Dashboard Simulasi
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-white/70">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="hidden sm:inline">RC522 terhubung</span>
            <span className="sm:hidden">RC522</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-8">
        <p className="text-xs text-stone-500">
          Simulasi antarmuka pendamping perangkat — hasil pindai diambil dari
          basis data contoh, bukan karung sungguhan.
        </p>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ScannerPanel onScan={addScan} />
          </div>
          <div className="lg:col-span-2">
            <StatsCards
              total={allScans.length}
              asli={asli}
              palsu={palsu}
              doseLogs={doseLogs.length}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <DoseLogPanel
              logs={doseLogs}
              onAdd={addDoseLog}
              onDelete={deleteDoseLog}
            />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed scans={allScans} live={liveScans.length > 0} />
          </div>
        </div>
      </main>
    </div>
  );
}
