import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Panduan Presenter — TaniVerify",
  description:
    "Panduan langkah demi langkah untuk mendemokan TaniVerify: persiapan, skrip demo, penjelasan teknis, Q&A, dan troubleshooting.",
};

const checklist = [
  {
    grup: "Perangkat keras",
    items: [
      "ESP32-C6 + RC522 + LCD I2C + buzzer terangkai dan menyala",
      "Firmware TaniVerifyFirebase ter-upload (PAKAI_FIREBASE true untuk demo live)",
      "Kartu putih (skenario ASLI) dan keyfob biru (skenario PALSU) siap di meja",
      "RC522 dicatu 3,3V — bukan 5V",
    ],
  },
  {
    grup: "Jaringan & data",
    items: [
      "Hotspot HP aktif, SSID & password sama dengan yang di kode",
      "UID kartu putih sudah terdaftar di Firestore collection uids",
      "Keyfob biru TIDAK terdaftar (untuk skenario palsu)",
    ],
  },
  {
    grup: "Tampilan",
    items: [
      "Dashboard web terbuka di browser (tab siap)",
      "Firebase console terbuka di tab lain (untuk menunjukkan data, opsional)",
      "Halaman panduan ini dibuka di HP sebagai contekan",
    ],
  },
];

const demoSteps = [
  {
    no: "0",
    title: "Pembuka (1–2 menit)",
    lakukan: "Sapa audiens, jelaskan masalahnya.",
    katakan:
      "Pupuk palsu merugikan petani — kandungannya tidak sesuai label, hasil panen bisa turun. TaniVerify memastikan karung pupuk itu asli lewat tag RFID yang diverifikasi perangkat, dan hasilnya tercatat otomatis.",
    terlihat: "Halaman utama web sebagai latar.",
    kenapa:
      "Buka dengan masalah, bukan dengan alat. Audiens perlu peduli dulu sebelum peduli cara kerjanya.",
  },
  {
    no: "1",
    title: "Pindai kartu ASLI",
    lakukan: "Tempelkan kartu putih ke modul RC522.",
    katakan:
      "Ini simulasi karung pupuk asli. Tag RFID-nya sudah didaftarkan di sistem sebagai karung Tani Subur.",
    terlihat:
      'LCD menampilkan "PUPUK ASLI" + nama merk, buzzer bunyi 1x panjang. Dashboard web langsung menampilkan hasil ASLI (ada badge LIVE).',
    kenapa:
      "RC522 membaca UID kartu lewat SPI → ESP32 meminta dokumen uids/{UID} ke Firestore → dokumennya ada → dinyatakan asli → hasil dikirim ke collection scans → dashboard yang mendengarkan scans langsung memperbarui tampilan tanpa refresh.",
  },
  {
    no: "2",
    title: "Pindai keyfob PALSU",
    lakukan: "Tempelkan keyfob biru ke modul RC522.",
    katakan:
      "Sekarang simulasi pupuk palsu — tag yang tidak terdaftar di sistem, misalnya karung oplosan.",
    terlihat:
      'LCD menampilkan "WASPADA PALSU!", buzzer bunyi 3x pendek. Dashboard menampilkan PALSU.',
    kenapa:
      "UID keyfob tidak ditemukan di whitelist → dinyatakan palsu. Sistem tidak mengenalinya, jadi petani diperingatkan untuk tidak memakai pupuk itu.",
  },
  {
    no: "3",
    title: "Tunjukkan dashboard",
    lakukan: "Scroll dashboard di browser.",
    katakan:
      "Setiap pindaian tercatat otomatis dengan waktunya. Ada statistik asli vs palsu, riwayat aktivitas, dan pencatatan dosis per petak sawah.",
    terlihat: "StatsCards, Aktivitas Terakhir (berisi 2 pindaian barusan), form dosis.",
    kenapa:
      "Data pindaian yang tercatat bisa diaudit — ketahuan kapan dan berapa banyak pupuk palsu beredar. Pencatatan dosis membantu petani memakai pupuk sesuai takaran.",
  },
  {
    no: "4",
    title: "Tunjukkan Firebase (opsional)",
    lakukan: "Buka Firebase console → Firestore.",
    katakan:
      "Whitelist karung ada di collection uids, riwayat pindaian di collection scans. Perangkat hanya membaca dan menulis ke sini.",
    terlihat: "Dokumen UID kartu putih di uids; 2 dokumen baru di scans.",
    kenapa:
      "Data terpusat sehingga distributor bisa mengelola pendaftaran karung dari satu tempat. Perangkat tidak menyimpan data sensitif — kalau perangkat hilang, data aman di cloud.",
  },
  {
    no: "5",
    title: "Penutup",
    lakukan: "Rangkum dan sebutkan rencana pengembangan.",
    katakan:
      "Verifikasi satu karung butuh sekitar 2 detik, hasilnya tercatat otomatis dan bisa diaudit. Rencana ke depan: tag anti-clone, mode offline saat tidak ada sinyal, dan pendaftaran karung lewat aplikasi.",
    terlihat: "Kembali ke halaman utama.",
    kenapa:
      "Tutup dengan nilai (cepat, tercatat, bisa diaudit) dan kejujuran soal batasan — dosen lebih menghargai rencana realistis daripada klaim sempurna.",
  },
];

