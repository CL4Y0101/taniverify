import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#f3ecdd]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <p className="flex items-center gap-2 text-lg font-bold text-stone-800">
            <Image
              src="/images/taniverify-logo.webp"
              alt="Logo TaniVerify"
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg"
            />
            TaniVerify
          </p>
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
            <Link href="/panduan" className="text-stone-600 hover:text-[#1c5b3c]">
              Panduan Presenter
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
