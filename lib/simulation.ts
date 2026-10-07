import { FAKE_UIDS, GENUINE_SACKS, type Sack } from "./mock-db";

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

export function simulateScan(): ScanRecord {
  const isFake = Math.random() < 0.3;
  if (isFake) {
    const fake = FAKE_UIDS[Math.floor(Math.random() * FAKE_UIDS.length)];
    return {
      id: randomId(),
      waktu: new Date().toISOString(),
      uid: fake.uid,
      verdict: "palsu",
      reason: fake.reason,
    };
  }
  const sack = GENUINE_SACKS[Math.floor(Math.random() * GENUINE_SACKS.length)];
  return {
    id: randomId(),
    waktu: new Date().toISOString(),
    uid: sack.uid,
    verdict: "asli",
    sack,
  };
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
