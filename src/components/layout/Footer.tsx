import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-[1fr_auto] sm:px-6 lg:px-8">
        <div>
          <Logo size="md" />
          <p className="mt-4 max-w-lg text-xs leading-relaxed text-slate-500">
            Prototipe platform Kopdes untuk eksplorasi data, supply chain,
            sebaran wilayah, keuntungan, dan arus kas. Seluruh data dan
            perhitungan dalam versi ini merupakan contoh presentasi.
          </p>
        </div>
        <nav
          aria-label="Navigasi footer"
          className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs font-semibold text-slate-600"
        >
          {[
            ["Statistik", "/pers/dashboard"],
            ["Direktori", "/koperasi"],
            ["Supply chain", "/modelling/supply-chain"],
            ["Peta Kopdes", "/modelling/peta"],
            ["Keuntungan", "/modelling/keuntungan"],
            ["Arus kas", "/modelling/arus-kas"],
            ["Marketplace", "/marketplace"],
          ].map(([name, href]) => (
            <Link key={href} href={href} className="hover:text-red-800">
              {name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-100 px-4 py-4 text-center text-[11px] text-slate-400">
        SIMKOPDES · MVP 2026 · Dataset demo, bukan publikasi statistik resmi
      </div>
    </footer>
  );
}
