const parts = [
  {
    name: "ESP32-C6",
    desc: "Mikrokontroler utama. Menjalankan pencocokan UID dan mengatur LCD serta buzzer.",
  },
  {
    name: "Modul RC522",
    desc: "Pembaca RFID frekuensi 13,56 MHz. Membaca UID dari tag yang didekatkan.",
  },
  {
    name: "Tag RFID pasif",
    desc: "Ditempel di tiap karung pupuk. Menyimpan UID unik, tidak butuh baterai.",
  },
  {
    name: "LCD 16x2",
    desc: "Menampilkan UID yang terbaca dan hasil verifikasi: ASLI atau PALSU.",
  },
  {
    name: "Buzzer",
    desc: "Memberi tanda bunyi yang berbeda untuk hasil asli dan palsu.",
  },
  {
    name: "Firebase",
    desc: "Basis data cloud untuk menyimpan riwayat pindai dan log dosis per petak.",
  },
];

export function Hardware() {
  return (
    <section id="perangkat" className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <h2 className="text-3xl font-bold text-stone-800 md:text-4xl">Perangkat keras</h2>
      <p className="mt-3 max-w-2xl text-stone-600">
        Komponen yang dipakai, beserta peran masing-masing. Tidak ada yang
        disembunyikan.
      </p>
      <div className="mt-10 overflow-hidden rounded-xl border border-stone-200 bg-white">
        {parts.map((p, i) => (
          <div
            key={p.name}
            className={`grid gap-1 px-6 py-5 md:grid-cols-[220px_1fr] md:gap-6 ${i > 0 ? "border-t border-stone-200" : ""}`}
          >
            <p className="font-semibold text-[#1c5b3c]">{p.name}</p>
            <p className="text-sm leading-relaxed text-stone-600">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