const arsitektur = [
  { nama: "Tag RFID", desc: "Menyimpan UID unik. Pasif — tanpa baterai, aktif saat didekati reader." },
  { nama: "RC522", desc: "Membaca UID lewat SPI, dikirim ke ESP32 sebagai deretan byte." },
  { nama: "ESP32-C6", desc: "Otak sistem: cek whitelist ke Firestore, tampilkan hasil di LCD, bunyikan buzzer, kirim riwayat pindai." },
  { nama: "Firestore", desc: "Whitelist di collection uids, riwayat pindai di collection scans." },
  { nama: "Dashboard web", desc: "Mendengarkan scans secara live (onSnapshot) — pindaian baru langsung muncul." },
];

const qna = [
  {
    q: "Kenapa pakai RFID, bukan QR code saja?",
    a: "QR code bisa difotokopi dengan mudah — cukup foto lalu cetak ulang. Tag RFID butuh benda fisiknya, dibaca lebih cepat, dan tidak perlu garis pandang langsung.",
  },
  {
    q: "Bagaimana kalau UID-nya di-clone?",
    a: "Jujur: UID tag biasa memang bisa di-clone, itu keterbatasan desain saat ini. Pengembangan lanjutan: pakai tag dengan signature kriptografi atau challenge-response agar clone terdeteksi.",
  },
  {
    q: "Apakah harus selalu ada internet?",
    a: "Untuk versi Firebase, ya — whitelist dicek ke cloud. Tapi firmware versi offline (whitelist di memori perangkat) sudah ada sebagai cadangan; sinkronisasi bisa dilakukan berkala saat ada sinyal.",
  },
  {
    q: "Bagaimana cara mendaftarkan karung baru?",
    a: "Tambah dokumen baru di collection uids dengan ID = UID tag, isi data karung: merk, jenis, berat, batch, tanggal produksi, distributor.",
  },
  {
    q: "Kenapa ESP32-C6?",
    a: "Sudah ada WiFi untuk konek ke Firebase, hemat daya, dan kemampuannya cukup untuk baca RFID + LCD + kirim data.",
  },
  {
    q: "API key Firebase-nya kelihatan di kode, aman?",
    a: "API key untuk web memang publik by design — keamanannya dijaga lewat Firestore rules (siapa boleh baca/tulis apa), bukan dengan menyembunyikan key-nya.",
  },
  {
    q: "Berapa lama satu kali verifikasi?",
    a: "Sekitar 2 detik dari tempel kartu sampai hasil tampil di LCD dan web.",
  },
];

