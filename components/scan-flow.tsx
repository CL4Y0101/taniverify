import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

const steps = [
  {
    no: "01",
    title: "Tempel tag",
    desc: "Setiap karung pupuk asli ditempeli tag RFID berisi UID unik oleh distributor.",
  },
  {
    no: "02",
    title: "Pindai",
    desc: "Dekatkan pemindai genggam ke tag. Modul RC522 membaca UID dalam waktu kurang dari 2 detik.",
  },
  {
    no: "03",
    title: "Verifikasi",
    desc: "UID dicocokkan dengan daftar karung terdaftar. LCD dan buzzer langsung memberi tahu: asli atau palsu.",
  },
];

export function ScanFlow() {
  return (
    <ScrollExpandMedia
      mediaSrc="/images/fertilizer-sacks.jpg"
      bgImageSrc="/images/hero-rice-field.jpg"
      title="Tempel. Pindai. Terverifikasi."
      date="Alur kerja pemindai"
      scrollToExpand="Gulir untuk memperbesar"
    >
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.no} className="rounded-xl border border-stone-200 bg-white p-6">
            <p className="text-sm font-bold tracking-widest text-[#d9a441]">{s.no}</p>
            <h3 className="mt-2 font-semibold text-stone-800">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </ScrollExpandMedia>
  );
}
