import React from "react";
import Link from "next/link";
import { getStats } from "@/lib/data";
import { ChevronRight, BarChart3, Building2, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const stats = getStats();

  return (
    <div className="w-full">
      {/* Hero Banner Section (Mirrors https://simkopdes.go.id) */}
      <section
        id="new-landing-banner"
        className="relative flex min-h-[560px] w-full flex-col overflow-hidden md:min-h-[700px] lg:h-[780px]"
      >
        {/* Background Image Hero */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/new-landing-page/hero.webp)" }}
        />

        {/* Top Dark Gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-[rgba(18,18,18,0.85)] to-transparent"
          aria-hidden="true"
        />

        {/* Bottom Dark Gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#121212] from-[12%] via-[#121212]/80 via-[42%] to-transparent"
          aria-hidden="true"
        />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-12 pt-24 md:px-6 md:pb-16 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[540px] text-white">
              <p className="text-base font-bold md:text-lg tracking-wide text-red-400">
                Koperasi Desa/Kelurahan Merah Putih
              </p>
              <h1 className="mt-2 text-[32px] font-extrabold leading-tight md:text-5xl text-white">
                Bangun Ekonomi Desa<br />
                Kokohkan Ekonomi Bangsa
              </h1>
              <p className="mt-3 text-sm md:text-base text-gray-200 leading-relaxed font-normal">
                Koperasi Desa/Kelurahan Merah Putih adalah koperasi yang beranggotakan warga yang berdomisili di desa atau kelurahan yang sama untuk mewujudkan kemandirian ekonomi desa.
              </p>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/pers/dashboard"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#a0b73e] hover:bg-[#859d18] px-5 py-3 text-sm md:text-base font-bold text-white transition-colors shadow-md"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Buka Dashboard Statistik</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://simkopdes.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[10px] bg-white/95 hover:bg-white px-4 py-3 text-sm md:text-base font-bold text-[#121212] transition-colors"
                >
                  <span>Daftar Keanggotaan</span>
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </div>

            {/* Quick Live Metric Cards in Hero (Bottom Right) */}
            <div className="flex flex-wrap sm:flex-nowrap gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-white min-w-[140px]">
                <div className="text-2xl md:text-3xl font-black">{stats.totalKoperasi}</div>
                <div className="text-xs text-gray-300 mt-0.5">Total Koperasi</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-white min-w-[140px]">
                <div className="text-2xl md:text-3xl font-black">38</div>
                <div className="text-xs text-gray-300 mt-0.5">Provinsi Tersebar</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-white min-w-[140px]">
                <div className="text-2xl md:text-3xl font-black">{stats.koperasiAktif}</div>
                <div className="text-xs text-gray-300 mt-0.5">Unit Ber-NIB & Sah</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Navigation Grid (Under Hero) */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a0b73e]">
              Layanan & Monitoring
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#065366] mt-1">
              Pusat Data & Informasi Koperasi Desa
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Akses statistik persebaran wilayah, modul pembelajaran, dan pelaporan rapat anggota tahunan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Dashboard Statistik */}
            <Link
              href="/pers/dashboard"
              className="p-6 rounded-[12px] border border-[#E6E8EB] bg-[#F2F3F7] hover:border-[#a0b73e] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-[10px] bg-[#E6EDEF] text-[#065366] flex items-center justify-center mb-4 group-hover:bg-[#065366] group-hover:text-white transition-colors">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#065366]">Dashboard Statistik</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Pantau statistik persebaran wilayah, modal koperasi, dampak ekonomi, serta progres pembangunan fisik di 38 provinsi.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[#065366] group-hover:text-[#a0b73e]">
                <span>Buka Statistik Nasional</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card 2: Corporate University */}
            <a
              href="https://lms.kop.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-[12px] border border-[#E6E8EB] bg-[#F2F3F7] hover:border-[#a0b73e] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-[10px] bg-[#E6EDEF] text-[#065366] flex items-center justify-center mb-4 group-hover:bg-[#065366] group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#065366]">Corporate University</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Tingkatkan kapasitas tata kelola dan kompetensi pengurus koperasi desa melalui materi pembelajaran digital bersertifikasi.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[#065366] group-hover:text-[#a0b73e]">
                <span>Akses Pembelajaran LMS</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>

            {/* Card 3: Coop Trade */}
            <a
              href="https://trade.simkopdes.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-[12px] border border-[#E6E8EB] bg-[#F2F3F7] hover:border-[#a0b73e] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-[10px] bg-[#E6EDEF] text-[#065366] flex items-center justify-center mb-4 group-hover:bg-[#065366] group-hover:text-white transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#065366]">Coop Trade</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Pusat transaksi komoditas unggulan desa yang menghubungkan koperasi desa dengan agregator dan offtaker nasional.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[#065366] group-hover:text-[#a0b73e]">
                <span>Jelajahi Coop Trade</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
