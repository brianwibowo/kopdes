import React from "react";
import { getKoperasiList, getProvinsiList } from "@/lib/data";
import { IndonesiaMap } from "@/components/map/IndonesiaMap";
import { MapPin, Info, Layers } from "lucide-react";

export default function PetaPage() {
  const allKoperasi = getKoperasiList();
  const provinsiList = getProvinsiList();

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <span>Peta Spasial Sebaran Koperasi Nasional</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Eksplorasi titik sebaran KDMP di seluruh 38 provinsi di Indonesia dengan koordinat tervalidasi daratan
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Klik penanda titik untuk membuka panel rincian koperasi</span>
        </div>
      </div>

      {/* Full Map Canvas */}
      <IndonesiaMap
        koperasiList={allKoperasi}
        provinsiList={provinsiList}
        height="h-[calc(100vh-210px)] min-h-[580px]"
      />
    </div>
  );
}
