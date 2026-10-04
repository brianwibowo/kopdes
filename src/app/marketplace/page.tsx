"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { getKoperasiList, formatRupiah, formatAngka } from "@/lib/data";
import { Pagination } from "@/components/ui/Pagination";
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Building2, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Filter,
  Package
} from "lucide-react";

export default function MarketplacePage() {
  const allKoperasi = useMemo(() => getKoperasiList(), []);

  const [search, setSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("ALL");
  const [selectedProvinsi, setSelectedProvinsi] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const categories = [
    { id: "ALL", label: "Semua Komoditas" },
    { id: "Beras", label: "Padi & Beras" },
    { id: "Kopi", label: "Kopi & Kakao" },
    { id: "Susu", label: "Peternakan & Susu" },
    { id: "Sawit", label: "Perkebunan & Sawit" },
    { id: "Ikan", label: "Perikanan & Bahari" },
    { id: "Rempah", label: "Rempah & Hortikultura" },
  ];

  const commodities = useMemo(() => {
    return allKoperasi.map((k) => {
      let kategori = "Lainnya";
      const name = k.komoditasUtama.toLowerCase();
      if (name.includes("beras") || name.includes("padi")) kategori = "Beras";
      else if (name.includes("kopi") || name.includes("kakao") || name.includes("cokelat")) kategori = "Kopi";
      else if (name.includes("susu") || name.includes("daging") || name.includes("sapi") || name.includes("bebek")) kategori = "Susu";
      else if (name.includes("sawit") || name.includes("karet") || name.includes("tebu")) kategori = "Sawit";
      else if (name.includes("ikan") || name.includes("udang") || name.includes("kerapu") || name.includes("cumi")) kategori = "Ikan";
      else if (name.includes("lada") || name.includes("pala") || name.includes("cengkih") || name.includes("sayur") || name.includes("bawang") || name.includes("nanas")) kategori = "Rempah";

      return {
        id: k.id,
        nama: k.komoditasUtama,
        kategori,
        koperasiNama: k.nama,
        noRegistrasi: k.noRegistrasi,
        desa: k.desa,
        kabupaten: k.kabupaten,
        provinsiNama: k.provinsiNama,
        provinsiId: k.provinsiId,
        offtaker: k.mitraOfftaker || "BUMDes Bersama & Agregator Nasional",
        volume: `${formatAngka(Math.round(Number(k.volumeUsaha) / 10000000))} Ton/Tahun`,
        nilai: k.volumeUsaha,
        telepon: k.telepon,
        ketua: k.ketua,
        sertifikasi: ["SNI / PIRT", "Halal Kemenag", "Binaan Kemenkop"],
      };
    });
  }, [allKoperasi]);

  const filteredCommodities = useMemo(() => {
    return commodities.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          c.nama.toLowerCase().includes(q) ||
          c.koperasiNama.toLowerCase().includes(q) ||
          c.desa.toLowerCase().includes(q) ||
          c.kabupaten.toLowerCase().includes(q) ||
          c.provinsiNama.toLowerCase().includes(q) ||
          c.offtaker.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedKategori !== "ALL" && c.kategori !== selectedKategori) return false;
      if (selectedProvinsi !== "ALL" && c.provinsiId !== selectedProvinsi) return false;

      return true;
    });
  }, [commodities, search, selectedKategori, selectedProvinsi]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedKategori, selectedProvinsi]);

  const totalPages = Math.ceil(filteredCommodities.length / pageSize) || 1;
  const paginatedCommodities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCommodities.slice(start, start + pageSize);
  }, [filteredCommodities, currentPage, pageSize]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero Marketplace */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-red-900 via-red-800 to-red-950 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3 border border-white/20">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Etalase Rantai Pasok Pangan Nasional</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Marketplace Komoditas Koperasi Desa Merah Putih
            </h1>
            <p className="mt-3 text-sm text-red-100 leading-relaxed">
              Menghubungkan komoditas unggulan desa langsung dengan offtaker BUMN, agregator ekspor, dan industri manufaktur pangan nasional.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-6 absolute right-8 bottom-8 text-right">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-white">{commodities.length}</div>
              <div className="text-xs text-red-200">Komoditas Terdata</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-white">38</div>
              <div className="text-xs text-red-200">Provinsi Asal</div>
            </div>
          </div>
        </div>

        {/* Filter and Categories Bar */}
        <div className="space-y-4">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = selectedKategori === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedKategori(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-red-700 text-white shadow-xs"
                      : "bg-[#f8fafc] text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari komoditas (misal: Kopi Gayo, Beras Pandanwangi, Susu, Sawit)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-red-700 bg-white"
              />
            </div>

            <div className="text-xs text-slate-500 shrink-0 font-medium">
              Ditemukan: <strong className="text-slate-900">{filteredCommodities.length}</strong> produk
            </div>
          </div>
        </div>

        {/* Commodity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCommodities.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 hover:border-red-600 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag & Category */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200">
                    {item.kategori}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.noRegistrasi}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug">
                  {item.nama}
                </h3>

                {/* Asal Koperasi & Desa */}
                <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">{item.desa}</span>, {item.kabupaten} ({item.provinsiNama})
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.koperasiNama}</span>
                </div>

                {/* Offtaker Info Box */}
                <div className="mt-4 p-3 rounded-lg bg-[#f8fafc] border border-slate-200 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Mitra Penyerapan (Offtaker):</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{item.offtaker}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500">Estimasi Kapasitas:</span>
                    <span className="font-bold text-slate-900">{item.volume}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Estimasi Nilai Perputaran:</span>
                    <span className="font-bold text-emerald-700">{formatRupiah(item.nilai)}</span>
                  </div>
                </div>

                {/* Quality Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.sertifikasi.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  href={`/pers/dashboard/village/${item.id}?village_name=${encodeURIComponent(item.desa)}`}
                  className="text-xs font-bold text-slate-700 hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  <span>Profil Koperasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={`https://wa.me/62${item.telepon.replace(/\D/g, "")}?text=Halo%20Pengurus%20${encodeURIComponent(item.koperasiNama)},%20kami%20tertarik%20dengan%20komoditas%20${encodeURIComponent(item.nama)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Kemitraan</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 380, behavior: "smooth" });
            }}
            totalItems={filteredCommodities.length}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[9, 18, 36]}
            itemName="komoditas"
          />
        </div>
      </div>
    </div>
  );
}
