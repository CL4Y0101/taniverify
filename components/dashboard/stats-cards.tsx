interface StatsCardsProps {
  total: number;
  asli: number;
  palsu: number;
  doseLogs: number;
}

export function StatsCards({ total, asli, palsu, doseLogs }: StatsCardsProps) {
  const stats = [
    { label: "Total pindai", value: total, valueClass: "text-[#faf6ee]" },
    { label: "Karung asli", value: asli, valueClass: "text-emerald-300" },
    { label: "Karung palsu", value: palsu, valueClass: "text-red-400" },
    { label: "Log dosis", value: doseLogs, valueClass: "text-amber" },
  ];

  return (
    <div className="h-full overflow-hidden rounded-2xl bg-field-deep text-[#faf6ee] shadow-xl">
      <p className="border-b border-white/10 px-5 py-3 text-xs font-bold tracking-[0.22em] text-amber">
        RINGKASAN
      </p>
      <div className="grid grid-cols-2 md:divide-x md:divide-white/10">
        {stats.map((s) => (
          <div key={s.label} className="px-5 py-5">
            <p className={`font-mono text-4xl font-bold tabular-nums ${s.valueClass}`}>
              {s.value}
            </p>
            <p className="mt-1 text-[13px] text-white/55">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
