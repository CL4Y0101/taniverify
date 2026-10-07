import { FAKE_UIDS, GENUINE_SACKS, type Sack } from "./mock-db";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export type Verdict = "asli" | "palsu";

export interface ScanRecord {
  id: string;
  waktu: string;
  uid: string;
  verdict: Verdict;
  sack?: Sack;
  reason?: string;
}

export interface DoseLog {
  id: string;
  petak: string;
  dosisKg: number;
  tanggal: string;
}

const DOSE_LOG_KEY = "taniverify-dose-logs";

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

// Daftar karung diambil dari Firestore (collection `uids`, document ID = UID).
// Di-cache per sesi; kalau Firestore kosong / gagal, pakai data contoh lokal.
let sacksCache: Sack[] | null = null;
let sacksPromise: Promise<Sack[]> | null = null;

async function loadSacks(): Promise<Sack[]> {
  if (sacksCache) return sacksCache;
  if (!sacksPromise) {
    sacksPromise = (async () => {
      try {
        const snap = await getDocs(collection(db, "uids"));
        const list: Sack[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            uid: d.id,
            merk: String(data.merk ?? "-"),
            jenis: String(data.jenis ?? "-"),
            beratKg: Number(data.beratKg ?? 0),
            batch: String(data.batch ?? "-"),
            tglProduksi: String(data.tglProduksi ?? "-"),
            distributor: String(data.distributor ?? "-"),
          });
        });
        sacksCache = list.length > 0 ? list : GENUINE_SACKS;
      } catch {
        sacksCache = GENUINE_SACKS;
      }
      return sacksCache;
    })();
  }
  return sacksPromise;
}

export async function simulateScan(): Promise<ScanRecord> {
  const sacks = await loadSacks();
  const isFake = Math.random() < 0.3;

  let record: ScanRecord;
  if (isFake) {
    const fake = FAKE_UIDS[Math.floor(Math.random() * FAKE_UIDS.length)];
    record = {
      id: randomId(),
      waktu: new Date().toISOString(),
      uid: fake.uid,
      verdict: "palsu",
      reason: fake.reason,
    };
  } else {
    const sack = sacks[Math.floor(Math.random() * sacks.length)];
    record = {
      id: randomId(),
      waktu: new Date().toISOString(),
      uid: sack.uid,
      verdict: "asli",
      sack,
    };
  }

  // Catat ke Firestore (collection `scans`). Fire-and-forget: kalau gagal,
  // simulasi tetap jalan dengan data lokal.
  try {
    await addDoc(collection(db, "scans"), {
      uid: record.uid,
      verdict: record.verdict,
      waktu: serverTimestamp(),
      ...(record.sack
        ? { merk: record.sack.merk, jenis: record.sack.jenis }
        : { reason: record.reason ?? "" }),
    });
  } catch {
    // abaikan
  }

  return record;
}

export function formatWaktu(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function loadDoseLogs(): DoseLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DOSE_LOG_KEY);
    return raw ? (JSON.parse(raw) as DoseLog[]) : [];
  } catch {
    return [];
  }
}

export function saveDoseLogs(logs: DoseLog[]) {
  try {
    window.localStorage.setItem(DOSE_LOG_KEY, JSON.stringify(logs));
  } catch {
    return;
  }
}

export function newDoseLog(petak: string, dosisKg: number, tanggal: string): DoseLog {
  return { id: randomId(), petak, dosisKg, tanggal };
}
