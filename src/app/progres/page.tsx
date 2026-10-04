"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getKoperasiList, getStats } from "@/lib/data";
import { TahapFunnel } from "@/components/dashboard/TahapFunnel";
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  MapPin, 
  Building2,
  Clock,
  ArrowRight
} from "lucide-react";
import { TahapKoperasi } from "@/lib/types";

export default function ProgresPage() {
  const stats = useMemo(() => getStats(), []);
  const allKoperasi = useMemo(() => getKoperasiList(), []);

  const [activeTab, setActiveTab] = useState<string>("ALL");

  const filtered = useMemo(() => {
    if (activeTab === "ALL") return allKoperasi;
    return allKoperasi.filter((k) => k.tahap === activeTab);
  }, [allKoperasi, activeTab]);

  const stages: { id: TahapKoperasi | "ALL"; label: string; count: number }[] = [
    { id: "ALL", label: "Semua Tahap", count: allKoperasi.length },
    { id: "TAHAP_1_PERSIAPAN", label: "Tahap I: Persiapan", count: stats.tahapCounts.tahap1 },
    { id: "TAHAP_2_KELEMBAGAAN", label: "Tahap II: Kelembagaan", count: stats.tahapCounts.tahap2 },
    { id: "TAHAP_3_PERMODALAN", label: "Tahap III: Permodalan", count: stats.tahapCounts.tahap3 },
    { id: "TAHAP_4_OPERASIONAL", label: "Tahap IV: Operasional", count: stats.tahapCounts.tahap4 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-500" />
          <span>Monitoring Tahapan & Progres Pembinaan KDMP</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Pelacakan siklus pembinaan koperasi dari inisiasi desa, legalitas badan hukum, permodalan, hingga kemandirian usaha
        </p>
      </div>

      {/* Visual Tahap Funnel */}
      <TahapFunnel stats={stats} />

      {/* Tahapan Tabs & Filter */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {stages.map((stage) => {
            const isActive = activeTab === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveTab(stage.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <span>{stage.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isActive ? "bg-red-800 text-white" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {stage.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* List of Koperasi in this Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((k) => (
            <div
              key={k.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono text-slate-500">{k.noRegistrasi}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold ${
                    k.status === "AKTIF"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                      : k.status === "PERLU_ATENSI"
                      ? "bg-amber-950 text-amber-300 border border-amber-800/60"
                      : "bg-blue-950 text-blue-300 border border-blue-800/60"
                  }`}>
                    {k.status}
                  </span>
                </div>

                <Link
                  href={`/koperasi/${k.id}`}
                  className="font-bold text-white text-sm hover:text-red-400 transition-colors block"
                >
                  {k.nama}
                </Link>

                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span>{k.kabupaten}, {k.provinsiNama}</span>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Komoditas Utama:</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{k.komoditasUtama}</span>
                </div>

                {k.catatanMonitoring && (
                  <div className="mt-2.5 p-2 rounded bg-amber-950/40 border border-amber-900/50 text-[11px] text-amber-300/90">
                    <span className="font-semibold block">Catatan Atensi:</span>
                    <span>{k.catatanMonitoring}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Anggota: <strong className="text-slate-200">{k.jumlahAnggota}</strong>
                </span>

                <Link
                  href={`/koperasi/${k.id}`}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                >
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
