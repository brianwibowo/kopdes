"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { getKoperasiList, getProvinsiList, formatRupiah, formatAngka } from "@/lib/data";
import { Pagination } from "@/components/ui/Pagination";
import { 
  Building2, 
  Search, 
  Download, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function KoperasiPage() {
  const allKoperasi = useMemo(() => getKoperasiList(), []);
  const provinsiList = useMemo(() => getProvinsiList(), []);

  const [search, setSearch] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      if (selectedStatus !== "ALL" && k.status !== selectedStatus) return false;

      return true;
    });
  }, [allKoperasi, search, selectedProvinsi, selectedStatus]);

  const handleReset = () => {
    setSearch("");
    setSelectedProvinsi("ALL");
    setSelectedStatus("ALL");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedProvinsi, selectedStatus]);

  const totalPages = Math.ceil(filteredKoperasi.length / pageSize) || 1;
  const paginatedKoperasi = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredKoperasi.slice(start, start + pageSize);
  }, [filteredKoperasi, currentPage, pageSize]);

  const exportCsv = () => {
    const headers = [
      "No Registrasi",
      "Nama Koperasi",
      "Provinsi",
      "Kabupaten",
      "Kecamatan",
      "Desa",
      "Status",
      "Komoditas Utama",
      "Jumlah Anggota",
      "Total Aset",
      "Volume Usaha",
      "Ketua",
    ];

    const rows = filteredKoperasi.map((k) => [
      `"${k.noRegistrasi}"`,
      `"${k.nama}"`,
      `"${k.provinsiNama}"`,
      `"${k.kabupaten}"`,
      `"${k.kecamatan}"`,
      `"${k.desa}"`,
      `"${k.status}"`,
      `"${k.komoditasUtama}"`,
      k.jumlahAnggota,
      k.totalAset,
      k.volumeUsaha,
      `"${k.ketua}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "# SIMKOPDES - REKAPITULASI KOPERASI DESA MERAH PUTIH\n" +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `simkopdes_koperasi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Export CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EB] gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-bold text-[#991b1b]">
              Direktori Koperasi Desa/Kelurahan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Data kelembagaan dan status legalitas Koperasi Desa Merah Putih di seluruh Indonesia
            </p>
          </div>

          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Rekap CSV</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-[10px] bg-[#F2F3F7] border border-[#E6E8EB] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama koperasi, desa, kabupaten..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white text-gray-900 text-xs pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#991b1b]"
              />
            </div>

            <select
              value={selectedProvinsi}
              onChange={(e) => setSelectedProvinsi(e.target.value)}
              className="bg-white text-gray-900 text-xs px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#991b1b]"
            >
              <option value="ALL">Semua Provinsi ({provinsiList.length})</option>
              {provinsiList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white text-gray-900 text-xs px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#991b1b]"
            >
              <option value="ALL">Semua Status Keaktifan</option>
              <option value="AKTIF">Aktif</option>
              <option value="BERKEMBANG">Berkembang</option>
              <option value="PERLU_ATENSI">Perlu Atensi</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 text-gray-600">
            <div>
              Menampilkan <strong>{filteredKoperasi.length}</strong> dari {allKoperasi.length} koperasi terdaftar
            </div>

            {(search || selectedProvinsi !== "ALL" || selectedStatus !== "ALL") && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-[#991b1b] hover:underline font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-[10px] border border-[#E6E8EB] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#F2F3F7] text-[#991b1b] font-bold uppercase text-[11px] border-b border-[#E6E8EB]">
                <tr>
                  <th className="py-3 px-4">No. Registrasi</th>
                  <th className="py-3 px-4">Nama Koperasi</th>
                  <th className="py-3 px-4">Wilayah Desa</th>
                  <th className="py-3 px-4">Provinsi</th>
                  <th className="py-3 px-4">Komoditas Utama</th>
                  <th className="py-3 px-4 text-right">Simpanan Pokok</th>
                  <th className="py-3 px-4 text-right">Simpanan Wajib</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EB]">
                {paginatedKoperasi.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-gray-500">
                      Tidak ada data koperasi yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  paginatedKoperasi.map((k) => (
                    <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#991b1b]">{k.noRegistrasi}</td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/pers/dashboard/village/${k.id}?village_name=${encodeURIComponent(k.desa)}`}
                          className="font-bold text-gray-900 hover:text-[#991b1b] hover:underline block"
                        >
                          {k.nama}
                        </Link>
                        <span className="text-[11px] text-gray-500">Ketua: {k.ketua}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {k.desa}, Kec. {k.kecamatan}
                        <div className="text-[11px] text-gray-500">{k.kabupaten}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{k.provinsiNama}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">{k.komoditasUtama}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{formatRupiah(k.totalAset * 0.3)}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{formatRupiah(k.totalAset * 0.7)}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            k.status === "AKTIF"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {k.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/pers/dashboard/village/${k.id}?village_name=${encodeURIComponent(k.desa)}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-[11px] font-bold transition-colors"
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

          {/* Pagination Controls */}
          <div className="border-t border-[#E6E8EB] bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredKoperasi.length}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 20, 50]}
              itemName="koperasi"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
