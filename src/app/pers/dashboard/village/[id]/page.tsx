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
  ExternalLink
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

  // Find coop by id, or default to first if not found
  let coop = getKoperasiById(id) || all.find((k) => k.id.includes(id)) || all[0];

  const villageName = sParams.village_name || coop.desa;
  const simpananPokok = coop.totalAset * 0.3;
  const simpananWajib = coop.totalAset * 0.7;

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/pers/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#065366] hover:text-[#044352] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Statistik</span>
          </Link>
        </div>

        {/* Title & Geographical Breadcrumbs */}
        <div className="space-y-3 pb-4 border-b border-[#E6E8EB]">
          <h1 className="text-[28px] sm:text-[34px] font-bold text-[#065366]">
            Detail Desa/Kelurahan: {villageName}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-[#F2F3F7] text-gray-700 px-3 py-1.5 rounded-md border border-[#E6E8EB]">
              Provinsi: <strong className="text-[#065366]">{coop.provinsiNama}</strong>
            </span>
            <span className="bg-[#F2F3F7] text-gray-700 px-3 py-1.5 rounded-md border border-[#E6E8EB]">
              Kabupaten/Kota: <strong className="text-[#065366]">{coop.kabupaten}</strong>
            </span>
            <span className="bg-[#F2F3F7] text-gray-700 px-3 py-1.5 rounded-md border border-[#E6E8EB]">
              Kecamatan: <strong className="text-[#065366]">{coop.kecamatan}</strong>
            </span>
            <span className="bg-[#E6EDEF] text-[#065366] px-3 py-1.5 rounded-md border border-[#065366]/20 font-bold">
              Desa/Kelurahan: {villageName}
            </span>
          </div>
        </div>

        {/* 4 Cards (Total Koperasi, Memiliki Akun, Memiliki NPWP, Memiliki NIB) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex min-h-[160px] flex-col justify-between rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7] p-[20px]">
            <div>
              <p className="text-[32px] font-bold text-[#065366]">1</p>
              <p className="text-[14px] font-bold text-[#065366]">Total Koperasi</p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-[8px] bg-[#E6EDEF] p-3 text-[#065366]">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex min-h-[160px] flex-col justify-between rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7] p-[20px]">
            <div>
              <p className="text-[32px] font-bold text-[#065366]">1</p>
              <p className="text-[14px] font-bold text-[#065366]">Koperasi Telah Memiliki Akun</p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-[8px] bg-[#E6EDEF] p-3 text-[#065366]">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex min-h-[160px] flex-col justify-between rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7] p-[20px]">
            <div>
              <p className="text-[32px] font-bold text-[#065366]">1</p>
              <p className="text-[14px] font-bold text-[#065366]">Koperasi Memiliki NPWP</p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-[8px] bg-[#E6EDEF] p-3 text-[#065366]">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex min-h-[160px] flex-col justify-between rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7] p-[20px]">
            <div>
              <p className="text-[32px] font-bold text-[#065366]">1</p>
              <p className="text-[14px] font-bold text-[#065366]">Koperasi Memiliki NIB</p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-[8px] bg-[#E6EDEF] p-3 text-[#065366]">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Modal Koperasi */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#065366]">Modal Koperasi</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span>Tahun Buku: <strong>2026</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-sm font-semibold text-gray-600 block">Simpanan Pokok</span>
              <span className="text-2xl font-bold text-[#065366] mt-2 block">
                {formatRupiah(simpananPokok)}
              </span>
            </div>

            <div className="p-6 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-sm font-semibold text-gray-600 block">Simpanan Wajib</span>
              <span className="text-2xl font-bold text-[#065366] mt-2 block">
                {formatRupiah(simpananWajib)}
              </span>
            </div>
          </div>
        </div>

        {/* Section: Dampak Ekonomi */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#065366]">Dampak Ekonomi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <div className="p-6 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-sm font-semibold text-gray-600 block">Volume Transaksi (2026)</span>
              <span className="text-2xl font-bold text-[#065366] mt-2 block">
                {formatRupiah(coop.volumeUsaha)}
              </span>
            </div>

            <div className="p-6 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-sm font-semibold text-gray-600 block">Nilai Transaksi (2026)</span>
              <span className="text-2xl font-bold text-[#065366] mt-2 block">
                {formatRupiah(coop.volumeUsaha * 1.15)}
              </span>
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E6E8EB] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F2F3F7] text-[#065366] font-bold text-xs uppercase border-b border-[#E6E8EB]">
                <tr>
                  <th className="py-3 px-4 w-16">No</th>
                  <th className="py-3 px-4">Nama Produk / Komoditas Desa</th>
                  <th className="py-3 px-4">Mitra Penampung (Offtaker)</th>
                  <th className="py-3 px-4 text-right">Nilai Transaksi (2026)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EB]">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">1</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{coop.komoditasUtama}</td>
                  <td className="py-3 px-4 text-gray-600">{coop.mitraOfftaker || "BUMDes Bersama & Agregator Nasional"}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#065366]">
                    {formatRupiah(coop.volumeUsaha)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Aktivitas Rapat Anggota Tahunan */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#065366]">Aktivitas Rapat Anggota Tahunan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-xs font-semibold text-gray-600 block">Status Pelaksanaan RAT</span>
              <span className="text-lg font-bold text-emerald-700 mt-1 block">Telah Melaksanakan RAT</span>
              <span className="text-xs text-gray-500">Tahun Buku 2025</span>
            </div>

            <div className="p-4 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-xs font-semibold text-gray-600 block">Verifikasi Dinas Daerah</span>
              <span className="text-lg font-bold text-[#065366] mt-1 block">Lolos Verifikasi</span>
              <span className="text-xs text-gray-500">Surat Pengesahan Dinas Koperasi</span>
            </div>

            <div className="p-4 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-xs font-semibold text-gray-600 block">Kesiapan Fisik Gerai</span>
              <span className="text-lg font-bold text-[#065366] mt-1 block">100% Siap</span>
              <span className="text-xs text-gray-500">Operasional Mandiri</span>
            </div>
          </div>
        </div>

        {/* Section: Tabel Data Desa/Kelurahan */}
        <div className="space-y-4 pb-12">
          <h2 className="text-xl font-bold text-[#065366]">
            Data Desa/Kelurahan di {coop.kecamatan}
          </h2>

          <div className="rounded-[10px] border border-[#E6E8EB] overflow-hidden">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#F2F3F7] text-[#065366] font-bold uppercase text-[11px] border-b border-[#E6E8EB]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Koperasi & Desa</th>
                  <th className="py-3 px-4 text-center">Jumlah Koperasi</th>
                  <th className="py-3 px-4 text-center">NIB</th>
                  <th className="py-3 px-4 text-center">NPWP</th>
                  <th className="py-3 px-4 text-center">RAT (2025)</th>
                  <th className="py-3 px-4 text-right">Simpanan Pokok</th>
                  <th className="py-3 px-4 text-right">Simpanan Wajib</th>
                  <th className="py-3 px-4 text-right">Nilai Transaksi (2026)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EB]">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-center text-gray-500">1</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900 block">{coop.nama}</span>
                    <span className="text-gray-500 text-[11px]">Desa {villageName}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-[#065366]">1</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Ada</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Ada</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Ya</td>
                  <td className="py-3 px-4 text-right text-gray-800">{formatRupiah(simpananPokok)}</td>
                  <td className="py-3 px-4 text-right text-gray-800">{formatRupiah(simpananWajib)}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#065366]">
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
