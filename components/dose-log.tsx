"use client";

import { useState } from "react";
import { newDoseLog, type DoseLog } from "@/lib/simulation";

interface DoseLogProps {
  logs: DoseLog[];
  onAdd: (log: DoseLog) => void;
  onDelete: (id: string) => void;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function DoseLogPanel({ logs, onAdd, onDelete }: DoseLogProps) {
  const [petak, setPetak] = useState("");
  const [dosis, setDosis] = useState("");
  const [tanggal, setTanggal] = useState(todayISO());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const dosisKg = parseFloat(dosis.replace(",", "."));
    if (!petak.trim() || Number.isNaN(dosisKg) || dosisKg <= 0 || !tanggal) return;
    onAdd(newDoseLog(petak.trim(), dosisKg, tanggal));
    setPetak("");
    setDosis("");
    setTanggal(todayISO());
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="font-semibold text-stone-800">Log Dosis per Petak</h2>
      <p className="mt-1 text-sm text-stone-500">
        Catat setiap pemberian pupuk. Data tersimpan di peramban ini.
      </p>

      <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-[1fr_140px_170px_auto]">
        <input
          value={petak}
          onChange={(e) => setPetak(e.target.value)}
          placeholder="Nama petak sawah"
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-[#1c5b3c] focus:outline-none"
        />
        <input
          value={dosis}
          onChange={(e) => setDosis(e.target.value)}
          placeholder="Dosis (kg)"
          inputMode="decimal"
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-[#1c5b3c] focus:outline-none"
        />
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[#1c5b3c] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#1c5b3c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#123c29]"
        >
          Catat
        </button>
      </form>

      {logs.length === 0 ? (
        <p className="mt-6 rounded-lg bg-stone-100 p-4 text-center text-sm text-stone-500">
          Belum ada catatan dosis.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="py-2 pr-4 font-medium">Petak</th>
                <th className="py-2 pr-4 font-medium">Dosis</th>
                <th className="py-2 pr-4 font-medium">Tanggal</th>
                <th className="py-2 font-medium" aria-label="Aksi" />
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-stone-100 last:border-0">
                  <td className="py-2 pr-4 font-medium text-stone-800">{log.petak}</td>
                  <td className="py-2 pr-4 text-stone-600">{log.dosisKg} kg</td>
                  <td className="py-2 pr-4 text-stone-600">{log.tanggal}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => onDelete(log.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
