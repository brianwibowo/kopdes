import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKoperasiById, getKoperasiList, formatRupiah, formatAngka } from "@/lib/data";
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileCheck2, 
  ShieldCheck, 
  ArrowLeft, 
  Coins, 
  TrendingUp, 
  Users, 
  Truck, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  ExternalLink
} from "lucide-react";

export default async function KoperasiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const k = getKoperasiById(id);

  if (!k) {
    notFound();
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link
          href="/koperasi"
          className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Direktori</span>
        </Link>
        <span>/</span>
        <span className="text-slate-500">{k.provinsiNama}</span>
        <span>/</span>
        <span className="text-slate-300 truncate max-w-xs">{k.nama}</span>
      </div>

      {/* Profile Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded font-mono text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800/80">
              {k.noRegistrasi}
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              k.status === "AKTIF"
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                : k.status === "PERLU_ATENSI"
                ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                : "bg-blue-950/80 text-blue-300 border border-blue-800/60"
            }`}>
              {k.status === "AKTIF" ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              {k.status}
            </span>

            <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
              {k.tahap.replace(/_/g, " ")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {k.nama}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>
              {k.alamat || `${k.desa}, ${k.kecamatan}, ${k.kabupaten}, ${k.provinsiNama}`}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs text-slate-400">
          <div>Tahun Berdiri: <strong className="text-white">{k.tahunBerdiri}</strong></div>
          <div>Terdaftar Pembaruan: <span className="font-mono text-slate-300">{k.lastUpdated}</span></div>
          <a
            href={`https://maps.google.com/?q=${k.latitude},${k.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold mt-1"
          >
            <span>Buka Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Grid Profil 4 Kotak */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Aset Koperasi</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{formatRupiah(k.totalAset)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Audit Neraca Berjalan</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Volume Usaha Tahunan</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white">{formatRupiah(k.volumeUsaha)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Perputaran Komoditas</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>SHU Tahun Berjalan</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-blue-400">{formatRupiah(k.totalShu)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Sisa Hasil Usaha Bersih</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Anggota Terdaftar</span>
            <Users className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-black text-white">{formatAngka(k.jumlahAnggota)} <span className="text-xs font-normal text-slate-400">orang</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Partisipasi Aktif Desa</div>
        </div>
      </div>

      {/* Detail Konten 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Legalitas & Komoditas (2 span) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Komoditas & Model Bisnis */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-red-500" />
              <span>Komoditas Unggulan & Rantai Nilai Pasok</span>
            </h3>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <div>
                <span className="text-xs text-slate-500 block uppercase font-bold">Produk Utama:</span>
                <span className="text-base font-extrabold text-white mt-0.5 block">{k.komoditasUtama}</span>
              </div>

              {k.mitraOfftaker && (
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold">Mitra Penampung (Offtaker):</span>
                  <span className="text-sm font-semibold text-slate-300 mt-0.5 block">{k.mitraOfftaker}</span>
                </div>
              )}

              <div>
                <span className="text-xs text-slate-500 block uppercase font-bold mb-1.5">Klasifikasi Unit Usaha:</span>
                <div className="flex flex-wrap gap-2">
                  {k.jenisUsaha.map((usaha, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs border border-slate-700/60 font-medium"
                    >
                      {usaha}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Catatan Pengawasan if any */}
            {k.catatanMonitoring && (
              <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200">
                <div className="font-bold flex items-center gap-1.5 text-amber-300 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Catatan Pengawasan Lapangan:</span>
                </div>
                <p className="leading-relaxed">{k.catatanMonitoring}</p>
              </div>
            )}
          </div>

          {/* Legalitas & Perizinan */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-red-500" />
              <span>Legalitas Badan Hukum & Perizinan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">SK Kemenkumham (AHU)</span>
                <span className="font-mono font-bold text-slate-200 mt-0.5 block">{k.skBadanHukum}</span>
                <span className="text-[10px] text-emerald-400 mt-1 block">✓ Terverifikasi Sah</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Nomor Induk Berusaha (NIB)</span>
                <span className="font-mono font-bold text-slate-200 mt-0.5 block">{k.nib}</span>
                <span className="text-[10px] text-emerald-400 mt-1 block">✓ Terdaftar OSS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengurus & Lokasi (1 span) */}
        <div className="space-y-6">
          {/* Kepengurusan & Kontak */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-red-500" />
              <span>Kontak Kepengurusan</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Ketua Pengurus:</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{k.ketua}</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Nomor Telepon:</span>
                  <span className="font-mono text-slate-200 font-semibold">{k.telepon}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-500 block">Surat Elektronik:</span>
                  <span className="font-mono text-slate-200 truncate block">{k.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posisi Koordinat Spasial */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Titik Spasial Daratan</span>
            </h3>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Lintang (Latitude):</span>
                <span className="font-mono font-bold text-slate-200">{k.latitude.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bujur (Longitude):</span>
                <span className="font-mono font-bold text-slate-200">{k.longitude.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Provinsi ID:</span>
                <span className="font-mono text-slate-400">{k.provinsiId}</span>
              </div>
            </div>

            <Link
              href={`/peta`}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
            >
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Lihat di Peta Nasional</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
