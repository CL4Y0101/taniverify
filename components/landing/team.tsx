const members = [
  { name: "Aditya Fadni Athaullah", role: "Ketua kelompok" },
  { name: "Riky Rio Wirawan", role: "Anggota" },
  { name: "Dhimas Ananta I M", role: "Anggota" },
  { name: "Rizki Agung Firmansyah", role: "Anggota" },
  { name: "Indra Nur Hafiyyan", role: "Anggota" },
];

export function Team() {
  return (
    <section id="tim" className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <h2 className="text-3xl font-bold text-stone-800 md:text-4xl">Tim</h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Kelompok 2, Golongan A — Teknik Informatika, Politeknik Negeri Jember.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {members.map((m) => (
            <div key={m.name} className="rounded-xl border border-stone-200 bg-[#faf6ee] p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1c5b3c] text-sm font-bold text-white">
                {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <p className="mt-3 text-sm font-semibold text-stone-800">{m.name}</p>
              <p className="mt-1 text-xs text-stone-500">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
