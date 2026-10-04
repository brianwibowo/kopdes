import React from "react";
import Link from "next/link";
import { getKoperasiList, getProvinsiList, getStats, formatRupiah } from "@/lib/data";
import { StatCards } from "@/components/dashboard/StatCards";
import { TahapFunnel } from "@/components/dashboard/TahapFunnel";
import { PerluAtensiList } from "@/components/dashboard/PerluAtensiList";
import { IndonesiaMap } from "@/components/map/IndonesiaMap";
import { 
  MapPin, 
  Building2, 
  ArrowRight, 
  Download, 
  Compass, 
  CheckCircle2, 
  Layers,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const stats = getStats();
  const allKoperasi = getKoperasiList();
  const provinsiList = getProvinsiList();
  const sampleKoperasi = allKoperasi.slice(0, 6);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero / Header Ringkasan Eksekutif */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider">
            <span>Platform Pengawasan Nasional</span>
            <span>•</span>
            <span className="text-slate-400">Pembaruan Spasial 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Monitoring Koperasi Desa Merah Putih
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Pusat analitik spasial dan pengawasan perkembangan koperasi desa se-Indonesia. 
            Menyajikan transparansi data sebaran, tahapan legalitas, hingga performa komoditas mandiri.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/peta"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-md"
          >
            <Compass className="w-4 h-4" />
            <span>Buka Peta Sebaran</span>
          </Link>

          <Link
            href="/koperasi"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700/80"
          >
            <Building2 className="w-4 h-4" />
            <span>Direktori Data ({stats.totalKoperasi})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <StatCards stats={stats} />

      {/* Interactive Map Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Peta Sebaran Koperasi di 38 Provinsi</span>
            </h2>
            <p className="text-xs text-slate-400">
              Pilih titik penanda untuk memeriksa ringkasan profil dan koordinat desa
            </p>
          </div>
          <Link
            href="/peta"
            className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Tampilan Peta Layar Penuh</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <IndonesiaMap
          koperasiList={allKoperasi}
          provinsiList={provinsiList}
          height="h-[520px]"
        />
      </div>

      {/* Progres Tahapan Funnel */}
      <TahapFunnel stats={stats} />

      {/* Two Columns: Recent Koperasi & Perlu Atensi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Koperasi Unggulan / Terdata */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Sampel Koperasi Mandiri Terpilih
              </h3>
              <Link href="/koperasi" className="text-xs text-red-400 hover:underline">
                Lihat Semua ({allKoperasi.length})
              </Link>
            </div>

            <div className="mt-3 divide-y divide-slate-800/60">
              {sampleKoperasi.map((k) => (
                <div key={k.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono text-slate-500">{k.noRegistrasi}</div>
                    <Link
                      href={`/koperasi/${k.id}`}
                      className="text-xs font-bold text-white hover:text-red-400 transition-colors"
                    >
                      {k.nama}
                    </Link>
                    <div className="text-[11px] text-slate-400">
                      {k.desa}, {k.kabupaten} ({k.provinsiNama})
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-emerald-400 block">
                      {formatRupiah(k.totalAset)}
                    </span>
                    <span className="text-[10px] text-slate-500">{k.komoditasUtama.slice(0, 20)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-800/80">
            <Link
              href="/koperasi"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700/60"
            >
              <span>Jelajahi Seluruh Direktori Koperasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Unit Memerlukan Pendampingan */}
        <PerluAtensiList koperasiList={allKoperasi} />
      </div>
    </div>
  );
}
