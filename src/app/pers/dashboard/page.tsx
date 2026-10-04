"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getKoperasiList, getProvinsiList, getStats, formatRupiah, formatAngka } from "@/lib/data";
import { SimkopdesMap } from "@/components/map/SimkopdesMap";
import { 
  Building2, 
  Users, 
  FileText, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  Search, 
  Info,
  Calendar,
  Layers,
  Coins,
  TrendingUp,
  FileCheck2
} from "lucide-react";

export default function DashboardStatistikPage() {
  const allKoperasi = useMemo(() => getKoperasiList(), []);
  const provinsiList = useMemo(() => getProvinsiList(), []);
  const stats = useMemo(() => getStats(), []);

  const [searchQuery, setSearchQuery] = useState("");
  const [levelWilayah, setLevelWilayah] = useState("Provinsi");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Mock summary products
  const productSummary = [
    { no: 1, nama: "Beras Premium & Aromatik", volume: "24.500 Ton", nilai: 318500000000 },
    { no: 2, nama: "Kopi Arabika & Robusta Ekspor", volume: "3.200 Ton", nilai: 224000000000 },
    { no: 3, nama: "Kelapa Sawit (TBS Mandiri)", volume: "42.000 Ton", nilai: 105000000000 },
    { no: 4, nama: "Susu Sapi Segar Grade A", volume: "5.800.000 Liter", nilai: 52200000000 },
    { no: 5, nama: "Jagung Pipil Kadar Air 14%", volume: "18.400 Ton", nilai: 92000000000 },
    { no: 6, nama: "Hasil Tangkap Perikanan & Cumi", volume: "4.100 Ton", nilai: 86100000000 },
  ];

  // Map each province to aggregated stats
  const tableData = useMemo(() => {
    return provinsiList.map((p, idx) => {
      const coopsInProv = allKoperasi.filter((k) => k.provinsiId === p.id);
      const jmlKoperasi = coopsInProv.length;
      const firstCoop = coopsInProv[0];

      const simpananPokok = coopsInProv.reduce((acc, c) => acc + c.totalAset * 0.3, 0) || 500000000;
      const simpananWajib = coopsInProv.reduce((acc, c) => acc + c.totalAset * 0.7, 0) || 1200000000;
      const volumeTransaksi = coopsInProv.reduce((acc, c) => acc + c.volumeUsaha, 0) || 2800000000;
      const nilaiTransaksi = volumeTransaksi * 1.15;

      return {
        no: idx + 1,
        id: firstCoop?.id || `prov-${p.id}`,
        villageName: firstCoop?.desa || p.nama,
        provinsi: p.nama,
        provinsiId: p.id,
        jumlahKoperasi: jmlKoperasi || 1,
        koperasiNIB: jmlKoperasi || 1,
        koperasiNPWP: jmlKoperasi || 1,
        koperasiRAT: Math.max(1, Math.round((jmlKoperasi || 1) * 0.8)),
        simpananPokok,
        simpananWajib,
        volumeTransaksi,
        nilaiTransaksi,
      };
    });
  }, [provinsiList, allKoperasi]);

  const filteredTable = useMemo(() => {
    if (!searchQuery) return tableData;
    const q = searchQuery.toLowerCase();
    return tableData.filter((r) => r.provinsi.toLowerCase().includes(q));
  }, [tableData, searchQuery]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Header: Title & Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E8EB]">
          <div>
            <h1 className="text-[28px] sm:text-[36px] font-bold text-[#065366] leading-tight">
              Dashboard Statistik
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Rekapitulasi nasional perkembangan kelembagaan, permodalan, dan transaksi Koperasi Desa Merah Putih
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-[#F2F3F7] px-3 py-1.5 rounded-md border border-[#E6E8EB] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#065366]" />
              <span>Status Data Resmi Kemenkop RI</span>
            </span>
          </div>
        </div>

        {/* 4 Top Metric Cards (Exact Simkopdes style: #F2F3F7, #E6EDEF icon box, text #065366) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Koperasi */}
          <div className="flex min-h-[170px] sm:h-[190px] flex-col justify-between rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7] p-[18px] sm:p-[25px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[28px] sm:text-[34px] font-bold leading-normal text-[#065366]">
                  {stats.totalKoperasi}
                </p>
                <p className="text-[14px] font-bold leading-normal text-[#065366]">
                  Total Koperasi
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-[8px] bg-[#E6EDEF] p-3.5 text-[#065366]">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2: Memiliki Akun */}
          <div className="flex min-h-[170px] sm:h-[190px] flex-col justify-between rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7] p-[18px] sm:p-[25px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[28px] sm:text-[34px] font-bold leading-normal text-[#065366]">
                  {stats.totalKoperasi}
                </p>
                <p className="text-[14px] font-bold leading-normal text-[#065366]">
                  Koperasi Telah Memiliki Akun
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-[8px] bg-[#E6EDEF] p-3.5 text-[#065366]">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3: Memiliki NPWP */}
          <div className="flex min-h-[170px] sm:h-[190px] flex-col justify-between rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7] p-[18px] sm:p-[25px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[28px] sm:text-[34px] font-bold leading-normal text-[#065366]">
                  {stats.totalKoperasi}
                </p>
                <p className="text-[14px] font-bold leading-normal text-[#065366]">
                  Koperasi Memiliki NPWP
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-[8px] bg-[#E6EDEF] p-3.5 text-[#065366]">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Memiliki NIB */}
          <div className="flex min-h-[170px] sm:h-[190px] flex-col justify-between rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7] p-[18px] sm:p-[25px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[28px] sm:text-[34px] font-bold leading-normal text-[#065366]">
                  {stats.koperasiAktif}
                </p>
                <p className="text-[14px] font-bold leading-normal text-[#065366]">
                  Koperasi Memiliki NIB
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="rounded-[8px] bg-[#E6EDEF] p-3.5 text-[#065366]">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Persebaran Wilayah */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#065366]">Persebaran Wilayah</h2>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Status data: <strong className="text-gray-800">04/10/2026</strong></span>
              </div>

              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Muat Ulang Data</span>
              </button>

              <span className="text-gray-400">Auto Refresh (30 menit)</span>

              <div className="flex items-center gap-1.5 pl-2 border-l border-gray-300">
                <span className="text-gray-500">Level:</span>
                <select
                  value={levelWilayah}
                  onChange={(e) => setLevelWilayah(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 font-semibold focus:outline-none"
                >
                  <option value="Provinsi">Provinsi</option>
                  <option value="Kabupaten">Kabupaten/Kota</option>
                  <option value="Kecamatan">Kecamatan</option>
                  <option value="Desa">Desa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Keterangan Peta (Official Simkopdes disclaimer) */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[10px] text-xs text-[#92400E] leading-relaxed">
            <p className="font-bold mb-1">Keterangan Peta:</p>
            <p>
              Angka menunjukkan jumlah koperasi yang telah terbentuk secara kelembagaan, bukan jumlah gedung atau gerai yang telah dibangun.
            </p>
            <p className="mt-1">
              Lingkaran (bubble) pada peta bukan merupakan titik koordinat atau lokasi geografis presisi KDKMP. Posisi bubble digunakan sebagai visualisasi representatif pada wilayah provinsi, sedangkan angka di dalam bubble menunjukkan jumlah KDKMP yang terdapat pada provinsi tersebut.
            </p>
          </div>

          {/* Simkopdes Light Map */}
          <SimkopdesMap
            provinsiList={provinsiList}
            koperasiList={allKoperasi}
          />
        </div>

        {/* Section: Modal Koperasi */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold text-[#065366]">Modal Koperasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-sm font-semibold text-gray-600 block">Simpanan Pokok</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#065366] mt-2 block">
                {formatRupiah(stats.totalAset * 0.32)}
              </span>
              <span className="text-xs text-gray-500 mt-1 block">Setoran awal seluruh anggota per Des 2026</span>
            </div>

            <div className="p-6 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-sm font-semibold text-gray-600 block">Simpanan Wajib</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#065366] mt-2 block">
                {formatRupiah(stats.totalAset * 0.68)}
              </span>
              <span className="text-xs text-gray-500 mt-1 block">Iuran berkala anggota dalam operasional</span>
            </div>
          </div>
        </div>

        {/* Section: Dampak Ekonomi */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold text-[#065366]">Dampak Ekonomi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="p-6 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-sm font-semibold text-gray-600 block">Volume Transaksi (2026)</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#065366] mt-2 block">
                {formatRupiah(stats.totalVolumeUsaha)}
              </span>
            </div>

            <div className="p-6 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-sm font-semibold text-gray-600 block">Nilai Transaksi (2026)</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#065366] mt-2 block">
                {formatRupiah(stats.totalVolumeUsaha * 1.18)}
              </span>
            </div>
          </div>

          {/* Table of Products */}
          <div className="rounded-[10px] border border-[#E6E8EB] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F2F3F7] text-[#065366] font-bold text-xs uppercase border-b border-[#E6E8EB]">
                <tr>
                  <th className="py-3 px-4 w-16">No</th>
                  <th className="py-3 px-4">Nama Produk</th>
                  <th className="py-3 px-4">Volume Transaksi (2026)</th>
                  <th className="py-3 px-4 text-right">Nilai Transaksi (2026)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EB]">
                {productSummary.map((p) => (
                  <tr key={p.no} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">{p.no}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{p.nama}</td>
                    <td className="py-3 px-4 text-gray-600">{p.volume}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#065366]">
                      {formatRupiah(p.nilai)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Aktivitas Rapat Anggota Tahunan */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold text-[#065366]">Aktivitas Rapat Anggota Tahunan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-xs font-semibold text-gray-600 block">Telah Melaksanakan RAT</span>
              <span className="text-2xl font-bold text-[#065366] mt-1 block">38</span>
              <span className="text-[11px] text-gray-500">Koperasi</span>
            </div>

            <div className="p-4 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-xs font-semibold text-gray-600 block">Total RAT dilaporkan</span>
              <span className="text-2xl font-bold text-[#065366] mt-1 block">38</span>
              <span className="text-[11px] text-gray-500">Laporan</span>
            </div>

            <div className="p-4 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-xs font-semibold text-gray-600 block">Total diverifikasi Dinas</span>
              <span className="text-2xl font-bold text-[#065366] mt-1 block">35</span>
              <span className="text-[11px] text-gray-500">Koperasi</span>
            </div>

            <div className="p-4 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-xs font-semibold text-gray-600 block">Sedang RAT (draft)</span>
              <span className="text-2xl font-bold text-[#065366] mt-1 block">8</span>
              <span className="text-[11px] text-gray-500">Koperasi</span>
            </div>

            <div className="p-4 rounded-[10px] border border-[#E6E8EB] bg-[#F2F3F7]">
              <span className="text-xs font-semibold text-gray-600 block">Koperasi Belum RAT</span>
              <span className="text-2xl font-bold text-[#065366] mt-1 block">4</span>
              <span className="text-[11px] text-gray-500">Koperasi</span>
            </div>
          </div>
        </div>

        {/* Section: Data Wilayah Provinsi (Comprehensive Table with Link to Detail Desa) */}
        <div className="space-y-4 pt-4 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#065366]">Data Wilayah Provinsi</h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari provinsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#065366]"
              />
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E6E8EB] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#F2F3F7] text-[#065366] font-bold uppercase text-[11px] border-b border-[#E6E8EB]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Provinsi</th>
                    <th className="py-3 px-4 text-center">Jumlah Koperasi</th>
                    <th className="py-3 px-4 text-center">Memiliki NIB</th>
                    <th className="py-3 px-4 text-center">Memiliki NPWP</th>
                    <th className="py-3 px-4 text-center">Telah RAT (2025)</th>
                    <th className="py-3 px-4 text-right">Simpanan Pokok</th>
                    <th className="py-3 px-4 text-right">Simpanan Wajib</th>
                    <th className="py-3 px-4 text-right">Nilai Transaksi (2026)</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E8EB]">
                  {filteredTable.map((row) => (
                    <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-center text-gray-500 font-medium">{row.no}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{row.provinsi}</td>
                      <td className="py-3 px-4 text-center font-bold text-[#065366]">{row.jumlahKoperasi}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{row.koperasiNIB}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{row.koperasiNPWP}</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-semibold">{row.koperasiRAT}</td>
                      <td className="py-3 px-4 text-right text-gray-800">{formatRupiah(row.simpananPokok)}</td>
                      <td className="py-3 px-4 text-right text-gray-800">{formatRupiah(row.simpananWajib)}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#065366]">{formatRupiah(row.nilaiTransaksi)}</td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/pers/dashboard/village/${row.id}?village_name=${encodeURIComponent(row.villageName)}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#065366] hover:bg-[#044352] text-white text-[11px] font-bold transition-colors"
                        >
                          <span>Detail</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
