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

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-field focus:outline-none focus:ring-1 focus:ring-field";

export function DoseLogPanel({ logs, onAdd, onDelete }: DoseLogProps) {
  const [petak, setPetak] = useState("");
  const [dosis, setDosis] = useState("");
  const [tanggal, setTanggal] = useState(todayISO());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const dosisKg = parseFloat(dosis.replace(",", "."));
    if (!petak.trim() || Number.isNaN(dosisKg) || dosisKg <= 0 || !tanggal)
      return;
    onAdd(newDoseLog(petak.trim(), dosisKg, tanggal));
    setPetak("");
    setDosis("");
    setTanggal(todayISO());
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold text-stone-800">Log Dosis per Petak</h2>
        <span className="font-mono text-sm text-stone-400 tabular-nums">
          {logs.length} catatan
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Catat setiap pemberian pupuk. Data tersimpan di peramban ini.
      </p>

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="dosis-petak"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-stone-600"
          >
            Petak sawah
          </label>
          <input
            id="dosis-petak"
            value={petak}
            onChange={(e) => setPetak(e.target.value)}
            placeholder="cth: Petak A1"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dosis-kg"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-stone-600"
            >
              Dosis (kg)
            </label>
            <input
              id="dosis-kg"
              value={dosis}
              onChange={(e) => setDosis(e.target.value)}
              placeholder="cth: 25"
              inputMode="decimal"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="dosis-tanggal"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-stone-600"
            >
              Tanggal
            </label>
            <input
              id="dosis-tanggal"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-field px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-field-ink sm:col-span-2"
        >
          Catat Dosis
        </button>
      </form>

      {logs.length === 0 ? (
        <p className="mt-5 border border-dashed border-stone-300 p-5 text-center text-sm text-stone-400">
          Belum ada catatan dosis. Catatan yang ditambahkan akan muncul di sini.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-stone-100">
          {logs.map((log) => (
            <li key={log.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-stone-800">
                  {log.petak}
                </p>
                <p className="font-mono text-xs text-stone-500 tabular-nums">
                  {log.tanggal}
                </p>
              </div>
              <p className="font-mono text-sm font-bold text-field tabular-nums">
                {log.dosisKg} kg
              </p>
              <button
                onClick={() => onDelete(log.id)}
                className="shrink-0 text-xs font-medium text-red-600 hover:underline"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
