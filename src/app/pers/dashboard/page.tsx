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
  Download,
  ShoppingBag
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

  // Mock summary products connected to marketplace
  const productSummary = [
    { no: 1, nama: "Beras Premium & Aromatik", volume: "24.500 Ton", nilai: 318500000000, offtaker: "Perum Bulog Kanwil" },
    { no: 2, nama: "Kopi Arabika & Robusta Ekspor", volume: "3.200 Ton", nilai: 224000000000, offtaker: "PT Perkebunan Nusantara & Eksportir" },
    { no: 3, nama: "Kelapa Sawit (TBS Mandiri)", volume: "42.000 Ton", nilai: 105000000000, offtaker: "PTPN IV PalmCo" },
    { no: 4, nama: "Susu Sapi Segar Grade A", volume: "5.800.000 Liter", nilai: 52200000000, offtaker: "PT Ultra Jaya & Frisian Flag" },
    { no: 5, nama: "Jagung Pipil Kadar Air 14%", volume: "18.400 Ton", nilai: 92000000000, offtaker: "PT Charoen Pokphand" },
    { no: 6, nama: "Hasil Tangkap Perikanan & Cumi", volume: "4.100 Ton", nilai: 86100000000, offtaker: "Perum Perindo & Industri Pengalengan" },
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

  const exportCsv = () => {
    const headers = [
      "No",
      "Provinsi",
      "Jumlah Koperasi",
      "Koperasi Memiliki NIB",
      "Koperasi Memiliki NPWP",
      "Koperasi Telah RAT",
      "Simpanan Pokok (IDR)",
      "Simpanan Wajib (IDR)",
      "Nilai Transaksi (IDR)",
    ];

    const rows = filteredTable.map((r) => [
      r.no,
      `"${r.provinsi}"`,
      r.jumlahKoperasi,
      r.koperasiNIB,
      r.koperasiNPWP,
      r.koperasiRAT,
      r.simpananPokok,
      r.simpananWajib,
      r.nilaiTransaksi,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "# REKAPITULASI STATISTIK NASIONAL KOPDES MERAH PUTIH (38 PROVINSI)\n" +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kdmp_statistik_nasional_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Header: Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-700" />
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Portal Statistik & Pemantauan
              </span>
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-black text-slate-900 leading-tight mt-0.5">
              Dashboard Statistik Nasional
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Rekapitulasi nasional perkembangan kelembagaan, permodalan, dan transaksi Koperasi Desa Merah Putih di 38 provinsi
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-red-700" />
              <span>Unduh CSV</span>
            </button>

            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Lihat Marketplace</span>
            </Link>
          </div>
        </div>

        {/* 4 Top Metric Cards (Merah Putih Elegan: Putih, border slate, ikon red-50) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Koperasi */}
          <div className="flex min-h-[170px] sm:h-[185px] flex-col justify-between rounded-xl border border-slate-200 bg-[#f8fafc] p-6 shadow-2xs">
            <div>
              <p className="text-[28px] sm:text-[34px] font-black text-slate-900 leading-none">
                {stats.totalKoperasi}
              </p>
              <p className="text-[14px] font-bold text-slate-700 mt-2">
                Total Koperasi Binaan
              </p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-lg bg-red-100/70 p-3 text-red-700">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2: Memiliki Akun */}
          <div className="flex min-h-[170px] sm:h-[185px] flex-col justify-between rounded-xl border border-slate-200 bg-[#f8fafc] p-6 shadow-2xs">
            <div>
              <p className="text-[28px] sm:text-[34px] font-black text-slate-900 leading-none">
                {stats.totalKoperasi}
              </p>
              <p className="text-[14px] font-bold text-slate-700 mt-2">
                Koperasi Telah Memiliki Akun
              </p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-lg bg-red-100/70 p-3 text-red-700">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3: Memiliki NPWP */}
          <div className="flex min-h-[170px] sm:h-[185px] flex-col justify-between rounded-xl border border-slate-200 bg-[#f8fafc] p-6 shadow-2xs">
            <div>
              <p className="text-[28px] sm:text-[34px] font-black text-slate-900 leading-none">
                {stats.totalKoperasi}
              </p>
              <p className="text-[14px] font-bold text-slate-700 mt-2">
                Koperasi Memiliki NPWP
              </p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-lg bg-red-100/70 p-3 text-red-700">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Memiliki NIB */}
          <div className="flex min-h-[170px] sm:h-[185px] flex-col justify-between rounded-xl border border-slate-200 bg-[#f8fafc] p-6 shadow-2xs">
            <div>
              <p className="text-[28px] sm:text-[34px] font-black text-red-700 leading-none">
                {stats.koperasiAktif}
              </p>
              <p className="text-[14px] font-bold text-slate-700 mt-2">
                Koperasi Memiliki NIB Sah
              </p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-lg bg-red-100/70 p-3 text-red-700">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Persebaran Wilayah */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Persebaran Wilayah</h2>
              <p className="text-xs text-slate-500">Pemetaan representatif sebaran koperasi desa di 38 provinsi</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Pembaruan: <strong className="text-slate-900">Oktober 2026</strong></span>
              </div>

              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs font-semibold"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-red-700 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Muat Ulang Data</span>
              </button>

              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-slate-500">Tingkat Wilayah:</span>
                <select
                  value={levelWilayah}
                  onChange={(e) => setLevelWilayah(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="Provinsi">Provinsi (38)</option>
                  <option value="Kabupaten">Kabupaten/Kota</option>
                  <option value="Desa">Desa / Kelurahan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Keterangan Peta */}
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 leading-relaxed">
            <p className="font-bold mb-1 flex items-center gap-1.5 text-amber-950">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Keterangan Peta:</span>
            </p>
            <p>
              Angka menunjukkan jumlah koperasi yang telah terbentuk secara kelembagaan di tiap provinsi. Titik koordinat telah divalidasi berada di daratan wilayah Indonesia dan dapat diperbesar hingga tingkat desa.
            </p>
          </div>

          {/* Simkopdes Light Map */}
          <SimkopdesMap
            provinsiList={provinsiList}
            koperasiList={allKoperasi}
          />
        </div>

        {/* Section: Modal Koperasi */}
        <div className="space-y-4 pt-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Modal Koperasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Simpanan Pokok</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 block">
                {formatRupiah(stats.totalAset * 0.32)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Setoran awal wajib seluruh anggota per 2026</span>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Simpanan Wajib</span>
              <span className="text-2xl sm:text-3xl font-black text-red-700 mt-2 block">
                {formatRupiah(stats.totalAset * 0.68)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Akumulasi iuran berkala penguatan likuiditas desa</span>
            </div>
          </div>
        </div>

        {/* Section: Dampak Ekonomi */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dampak Ekonomi & Rantai Komoditas</h2>
            <Link href="/marketplace" className="text-xs font-bold text-red-700 hover:underline flex items-center gap-1">
              <span>Buka Marketplace Komoditas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Volume Transaksi (2026)</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 block">
                {formatRupiah(stats.totalVolumeUsaha)}
              </span>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Nilai Transaksi (2026)</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2 block">
                {formatRupiah(stats.totalVolumeUsaha * 1.18)}
              </span>
            </div>
          </div>

          {/* Table of Products */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-14 text-center">No</th>
                  <th className="py-3 px-4">Nama Produk / Komoditas Unggulan</th>
                  <th className="py-3 px-4">Estimasi Volume Pasokan</th>
                  <th className="py-3 px-4">Mitra Penyerapan (Offtaker)</th>
                  <th className="py-3 px-4 text-right">Nilai Transaksi (2026)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {productSummary.map((p) => (
                  <tr key={p.no} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">{p.no}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.nama}</td>
                    <td className="py-3 px-4 text-slate-600">{p.volume}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{p.offtaker}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      {formatRupiah(p.nilai)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Aktivitas Rapat Anggota Tahunan */}
        <div className="space-y-4 pt-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Aktivitas Rapat Anggota Tahunan (RAT)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-semibold text-slate-600 block">Telah Melaksanakan RAT</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">38</span>
              <span className="text-[11px] text-slate-500">Koperasi</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-semibold text-slate-600 block">Total RAT dilaporkan</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">38</span>
              <span className="text-[11px] text-slate-500">Laporan</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-semibold text-slate-600 block">Total diverifikasi Dinas</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">35</span>
              <span className="text-[11px] text-slate-500">Koperasi</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-semibold text-slate-600 block">Sedang RAT (draft)</span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">8</span>
              <span className="text-[11px] text-slate-500">Koperasi</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc]">
              <span className="text-xs font-semibold text-slate-600 block">Koperasi Belum RAT</span>
              <span className="text-2xl font-black text-red-700 mt-1 block">4</span>
              <span className="text-[11px] text-slate-500">Koperasi</span>
            </div>
          </div>
        </div>

        {/* Section: Data Wilayah Provinsi */}
        <div className="space-y-4 pt-2 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Data Wilayah Provinsi</h2>
              <p className="text-xs text-slate-500">Rekapitulasi lengkap 38 provinsi di seluruh Indonesia</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama provinsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-red-700 bg-white"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#f8fafc] text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
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
                <tbody className="divide-y divide-slate-100">
                  {filteredTable.map((row) => (
                    <tr key={row.no} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">{row.no}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.provinsi}</td>
                      <td className="py-3 px-4 text-center font-bold text-red-700">{row.jumlahKoperasi}</td>
                      <td className="py-3 px-4 text-center text-slate-700">{row.koperasiNIB}</td>
                      <td className="py-3 px-4 text-center text-slate-700">{row.koperasiNPWP}</td>
                      <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{row.koperasiRAT}</td>
                      <td className="py-3 px-4 text-right text-slate-800">{formatRupiah(row.simpananPokok)}</td>
                      <td className="py-3 px-4 text-right text-slate-800">{formatRupiah(row.simpananWajib)}</td>
                      <td className="py-3 px-4 text-right font-black text-slate-900">{formatRupiah(row.nilaiTransaksi)}</td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/pers/dashboard/village/${row.id}?village_name=${encodeURIComponent(row.villageName)}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold transition-colors shadow-2xs"
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
