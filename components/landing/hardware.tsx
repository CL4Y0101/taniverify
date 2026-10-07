import Image from "next/image";

const parts = [
  {
    name: "ESP32-C6",
    desc: "Mikrokontroler utama. Menjalankan pencocokan UID dan mengatur LCD serta buzzer.",
    img: "/images/hardware/esp32-c6.webp",
  },
  {
    name: "Modul RC522",
    desc: "Pembaca RFID frekuensi 13,56 MHz. Membaca UID dari tag yang didekatkan.",
    img: "/images/hardware/rc522.webp",
  },
  {
    name: "Tag RFID pasif",
    desc: "Ditempel di tiap karung pupuk. Menyimpan UID unik, tidak butuh baterai.",
    img: "/images/hardware/rfid-tag.webp",
  },
  {
    name: "LCD 16x2",
    desc: "Menampilkan UID yang terbaca dan hasil verifikasi: ASLI atau PALSU.",
    img: "/images/hardware/lcd-16x2.webp",
  },
  {
    name: "Buzzer",
    desc: "Memberi tanda bunyi yang berbeda untuk hasil asli dan palsu.",
    img: "/images/hardware/buzzer.webp",
  },
  {
    name: "Firebase",
    desc: "Basis data cloud untuk menyimpan riwayat pindai dan log dosis per petak.",
    img: "/images/hardware/firebase.webp",
  },
];

export function Hardware() {
  return (
    <section id="perangkat" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 md:px-8">
      <h2 className="text-3xl font-bold text-stone-800 md:text-4xl">Perangkat keras</h2>
      <p className="mt-3 max-w-2xl text-stone-600">
        Komponen yang dipakai, beserta peran masing-masing. Tidak ada yang
        disembunyikan.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((p) => (
          <div
            key={p.name}
            className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,91,60,0.12)]"
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#f4efe3]">
              <Image
                src={p.img}
                alt={p.name}
                width={640}
                height={480}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="font-semibold text-[#1c5b3c]">{p.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
