import React from "react";
import { NationalStats } from "@/lib/types";
import { formatRupiah, formatAngka } from "@/lib/data";
import { Building2, Users, Coins, TrendingUp } from "lucide-react";

interface StatCardsProps {
  stats: NationalStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      label: "Total Koperasi Binaan",
      value: formatAngka(stats.totalKoperasi),
      subtext: "Tersebar di 38 Provinsi",
      icon: Building2,
      accent: "text-red-400",
      bgGlow: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      label: "Total Anggota Terdaftar",
      value: formatAngka(stats.totalAnggota),
      subtext: "Petani, Nelayan, & Pengrajin",
      icon: Users,
      accent: "text-blue-400",
      bgGlow: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Total Aset Nasional",
      value: formatRupiah(stats.totalAset),
      subtext: "Konsolidasi Per Des 2026",
      icon: Coins,
      accent: "text-emerald-400",
      bgGlow: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Volume Usaha Terakumulasi",
      value: formatRupiah(stats.totalVolumeUsaha),
      subtext: "Transaksi Komoditas Desa",
      icon: TrendingUp,
      accent: "text-amber-400",
      bgGlow: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-slate-900/70 border ${card.border} backdrop-blur-sm shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{card.label}</span>
              <div className={`p-2 rounded-lg ${card.bgGlow} ${card.accent}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white tracking-tight">{card.value}</div>
              <div className="text-[11px] text-slate-500 mt-1">{card.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
