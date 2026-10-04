import React from "react";
import Link from "next/link";
import { Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#F2F3F7] border-t border-[#E6E8EB] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Tautan Cepat */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-[#065366]">Tautan Cepat</h3>
            <ul className="mt-5 space-y-3.5 text-base text-[#065366]">
              <li>
                <Link className="transition-colors hover:text-[#044352] hover:underline" href="/pers/dashboard">
                  Dasbor Simkopdes
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-[#044352] hover:underline" href="/pers/dashboard">
                  Statistik
                </Link>
              </li>
              <li>
                <a className="transition-colors hover:text-[#044352] hover:underline" href="https://simkopdes.go.id/apps">
                  Unduh Simkopdes Mobile
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-[#044352] hover:underline"
                  href="https://lms.kop.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kemenkop Corporate University
                </a>
              </li>
            </ul>
          </div>

          {/* Informasi */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-[#065366]">Informasi</h3>
            <ul className="mt-5 space-y-3.5 text-base text-[#065366]">
              <li>
                <a className="transition-colors hover:text-[#044352] hover:underline" href="https://simkopdes.go.id/kontak">
                  Kontak Satgas KDKMP
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-[#044352] hover:underline"
                  href="https://wa.me/628111500587"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bantuan Simkopdes (WhatsApp)
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-[#044352] hover:underline" href="https://simkopdes.go.id/syarat-dan-ketentuan">
                  Syarat dan Ketentuan
                </a>
              </li>
            </ul>
          </div>

          {/* Media Sosial */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-[#065366]">Media Sosial</h3>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {["TikTok", "YouTube", "X", "Facebook", "Instagram"].map((sosmed) => (
                <span
                  key={sosmed}
                  className="px-3 py-1 rounded-full border border-[#065366] text-xs font-semibold text-[#065366] hover:bg-[#065366] hover:text-white transition-colors cursor-pointer"
                >
                  {sosmed}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#065366]/80 mt-4 leading-relaxed">
              Kanal resmi Kementerian Koperasi Republik Indonesia untuk sosialisasi program Koperasi Desa Merah Putih.
            </p>
          </div>

          {/* Satgas KDKMP & Kontak */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-[#065366]">Satgas KDKMP</h3>
            <div className="mt-5 space-y-3 text-sm text-[#065366]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#a0b73e] shrink-0" />
                <span className="font-semibold">(021) 1500 587</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#a0b73e] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-[#065366]/90">
                  Graha Mandiri Lt.3, Jl. Imam Bonjol No.61, Menteng, Kota Jakarta Pusat, DKI Jakarta 10310
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-[#E6E8EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#065366]/80 gap-3">
          <p>© 2026 . Kementerian Koperasi Republik Indonesia</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a0b73e]" />
            <span>Sistem Informasi Monitoring Koperasi Desa / Kelurahan Merah Putih</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
