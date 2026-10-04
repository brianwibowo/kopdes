"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getKoperasiList, getProvinsiList, formatRupiah, formatAngka } from "@/lib/data";
import { 
  Building2, 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw 
} from "lucide-react";

export default function KoperasiPage() {
  const allKoperasi = useMemo(() => getKoperasiList(), []);
  const provinsiList = useMemo(() => getProvinsiList(), []);

  const [search, setSearch] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState("ALL");
  const [selectedTahap, setSelectedTahap] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const filteredKoperasi = useMemo(() => {
    return allKoperasi.filter((k) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          k.nama.toLowerCase().includes(q) ||
          k.noRegistrasi.toLowerCase().includes(q) ||
          k.desa.toLowerCase().includes(q) ||
          k.kabupaten.toLowerCase().includes(q) ||
          k.provinsiNama.toLowerCase().includes(q) ||
          k.komoditasUtama.toLowerCase().includes(q) ||
          k.ketua.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedProvinsi !== "ALL" && k.provinsiId !== selectedProvinsi) return false;
      if (selectedTahap !== "ALL" && k.tahap !== selectedTahap) return false;
      if (selectedStatus !== "ALL" && k.status !== selectedStatus) return false;

      return true;
    });
  }, [allKoperasi, search, selectedProvinsi, selectedTahap, selectedStatus]);

  const handleReset = () => {
    setSearch("");
    setSelectedProvinsi("ALL");
    setSelectedTahap("ALL");
    setSelectedStatus("ALL");
  };

  const exportCsv = () => {
    // Standard Anti-Slop R-17: Label DATA CONTOH included explicitly
    const headers = [
      "No Registrasi",
      "Nama Koperasi",
      "Provinsi",
      "Kabupaten",
      "Kecamatan",
      "Desa",
      "Status",
      "Tahap",
      "Komoditas Utama",
      "Jumlah Anggota",
      "Total Aset (IDR)",
      "Volume Usaha (IDR)",
      "Ketua",
      "Telepon",
    ];

    const rows = filteredKoperasi.map((k) => [
      `"${k.noRegistrasi}"`,
      `"${k.nama}"`,
      `"${k.provinsiNama}"`,
      `"${k.kabupaten}"`,
      `"${k.kecamatan}"`,
      `"${k.desa}"`,
      `"${k.status}"`,
      `"${k.tahap}"`,
      `"${k.komoditasUtama}"`,
      k.jumlahAnggota,
      k.totalAset,
      k.volumeUsaha,
      `"${k.ketua}"`,
      `"${k.telepon}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "# LAPORAN MONITORING KOPDES MERAH PUTIH (DATA SIMULASI CONTOH)\n" +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kdmp_direktori_koperasi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Export CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-500" />
            <span>Direktori Koperasi Desa Merah Putih</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar lengkap profil kelembagaan, permodalan, dan sebaran spasial koperasi desa
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700/80 shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Unduh Rekap CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama, desa, ketua, komoditas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Filter Provinsi */}
          <select
            value={selectedProvinsi}
            onChange={(e) => setSelectedProvinsi(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="ALL">Semua Provinsi ({provinsiList.length})</option>
            {provinsiList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>

          {/* Filter Tahap */}
          <select
            value={selectedTahap}
            onChange={(e) => setSelectedTahap(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="ALL">Semua Tahap Perkembangan</option>
            <option value="TAHAP_1_PERSIAPAN">Tahap I: Persiapan</option>
            <option value="TAHAP_2_KELEMBAGAAN">Tahap II: Kelembagaan</option>
            <option value="TAHAP_3_PERMODALAN">Tahap III: Permodalan</option>
            <option value="TAHAP_4_OPERASIONAL">Tahap IV: Operasional</option>
          </select>

          {/* Filter Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="ALL">Semua Status Keaktifan</option>
            <option value="AKTIF">Aktif</option>
            <option value="BERKEMBANG">Berkembang</option>
            <option value="PERLU_ATENSI">Perlu Atensi</option>
          </select>
        </div>

        {/* Status Count and Reset */}
        <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
          <div>
            Menampilkan <strong className="text-white">{filteredKoperasi.length}</strong> dari {allKoperasi.length} koperasi terdaftar
          </div>

          {(search || selectedProvinsi !== "ALL" || selectedTahap !== "ALL" || selectedStatus !== "ALL") && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Identitas Koperasi</th>
                <th className="py-3 px-4 font-semibold">Wilayah Administratif</th>
                <th className="py-3 px-4 font-semibold">Komoditas & Mitra</th>
                <th className="py-3 px-4 font-semibold text-right">Anggota</th>
                <th className="py-3 px-4 font-semibold text-right">Total Aset</th>
                <th className="py-3 px-4 font-semibold">Status / Tahap</th>
                <th className="py-3 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredKoperasi.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ditemukan koperasi yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredKoperasi.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono text-slate-500 block">{k.noRegistrasi}</span>
                      <Link
                        href={`/koperasi/${k.id}`}
                        className="font-bold text-white hover:text-red-400 transition-colors block text-xs"
                      >
                        {k.nama}
                      </Link>
                      <span className="text-[11px] text-slate-400">Ketua: {k.ketua}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div className="flex items-center gap-1 font-medium text-slate-200">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span>{k.desa}, {k.kecamatan}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{k.kabupaten}, {k.provinsiNama}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-200 block">{k.komoditasUtama}</span>
                      <span className="text-[10px] text-slate-400">{k.mitraOfftaker || "-"}</span>
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-slate-300">
                      {formatAngka(k.jumlahAnggota)}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      {formatRupiah(k.totalAset)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${
                          k.status === "AKTIF"
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                            : k.status === "PERLU_ATENSI"
                            ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                            : "bg-blue-950/80 text-blue-300 border border-blue-800/60"
                        }`}>
                          {k.status === "AKTIF" ? (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          ) : (
                            <AlertTriangle className="w-2.5 h-2.5" />
                          )}
                          {k.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {k.tahap.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/koperasi/${k.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 text-[11px] font-semibold transition-colors border border-slate-700/60"
                      >
                        <span>Detail</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
