import React from "react";
import { getKoperasiList, getProvinsiList } from "@/lib/data";
import { SimkopdesMap } from "@/components/map/SimkopdesMap";
import { MapPin, Info } from "lucide-react";

export default function PetaPage() {
  const allKoperasi = getKoperasiList();
  const provinsiList = getProvinsiList();

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EB] gap-2">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-bold text-[#065366]">
              Persebaran Wilayah Nasional
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Visualisasi representatif persebaran Koperasi Desa Merah Putih di seluruh 38 provinsi di Indonesia
            </p>
          </div>

          <div className="text-xs text-gray-500 bg-[#F2F3F7] px-3 py-1.5 rounded-md border border-[#E6E8EB] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#065366]" />
            <span>Klik pada titik lingkaran provinsi untuk melihat rincian</span>
          </div>
        </div>

        {/* Keterangan Peta */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[10px] text-xs text-[#92400E] leading-relaxed">
          <p className="font-bold mb-1">Keterangan Peta:</p>
          <p>
            Angka menunjukkan jumlah koperasi yang telah terbentuk secara kelembagaan, bukan jumlah gedung atau gerai yang telah dibangun.
          </p>
          <p className="mt-1">
            Lingkaran (bubble) pada peta bukan merupakan titik koordinat atau lokasi geografis presisi KDKMP. Posisi bubble digunakan sebagai visualisasi representatif pada wilayah provinsi.
          </p>
        </div>

        <SimkopdesMap
          provinsiList={provinsiList}
          koperasiList={allKoperasi}
        />
      </div>
    </div>
  );
}