const troubleshooting = [
  { masalah: "LCD blank / tidak tampil", solusi: "Cek alamat I2C (coba 0x27 atau 0x3F), cek kabel SDA/SCL, cek tegangan 5V." },
  { masalah: "RC522 tidak membaca kartu", solusi: "Cek wiring SPI, pastikan dicatu 3,3V (JANGAN 5V), dekatkan kartu 1–3 cm." },
  { masalah: 'LCD "WiFi gagal!"', solusi: "Pastikan hotspot HP aktif dan SSID/password di kode sudah sama persis." },
  { masalah: 'LCD "Firebase gagal!"', solusi: "Cek koneksi internet, API key, dan Firestore rules (tulis ke scans harus diizinkan)." },
  { masalah: "Dashboard tidak update", solusi: "Refresh browser, pastikan tab dashboard terbuka dan badge LIVE muncul." },
  { masalah: "Kartu ASLI terbaca PALSU", solusi: 'Cek UID kartu sudah terdaftar di collection uids dengan format "AA:BB:CC:DD".' },
];

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-[#faf6ee]">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
        <p className="text-sm font-semibold tracking-wide text-[#1c5b3c]">
          UNTUK TIM
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-800 md:text-4xl">
          Panduan Presenter
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-stone-600">
          Panduan langkah demi langkah untuk mendemokan TaniVerify — dari
          persiapan, skrip demo, sampai bocoran Q&A. Baca sebelum presentasi,
          buka di HP saat presentasi sebagai contekan.
        </p>

        {/* Checklist */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-stone-800">
            1. Checklist persiapan
          </h2>
          <p className="mt-2 text-stone-600">
            Centang semua ini sebelum presentasi mulai.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {checklist.map((c) => (
              <div
                key={c.grup}
                className="rounded-xl border border-stone-200 bg-white p-5"
              >
                <h3 className="font-semibold text-stone-800">{c.grup}</h3>
                <ul className="mt-3 space-y-2.5">
                  {c.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-stone-600">
                      <span
                        className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-stone-300"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Alur demo */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-stone-800">2. Alur demo</h2>
          <p className="mt-2 text-stone-600">
            Setiap langkah: apa yang dilakukan, apa yang diucapkan, apa yang
            terlihat, dan kenapa begitu — biar benar-benar paham, bukan cuma
            hafal.
          </p>
          <ol className="mt-6 space-y-6">
            {demoSteps.map((s) => (
              <li
                key={s.no}
                className="overflow-hidden rounded-xl border border-stone-200 bg-white"
              >
                <div className="flex items-center gap-3 border-b border-stone-100 bg-[#f3ecdd] px-5 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1c5b3c] text-sm font-bold text-white">
                    {s.no}
                  </span>
                  <h3 className="font-semibold text-stone-800">{s.title}</h3>
                </div>
                <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold tracking-wide text-[#1c5b3c]">
                      LAKUKAN
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-700">
                      {s.lakukan}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wide text-[#1c5b3c]">
                      KATAKAN
                    </p>
                    <p className="mt-1 text-sm italic leading-relaxed text-stone-700">
                      “{s.katakan}”
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wide text-[#d9a441]">
                      TERLIHAT
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-700">
                      {s.terlihat}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wide text-stone-500">
                      KENAPA BEGITU
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-700">
                      {s.kenapa}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Arsitektur */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-stone-800">
            3. Peta sistem
          </h2>
          <p className="mt-2 text-stone-600">
            Aliran data dari kartu sampai ke web — hafalkan urutan ini.
          </p>
          <ol className="mt-6 space-y-0">
            {arsitektur.map((a, i) => (
              <li key={a.nama} className="relative pl-8 pb-6 last:pb-0">
                {i < arsitektur.length - 1 && (
                  <span
                    className="absolute left-[11px] top-7 h-full w-px bg-stone-300"
                    aria-hidden="true"
                  />
                )}
                <span
                  className="absolute left-0 top-1 h-[9px] w-[9px] rounded-full bg-[#d9a441] ring-4 ring-[#faf6ee]"
                  aria-hidden="true"
                />
                <p className="font-semibold text-stone-800">{a.nama}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-stone-600">
                  {a.desc}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Q&A */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-stone-800">
            4. Bocoran Q&A
          </h2>
          <p className="mt-2 text-stone-600">
            Pertanyaan yang paling mungkin keluar — beserta jawaban jujurnya.
          </p>
          <div className="mt-6 space-y-4">
            {qna.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-stone-200 bg-white p-5"
              >
                <p className="font-semibold text-stone-800">Q: {item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  <span className="font-semibold text-[#1c5b3c]">A: </span>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-stone-800">
            5. Kalau demo gagal
          </h2>
          <p className="mt-2 text-stone-600">
            Jangan panik — cek daftar ini sambil tetap ngomong ke audiens.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white">
            {troubleshooting.map((t, i) => (
              <div
                key={t.masalah}
                className={
                  "grid gap-1 px-5 py-4 md:grid-cols-2 md:gap-4 " +
                  (i % 2 === 1 ? "bg-[#faf6ee]" : "bg-white")
                }
              >
                <p className="text-sm font-semibold text-red-700">
                  {t.masalah}
                </p>
                <p className="text-sm leading-relaxed text-stone-600">
                  {t.solusi}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 rounded-xl bg-[#1c5b3c] p-6 text-[#faf6ee]">
          <p className="font-semibold">Tips terakhir</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            Kalau ada pertanyaan yang tidak bisa dijawab, jangan ngarang.
            Katakan “itu belum kami uji, tapi dugaannya …” — dosen lebih
            menghargai kejujuran daripada jawaban sok tahu. Semangat!
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block rounded-lg bg-[#d9a441] px-4 py-2 text-sm font-bold text-[#1a1207] hover:bg-[#c8932f]"
          >
            Buka Dashboard →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
