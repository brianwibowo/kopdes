import { toCsv } from "../../lib/export";
import {
  type ModelResult,
  MODEL_VERSION,
  periodLabel,
  scopeLabel,
} from "./model";

export function modelCsv(result: ModelResult) {
  const coops = new Map(result.cooperatives.map((k) => [k.id, k]));
  return toCsv([
    [
      "dataset",
      "data_simulasi",
      "koperasi_id",
      "nama_koperasi",
      "provinsi",
      "bulan",
      "pendapatan_idr",
      "pembelian_idr",
      "distribusi_idr",
      "operasional_idr",
      "total_biaya_idr",
      "laba_idr",
      "kas_awal_idr",
      "kas_masuk_idr",
      "kas_keluar_idr",
      "kas_akhir_idr",
      "harga_persen",
      "biaya_persen",
      "jeda_penerimaan_bulan",
      "dari",
      "sampai",
    ],
    ...result.records.map((r) => [
      MODEL_VERSION,
      true,
      r.cooperativeId,
      coops.get(r.cooperativeId)?.nama,
      coops.get(r.cooperativeId)?.provinsiNama,
      r.month,
      r.revenue,
      r.goods,
      r.logistics,
      r.operating,
      r.expenses,
      r.profit,
      r.openingCash,
      r.cashIn,
      r.cashOut,
      r.closingCash,
      result.options.price,
      result.options.cost,
      result.options.lag,
      result.options.from,
      result.options.to,
    ]),
  ]);
}
const escapeXml = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
export function supplySvg(result: ModelResult) {
  const currency = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  const partnerCount = new Set(
    result.cooperatives.map((k) => k.mitraOfftaker).filter(Boolean),
  ).size;
  const t = result.totals;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 310" role="img" aria-label="Diagram supply chain agregat data simulasi">
  <rect width="1060" height="310" rx="16" fill="#f8fafc"/>
  <g font-family="Arial, sans-serif"><text x="30" y="32" font-size="16" font-weight="700" fill="#0f172a">${escapeXml(scopeLabel(result.options))}</text><text x="30" y="56" font-size="12" fill="#64748b">${escapeXml(periodLabel(result.options))} · DATA SIMULASI · ${MODEL_VERSION}</text>
  <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#991b1b"/></marker></defs>
  <path d="M275 158 H385" stroke="#991b1b" stroke-width="3" marker-end="url(#arrow)"/><path d="M675 158 H785" stroke="#991b1b" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="30" y="98" width="245" height="124" rx="12" fill="white" stroke="#cbd5e1"/><rect x="390" y="98" width="285" height="124" rx="12" fill="#991b1b"/><rect x="790" y="98" width="240" height="124" rx="12" fill="white" stroke="#cbd5e1"/>
  <text x="52" y="132" font-size="12" fill="#64748b">SUMBER KOMODITAS</text><text x="52" y="163" font-size="21" font-weight="700" fill="#0f172a">Produsen / anggota</text><text x="52" y="193" font-size="13" fill="#475569">${t.members.toLocaleString("id-ID")} anggota koperasi</text>
  <text x="412" y="132" font-size="12" fill="#fecaca">AGREGATOR DESA</text><text x="412" y="165" font-size="26" font-weight="700" fill="white">${t.cooperativeCount} koperasi</text><text x="412" y="195" font-size="13" fill="#fee2e2">Pengumpulan dan penyaluran komoditas</text>
  <text x="812" y="132" font-size="12" fill="#64748b">PENYERAPAN</text><text x="812" y="165" font-size="23" font-weight="700" fill="#0f172a">${partnerCount} mitra terdata</text><text x="812" y="195" font-size="13" fill="#475569">Lokasi mitra belum dimodelkan</text>
  <text x="330" y="138" text-anchor="middle" font-size="11" fill="#64748b">Pembelian</text><text x="330" y="184" text-anchor="middle" font-size="12" fill="#991b1b">${currency(t.goods)}</text><text x="730" y="138" text-anchor="middle" font-size="11" fill="#64748b">Penjualan</text><text x="730" y="184" text-anchor="middle" font-size="12" fill="#991b1b">${currency(t.revenue)}</text>
  <text x="30" y="264" font-size="12" fill="#64748b">Skema agregat ilustratif. Nilai panah dalam rupiah; bukan volume fisik atau transaksi pengiriman aktual.</text><text x="30" y="285" font-size="12" fill="#64748b">Skenario: harga ${result.options.price}%, biaya ${result.options.cost}%, jeda penerimaan ${result.options.lag} bulan.</text></g></svg>`;
}
