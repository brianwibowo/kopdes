import React from "react";
import Link from "next/link";
import { Phone, MapPin, ShieldCheck, ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="w-full bg-[#f8fafc] border-t border-slate-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Kolom 1: Identitas & Visi Platform */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Platform intelijen spasial dan tata kelola terpadu untuk mengawal kemandirian ekonomi desa, transparansi legalitas badan hukum, serta penyerapan komoditas unggulan rakyat ke offtaker nasional.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 border border-red-200 text-[11px] text-red-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
              <span>Cakupan Pemantauan: 38 Provinsi Seluruh Indonesia</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Navigasi Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
              <li>
                <Link className="hover:text-red-700 transition-colors" href="/">
                  Beranda Nasional
                </Link>
              </li>
              <li>
                <Link className="hover:text-red-700 transition-colors" href="/pers/dashboard">
                  Dashboard Statistik
                </Link>
              </li>
              <li>
                <Link className="hover:text-red-700 transition-colors" href="/marketplace">
                  Marketplace Komoditas
                </Link>
              </li>
              <li>
                <Link className="hover:text-red-700 transition-colors" href="/peta">
                  Peta Spasial Indonesia
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Tata Kelola & Regulasi */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Tata Kelola & Kepatuhan
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
                <span>Pengesahan Badan Hukum (AHU)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
                <span>Nomor Induk Berusaha (OSS)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
                <span>Kepatuhan Rapat Anggota Tahunan</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
                <span>Audit & Akuntabilitas Finansial</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sekretariat Pengawasan */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sekretariat Pengawasan
            </h3>
            <div className="mt-4 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Phone className="w-3.5 h-3.5 text-red-700" />
                <span>(021) 1500 587 (Layanan Terpadu)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Graha Mandiri Lt.3, Jl. Imam Bonjol No.61, Menteng, Jakarta Pusat 10310
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Koperasi Desa Merah Putih (KDMP). Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-3">
            <span className="hover:text-slate-800 transition-colors cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">Standar Data Terbuka</span>
            <span>•</span>
            <span className="text-red-700 font-semibold">Portal Eksekutif</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
