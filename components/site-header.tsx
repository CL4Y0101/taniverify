import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#perangkat", label: "Perangkat" },
  { href: "#tim", label: "Tim" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#faf6ee]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/taniverify-logo.webp"
            alt="Logo TaniVerify"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
          />
          <span className="text-lg font-bold text-stone-800">TaniVerify</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-stone-600 hover:text-[#1c5b3c]">
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          href="/dashboard"
          className="rounded-lg bg-[#1c5b3c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#123c29]"
        >
          Dashboard Simulasi
        </Link>
      </div>
    </header>
  );
}
