const features = [
  {
    title: "Verifikasi keaslian",
    desc: "Tempelkan pemindai ke tag RFID di karung. UID yang terbaca dicocokkan dengan daftar karung yang terdaftar.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Log dosis per petak",
    desc: "Setiap pemberian pupuk dicatat: petak sawah mana, berapa kilogram, dan kapan. Riwayatnya bisa dilihat kembali.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4a2 2 0 014 0M9 10h6M9 14h6M9 18h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Daftar UID lokal",
    desc: "Daftar UID karung asli disimpan di perangkat, jadi verifikasi tetap jalan walau tidak ada koneksi internet.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
      </svg>
    ),
  },
  {
    title: "Buzzer dan LCD",
    desc: "Hasil pindai langsung terbaca: LCD menampilkan status, buzzer berbunyi beda untuk karung asli dan palsu.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
        <path d="M4 10v4h3l4 4V6l-4 4H4z" strokeLinejoin="round" />
        <path d="M15 9a4 4 0 010 6M18 6a8 8 0 010 12" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 md:px-8">
      <h2 className="text-3xl font-bold text-stone-800 md:text-4xl">Fitur</h2>
      <p className="mt-3 max-w-2xl text-stone-600">
        Empat hal yang dikerjakan perangkat, dirancang agar sederhana dipakai di
        lapangan.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-stone-200 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1c5b3c]/10 text-[#1c5b3c]">
              {f.icon}
            </div>
            <h3 className="mt-4 font-semibold text-stone-800">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
