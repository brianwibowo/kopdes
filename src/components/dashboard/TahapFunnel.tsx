import React from "react";
import { NationalStats } from "@/lib/types";

interface TahapFunnelProps {
  stats: NationalStats;
}

export function TahapFunnel({ stats }: TahapFunnelProps) {
  const total = stats.totalKoperasi || 1;

  const stages = [
    {
      id: "tahap1",
      number: "I",
      title: "Sosialisasi & Rembug Desa",
      desc: "Inisiasi musyawarah desa, inventarisasi potensi komoditas, & pembentukan kelompok pengusul.",
      count: stats.tahapCounts.tahap1,
      pct: Math.round((stats.tahapCounts.tahap1 / total) * 100),
      intensity: "bg-slate-800 text-slate-300 border-slate-700",
      barColor: "bg-slate-600",
    },
    {
      id: "tahap2",
      number: "II",
      title: "Kelembagaan & Badan Hukum",
      desc: "Penerbitan akta notaris, SK Kemenkumham (AHU), Nomor Induk Berusaha (NIB), & NPWP.",
      count: stats.tahapCounts.tahap2,
      pct: Math.round((stats.tahapCounts.tahap2 / total) * 100),
      intensity: "bg-slate-800/90 text-slate-200 border-slate-600",
      barColor: "bg-red-800",
    },
    {
      id: "tahap3",
      number: "III",
      title: "Permodalan & Sarana Prasarana",
      desc: "Penyertaan modal awal, fasilitasi KUR/LPDB, pembangunan gudang/mesin olahan pascapanen.",
      count: stats.tahapCounts.tahap3,
      pct: Math.round((stats.tahapCounts.tahap3 / total) * 100),
      intensity: "bg-red-950/40 text-red-200 border-red-800/60",
      barColor: "bg-red-600",
    },
    {
      id: "tahap4",
      number: "IV",
      title: "Operasional & Kemitraan Mandiri",
      desc: "Transaksi komoditas rutin, kontrak offtaker BUMN/swasta, RAT berkala, & ekspor produk desa.",
      count: stats.tahapCounts.tahap4,
      pct: Math.round((stats.tahapCounts.tahap4 / total) * 100),
      intensity: "bg-red-950 text-white border-red-600",
      barColor: "bg-red-500",
    },
  ];

  return (
    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Distribusi Tahapan Progres Pembinaan KDMP
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Siklus transformasi dari inisiasi desa hingga kemandirian operasional
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Total: <strong className="text-white">{stats.totalKoperasi} Koperasi</strong>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`p-3.5 rounded-lg border ${stage.intensity} flex flex-col justify-between transition-transform hover:-translate-y-0.5`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/50">
                  Tahap {stage.number}
                </span>
                <span className="text-lg font-black">{stage.count} <span className="text-xs font-normal text-slate-400">unit</span></span>
              </div>
              <h4 className="text-xs font-bold mt-2.5 leading-snug">{stage.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{stage.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/40">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400">Porsi Nasional</span>
                <span className="font-semibold">{stage.pct}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${stage.barColor} rounded-full`}
                  style={{ width: `${Math.max(stage.pct, 4)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
