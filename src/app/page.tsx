import React from "react";
import Link from "next/link";
import { getStats, getKoperasiList, getProvinsiList } from "@/lib/data";
import { SimkopdesMap } from "@/components/map/SimkopdesMap";
import { 
  ChevronRight, 
  BarChart3, 
  ShoppingBag, 
  MapPin, 
  Building2, 
  ArrowRight,
  AlertTriangle
} from "lucide-react";

export default function HomePage() {
  const stats = getStats();
  const allKoperasi = getKoperasiList();
  const provinsiList = getProvinsiList();
  const sampleKoperasi = allKoperasi.slice(0, 6);

  const stages = [
    {
      num: "I",
      title: "Sosialisasi & Rembug Desa",
      desc: "Musyawarah pembentukan & pendataan potensi komoditas",
      count: stats.tahapCounts.tahap1,
      badge: "Inisiasi",
    },
    {
      num: "II",
      title: "Badan Hukum & Perizinan",
      desc: "Penerbitan SK Kemenkumham (AHU) & Nomor Induk Berusaha (NIB)",
      count: stats.tahapCounts.tahap2,
      badge: "Legalitas",
    },
    {
      num: "III",
      title: "Permodalan & Sarpras",
      desc: "Fasilitasi simpanan pokok/wajib, KUR, & pengadaan alat produksi",
      count: stats.tahapCounts.tahap3,
      badge: "Permodalan",
    },
    {
      num: "IV",
      title: "Kemandirian Operasional",
      desc: "Kontrak penyerapan offtaker BUMN, RAT rutin, & ekspor komoditas",
      count: stats.tahapCounts.tahap4,
      badge: "Mandiri",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Banner Section (Merah Putih Elegan) */}
      <section
        id="landing-hero"
        className="relative flex min-h-[600px] w-full flex-col overflow-hidden md:min-h-[700px] lg:h-[760px] -mt-[75px] pt-[75px]"
      >
        {/* Background Image Hero */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/new-landing-page/hero.webp)" }}
        />

        {/* Top Dark Gradient Overlay for Transparent Header Legibility */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-[#0f172a]/90 via-[#0f172a]/50 to-transparent"
          aria-hidden="true"
        />

        {/* Bottom Dark Gradient Overlay */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#0f172a] from-[15%] via-[#0f172a]/80 via-[45%] to-transparent"
          aria-hidden="true"
        />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-12 pt-24 md:px-6 md:pb-16 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px] text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-700/80 text-white text-xs font-bold tracking-wide backdrop-blur-sm border border-red-500/40">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>DEMO / MVP · Koperasi Desa Merah Putih</span>
              </span>

              <h1 className="mt-3 text-[32px] font-black leading-tight md:text-5xl text-white tracking-tight">
                Bangun Ekonomi Desa<br />
                Kokohkan Ekonomi Bangsa
              </h1>

              <p className="mt-3 text-sm md:text-base text-slate-200 leading-relaxed font-normal">
                Eksplorasi data, komoditas, dan model usaha koperasi desa. Menggunakan dataset sintetis 2026 untuk presentasi, bukan data lapangan.
              </p>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/pers/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-700 hover:bg-red-800 px-5 py-3 text-sm md:text-base font-bold text-white transition-colors shadow-md"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Buka Dashboard Statistik</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/modelling/supply-chain"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/95 hover:bg-white px-5 py-3 text-sm md:text-base font-bold text-slate-900 transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-red-700" />
                  <span>Jelajahi Modelling</span>
                </Link>
              </div>
            </div>

            {/* Quick Live Metric Cards in Hero (Bottom Right) */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3.5">
              <div className="bg-slate-900/70 backdrop-blur-md rounded-xl p-4 border border-white/15 text-white min-w-[135px]">
                <div className="text-2xl md:text-3xl font-black text-white">{stats.totalKoperasi}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Koperasi Contoh</div>
              </div>

              <div className="bg-slate-900/70 backdrop-blur-md rounded-xl p-4 border border-white/15 text-white min-w-[135px]">
                <div className="text-2xl md:text-3xl font-black text-white">38</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Provinsi Tersebar</div>
              </div>

              <div className="bg-slate-900/70 backdrop-blur-md rounded-xl p-4 border border-white/15 text-white min-w-[135px]">
                <div className="text-2xl md:text-3xl font-black text-amber-400">{allKoperasi.filter(k => Boolean(k.nib)).length}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">NIB dalam Dataset</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Pipeline Pembinaan 4 Tahap (Fitur Unggulan Kita vs Web Asli) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Siklus Transformasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Pipeline 4 Tahap Perkembangan Koperasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Pelacakan berjenjang dari musyawarah rembug desa hingga kepatuhan penyerapan offtaker mandiri
              </p>
            </div>

            <Link
              href="/pers/dashboard"
              className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 shrink-0"
            >
              <span>Detail Analitik Lengkap</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 bg-[#f8fafc] hover:border-red-600 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-red-100 text-red-800">
                      Tahap {stage.num}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{stage.badge}</span>
                  </div>

                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900">{stage.count} <span className="text-xs font-normal text-slate-500">unit</span></div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{stage.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{stage.desc}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Progres Terdata</span>
                  <span className="font-bold text-slate-800">{Math.round((stage.count / stats.totalKoperasi) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Peta Spasial Nasional (Fitur Unggulan Kita) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Sebaran Data Contoh
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-700" />
                <span>Peta Sebaran Koperasi di 38 Provinsi</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Koordinat ilustratif koperasi dalam dataset. Satu titik mewakili satu koperasi contoh.
              </p>
            </div>

            <Link
              href="/modelling/peta"
              className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 shrink-0"
            >
              <span>Buka Peta Penuh</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <SimkopdesMap
            provinsiList={provinsiList}
            koperasiList={allKoperasi}
          />
        </section>

        {/* 2 Kolom: Sampel Koperasi & Unit Perlu Atensi (Early Warning) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom 1: Sampel Koperasi Terdaftar */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-red-700" />
                  <span>Koperasi Binaan Terdaftar</span>
                </h3>
                <Link href="/koperasi" className="text-xs font-bold text-red-700 hover:underline">
                  Lihat Semua ({allKoperasi.length})
                </Link>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {sampleKoperasi.map((k) => (
                  <div key={k.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">{k.noRegistrasi}</span>
                      <Link
                        href={`/pers/dashboard/village/${k.id}?village_name=${encodeURIComponent(k.desa)}`}
                        className="text-xs font-bold text-slate-900 hover:text-red-700 transition-colors"
                      >
                        {k.nama}
                      </Link>
                      <div className="text-[11px] text-slate-500">
                        {k.desa}, {k.kabupaten} ({k.provinsiNama})
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-800 block">
                        {k.jumlahAnggota} Anggota
                      </span>
                      <span className="text-[10px] text-red-700 font-semibold">{k.komoditasUtama.slice(0, 18)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link
                href="/koperasi"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <span>Buka Tabel Direktori Nasional</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Kolom 2: Early Warning System (Unit Memerlukan Pendampingan) */}
          <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-amber-100 text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Unit Memerlukan Pendampingan Khusus
                    </h3>
                    <p className="text-[11px] text-slate-600">Catatan pendampingan dari dataset contoh</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  {allKoperasi.filter((k) => k.status === "PERLU_ATENSI").length} Unit
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {allKoperasi
                  .filter((k) => k.status === "PERLU_ATENSI")
                  .map((k) => (
                    <div key={k.id} className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-red-700 font-bold">{k.noRegistrasi}</span>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Perlu Tindak Lanjut
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{k.nama}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed bg-amber-50/80 p-2 rounded border border-amber-100">
                        {k.catatanMonitoring || "Memerlukan asistensi percepatan pengesahan badan hukum AHU dan fasilitasi KUR."}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                        <span>Ketua: {k.ketua}</span>
                        <Link
                          href={`/pers/dashboard/village/${k.id}?village_name=${encodeURIComponent(k.desa)}`}
                          className="font-bold text-red-700 hover:underline"
                        >
                          Lihat Profil →
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-amber-200">
              <Link
                href="/pers/dashboard"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                <span>Lihat Ringkasan Koperasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
