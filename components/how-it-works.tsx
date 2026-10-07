const steps = [
  {
    no: "1",
    title: "Tag ditempel ke karung",
    desc: "Setiap karung pupuk asli ditempeli tag RFID pasif yang berisi UID unik.",
  },
  {
    no: "2",
    title: "Pemindai didekatkan",
    desc: "Petani atau petugas mendekatkan perangkat ke tag. Modul RC522 membaca UID dalam waktu singkat.",
  },
  {
    no: "3",
    title: "UID dicocokkan",
    desc: "ESP32-C6 mencocokkan UID yang terbaca dengan daftar karung yang terdaftar di perangkat.",
  },
  {
    no: "4",
    title: "Hasil langsung keluar",
    desc: "LCD menampilkan ASLI atau PALSU, buzzer berbunyi sesuai hasil, dan hasil pindai tercatat.",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-y border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <h2 className="text-3xl font-bold text-stone-800 md:text-4xl">Cara kerja</h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Empat langkah dari karung sampai hasil verifikasi.
        </p>
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <li key={s.no} className="relative rounded-xl border border-stone-200 bg-[#faf6ee] p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9a441] text-base font-bold text-[#1a1207]">
                {s.no}
              </span>
              <h3 className="mt-4 font-semibold text-stone-800">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
