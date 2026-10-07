import { formatWaktu, type ScanRecord } from "@/lib/simulation";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  scans: ScanRecord[];
}

export function ActivityFeed({ scans }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="font-semibold text-stone-800">Aktivitas Terakhir</h2>
      {scans.length === 0 ? (
        <p className="mt-4 rounded-lg bg-stone-100 p-4 text-center text-sm text-stone-500">
          Belum ada pindai pada sesi ini.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {scans.slice(0, 8).map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-stone-100 px-4 py-3"
            >
              <div>
                <p className="font-mono text-sm text-stone-800">{s.uid}</p>
                <p className="text-xs text-stone-500">
                  {formatWaktu(s.waktu)}
                  {s.sack ? ` · ${s.sack.merk} ${s.sack.jenis}` : ""}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 text-xs font-bold text-white",
                  s.verdict === "asli" ? "bg-[#1c5b3c]" : "bg-red-600"
                )}
              >
                {s.verdict === "asli" ? "ASLI" : "PALSU"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
