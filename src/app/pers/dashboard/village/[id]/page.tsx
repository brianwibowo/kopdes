import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKoperasiById, getKoperasiList, formatRupiah, formatAngka } from "@/lib/data";
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  FileText, 
  Award, 
  MapPin, 
  Coins, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Truck,
  ExternalLink,
  ShoppingBag
} from "lucide-react";

export default async function VillageDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ village_name?: string }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const all = getKoperasiList();

  let coop = getKoperasiById(id) || all.find((k) => k.id.includes(id)) || all[0];

  const villageName = sParams.village_name || coop.desa;
  const simpananPokok = coop.totalAset * 0.3;
  const simpananWajib = coop.totalAset * 0.7;

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/pers/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Statistik</span>
          </Link>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-red-700"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-red-700" />
            <span>Cari di Marketplace Komoditas</span>
          </Link>
        </div>

        {/* Title & Geographical Breadcrumbs */}
        <div className="space-y-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
              {coop.noRegistrasi}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Profil Wilayah Desa</span>
          </div>

          <h1 className="text-[28px] sm:text-[34px] font-black text-slate-900 tracking-tight">
            Detail Desa/Kelurahan: {villageName}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-[#f8fafc] text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              Provinsi: <strong className="text-slate-900">{coop.provinsiNama}</strong>
            </span>
            <span className="bg-[#f8fafc] text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              Kabupaten/Kota: <strong className="text-slate-900">{coop.kabupaten}</strong>
            </span>
            <span className="bg-[#f8fafc] text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              Kecamatan: <strong className="text-slate-900">{coop.kecamatan}</strong>
            </span>
            <span className="bg-red-50 text-red-900 px-3 py-1.5 rounded-lg border border-red-200 font-bold">
              Desa: {villageName}
            </span>
          </div>
        </div>

        {/* 4 Cards (Total Koperasi, Memiliki Akun, Memiliki NPWP, Memiliki NIB) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex min-h-[155px] flex-col justify-between rounded-xl border border-slate-200 bg-[#f8fafc] p-5 shadow-2xs">
            <div>
              <p className="text-[32px] font-black text-slate-900 leading-none">1</p>
              <p className="text-xs font-bold text-slate-700 mt-2">Total Koperasi Terbentuk</p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-lg bg-red-100/70 p-2.5 text-red-700">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex min-h-[155px] flex-col justify-between rounded-xl border border-slate-200 bg-[#f8fafc] p-5 shadow-2xs">
            <div>
              <p className="text-[32px] font-black text-slate-900 leading-none">1</p>
              <p className="text-xs font-bold text-slate-700 mt-2">Telah Memiliki Akun</p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-lg bg-red-100/70 p-2.5 text-red-700">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex min-h-[155px] flex-col justify-between rounded-xl border border-slate-200 bg-[#f8fafc] p-5 shadow-2xs">
            <div>
              <p className="text-[32px] font-black text-slate-900 leading-none">1</p>
              <p className="text-xs font-bold text-slate-700 mt-2">NPWP Terdaftar</p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-lg bg-red-100/70 p-2.5 text-red-700">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex min-h-[155px] flex-col justify-between rounded-xl border border-slate-200 bg-[#f8fafc] p-5 shadow-2xs">
            <div>
              <p className="text-[32px] font-black text-red-700 leading-none">1</p>
              <p className="text-xs font-bold text-slate-700 mt-2">NIB Sah Berizin</p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-lg bg-red-100/70 p-2.5 text-red-700">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Modal Koperasi */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Modal Koperasi Desa</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Tahun Buku: <strong className="text-slate-900">2026</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Simpanan Pokok</span>
              <span className="text-2xl font-black text-slate-900 mt-2 block">
                {formatRupiah(simpananPokok)}
              </span>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Simpanan Wajib</span>
              <span className="text-2xl font-black text-red-700 mt-2 block">
                {formatRupiah(simpananWajib)}
              </span>
            </div>
          </div>
        </div>

        {/* Section: Dampak Ekonomi & Rantai Pasok Offtaker */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Dampak Ekonomi & Rantai Pasok Offtaker</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Volume Transaksi (2026)</span>
              <span className="text-2xl font-black text-slate-900 mt-2 block">
                {formatRupiah(coop.volumeUsaha)}
              </span>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Estimasi Nilai Transaksi</span>
              <span className="text-2xl font-black text-emerald-700 mt-2 block">
                {formatRupiah(coop.volumeUsaha * 1.15)}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-14 text-center">No</th>
                  <th className="py-3 px-4">Nama Produk / Komoditas Desa</th>
                  <th className="py-3 px-4">Mitra Penyerapan (Offtaker Resmi)</th>
                  <th className="py-3 px-4 text-right">Nilai Transaksi (2026)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-center text-slate-400">1</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{coop.komoditasUtama}</td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">{coop.mitraOfftaker || "BUMDes Bersama & Agregator BUMN"}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    {formatRupiah(coop.volumeUsaha)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Aktivitas Rapat Anggota Tahunan */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Aktivitas Rapat Anggota Tahunan & Tata Kelola</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-semibold text-slate-600 block">Status Pelaksanaan RAT</span>
              <span className="text-lg font-black text-emerald-700 mt-1 block">Telah Melaksanakan RAT</span>
              <span className="text-xs text-slate-500">Kepatuhan Tahun Buku 2025</span>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-semibold text-slate-600 block">Verifikasi Dinas Koperasi</span>
              <span className="text-lg font-black text-slate-900 mt-1 block">Lolos Verifikasi Sah</span>
              <span className="text-xs text-slate-500">Tercatat di Sistem Resmi</span>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-semibold text-slate-600 block">Pengesahan SK Kemenkumham</span>
              <span className="text-lg font-black text-slate-900 mt-1 block truncate">{coop.skBadanHukum}</span>
              <span className="text-xs text-slate-500">Nomor Registrasi AHU</span>
            </div>
          </div>
        </div>

        {/* Section: Tabel Data Desa/Kelurahan */}
        <div className="space-y-4 pb-12">
          <h2 className="text-xl font-black text-slate-900">
            Data Unit Koperasi Terdaftar di {coop.kecamatan}
          </h2>

          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#f8fafc] text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Koperasi & Desa</th>
                  <th className="py-3 px-4 text-center">Anggota</th>
                  <th className="py-3 px-4 text-center">NIB</th>
                  <th className="py-3 px-4 text-center">NPWP</th>
                  <th className="py-3 px-4 text-center">RAT</th>
                  <th className="py-3 px-4 text-right">Simpanan Pokok</th>
                  <th className="py-3 px-4 text-right">Simpanan Wajib</th>
                  <th className="py-3 px-4 text-right">Nilai Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-center text-slate-400">1</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{coop.nama}</span>
                    <span className="text-slate-500 text-[11px]">Desa {villageName}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900">{coop.jumlahAnggota} org</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">✓ Ada</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">✓ Ada</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">✓ Ya</td>
                  <td className="py-3 px-4 text-right text-slate-800">{formatRupiah(simpananPokok)}</td>
                  <td className="py-3 px-4 text-right text-slate-800">{formatRupiah(simpananWajib)}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    {formatRupiah(coop.volumeUsaha)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
