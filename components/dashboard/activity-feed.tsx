import { formatWaktu, type ScanRecord } from "@/lib/simulation";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  scans: ScanRecord[];
}

export function ActivityFeed({ scans }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 md:p-6">
      <h2 className="text-lg font-bold text-stone-800">Aktivitas Terakhir</h2>
      {scans.length === 0 ? (
        <p className="mt-4 border border-dashed border-stone-300 p-5 text-center text-sm text-stone-400">
          Belum ada pindai pada sesi ini. Hasil pindaian akan tercatat di sini.
        </p>
      ) : (
        <ul className="relative mt-5 space-y-5 before:absolute before:bottom-2 before:left-[4px] before:top-2 before:w-px before:bg-stone-200">
          {scans.slice(0, 8).map((s) => (
            <li key={s.id} className="relative pl-6">
              <span
                className={cn(
                  "absolute left-0 top-1 h-[9px] w-[9px] rounded-full ring-4 ring-white",
                  s.verdict === "asli" ? "bg-field" : "bg-red-500"
                )}
                aria-hidden="true"
              />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[13px] font-semibold text-stone-800">
                    {s.uid}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {formatWaktu(s.waktu)}
                    {s.sack ? ` · ${s.sack.merk} ${s.sack.jenis}` : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded px-2 py-0.5 text-[11px] font-bold tracking-wide text-white",
                    s.verdict === "asli" ? "bg-field" : "bg-red-600"
                  )}
                >
                  {s.verdict === "asli" ? "ASLI" : "PALSU"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
