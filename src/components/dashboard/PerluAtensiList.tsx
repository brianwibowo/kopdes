import React from "react";
import Link from "next/link";
import { KoperasiItem } from "@/lib/types";
import { AlertTriangle, ChevronRight, MapPin } from "lucide-react";

interface PerluAtensiListProps {
  koperasiList: KoperasiItem[];
}

export function PerluAtensiList({ koperasiList }: PerluAtensiListProps) {
  const atensiList = koperasiList.filter((k) => k.status === "PERLU_ATENSI");

  return (
    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Unit Memerlukan Pendampingan Khusus
            </h3>
            <p className="text-xs text-slate-400">Koperasi dengan kendala administratif atau permodalan</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/80 text-xs font-semibold">
          {atensiList.length} Unit
        </span>
      </div>

      <div className="mt-3 divide-y divide-slate-800/60">
        {atensiList.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            Seluruh koperasi saat ini berada dalam status aktif dan berkembang normal.
          </div>
        ) : (
          atensiList.map((k) => (
            <div key={k.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-red-400 font-semibold">{k.noRegistrasi}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {k.kabupaten}, {k.provinsiNama}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">{k.nama}</h4>
                {k.catatanMonitoring && (
                  <p className="text-xs text-amber-300/80 mt-1 bg-amber-950/30 p-2 rounded border border-amber-900/40">
                    {k.catatanMonitoring}
                  </p>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-500 block">Ketua</span>
                  <span className="text-xs text-slate-300 font-medium">{k.ketua}</span>
                </div>
                <Link
                  href={`/koperasi/${k.id}`}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1 border border-slate-700/60"
                >
                  <span>Tindak Lanjut</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
