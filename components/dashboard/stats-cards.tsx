interface StatsCardsProps {
  total: number;
  asli: number;
  palsu: number;
  doseLogs: number;
}

export function StatsCards({ total, asli, palsu, doseLogs }: StatsCardsProps) {
  const stats = [
    { label: "Total pindai", value: total, accent: "text-stone-800" },
    { label: "Karung asli", value: asli, accent: "text-[#1c5b3c]" },
    { label: "Karung palsu", value: palsu, accent: "text-red-600" },
    { label: "Log dosis", value: doseLogs, accent: "text-stone-800" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-stone-200 bg-white p-5">
          <p className={`text-3xl font-bold ${s.accent}`}>{s.value}</p>
          <p className="mt-1 text-sm text-stone-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
