import Image from "next/image";

const members = [
  { name: "Aditya Fadni Athaullah", role: "Ketua kelompok", img: "/images/team/aditya.webp" },
  { name: "Riky Rio Wirawan", role: "Anggota", img: "/images/team/riky.webp" },
  { name: "Dhimas Ananta I M", role: "Anggota", img: "/images/team/dhimas.webp" },
  { name: "Rizki Agung Firmansyah", role: "Anggota", img: "/images/team/rizki.webp" },
  { name: "Indra Nur Hafiyyan", role: "Anggota", img: "/images/team/indra.webp" },
];

export function Team() {
  return (
    <section id="tim" className="scroll-mt-20 border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <h2 className="text-3xl font-bold text-stone-800 md:text-4xl">Tim</h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Kelompok 2, Golongan A — Teknik Informatika, Politeknik Negeri Jember.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {members.map((m) => (
            <div
              key={m.name}
              className="group rounded-xl border border-stone-200 bg-[#faf6ee] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,91,60,0.12)]"
            >
              <Image
                src={m.img}
                alt={m.name}
                width={96}
                height={96}
                className="h-16 w-16 rounded-full border-2 border-[#1c5b3c]/20 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <p className="mt-3 text-sm font-semibold text-stone-800">{m.name}</p>
              <p className="mt-1 text-xs text-stone-500">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
