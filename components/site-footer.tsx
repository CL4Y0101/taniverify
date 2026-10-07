import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#f3ecdd]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <p className="text-lg font-bold text-stone-800">TaniVerify</p>
          <p className="mt-2 text-sm text-stone-600">
            Rancang Bangun Sistem Deteksi Pupuk Palsu Berbasis RFID Menggunakan
            ESP32-C6.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-800">Tim</p>
          <p className="mt-2 text-sm text-stone-600">
            Kelompok 2, Golongan A
            <br />
            Teknik Informatika, Politeknik Negeri Jember
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-800">Tautan</p>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            <Link href="/dashboard" className="text-stone-600 hover:text-[#1c5b3c]">
              Dashboard Simulasi
            </Link>
            <a href="#cara-kerja" className="text-stone-600 hover:text-[#1c5b3c]">
              Cara Kerja
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-200">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-stone-500 md:px-8">
          Halaman ini adalah simulasi antarmuka untuk keperluan tugas kuliah.
        </p>
      </div>
    </footer>
  );
}
