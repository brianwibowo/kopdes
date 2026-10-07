import { MOCK_KOPERASI, PROVINSI_LIST } from "../../lib/mockData";
import type { KoperasiItem } from "../../lib/types";

export const MODEL_VERSION = "demo-2026-v1";
export const DEMO_YEAR = 2026;
export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
export const MODEL_TABS = [
  {
    id: "supply-chain",
    title: "Supply chain",
    description: "Telusuri hubungan produsen, koperasi, dan mitra penyerapan.",
  },
  {
    id: "peta",
    title: "Peta Kopdes",
    description: "Lihat sebaran koperasi sesuai wilayah dan dataset terpilih.",
  },
  {
    id: "keuntungan",
    title: "Keuntungan",
    description: "Bandingkan pendapatan dan biaya dalam skenario usaha.",
  },
  {
    id: "arus-kas",
    title: "Arus kas",
    description: "Amati penerimaan, pembayaran, dan perubahan saldo kas.",
  },
] as const;
export type ModelView = (typeof MODEL_TABS)[number]["id"] | "overview";
export interface ModelOptions {
  province: string;
  cooperative: string;
  from: string;
  to: string;
  price: number;
  cost: number;
  lag: number;
}
export const DEFAULT_OPTIONS: ModelOptions = {
  province: "ALL",
  cooperative: "ALL",
  from: "2026-01",
  to: "2026-12",
  price: 0,
  cost: 0,
  lag: 0,
};
export const MODEL_ASSUMPTIONS = [
  "Seluruh data adalah simulasi untuk presentasi, termasuk bulan yang belum berlangsung; bukan realisasi atau hasil penelitian.",
  "Pendapatan dan laba tahunan contoh mengikuti volumeUsaha dan totalShu pada dataset koperasi. Keduanya dialokasikan ke 12 bulan menggunakan bobot musiman tetap.",
  "Biaya contoh = pendapatan dikurangi laba; dibagi menjadi 80% pembelian barang, 7% distribusi, dan sisanya operasional. Tidak ada pajak, investasi, atau pembiayaan tambahan dalam model sederhana ini.",
  "Saldo awal Januari diasumsikan 10% aset. Biaya dibayar pada bulan yang sama. Jeda penerimaan 0–2 bulan berlaku sejak Januari, tanpa piutang awal; penerimaan yang melewati Desember belum masuk kas tahun ini.",
  "Perubahan harga hanya mengubah pendapatan, dengan volume tetap. Perubahan biaya berlaku ke semua komponen biaya. Skenario berlaku sejak Januari; saldo awal periode terpilih membawa saldo bulan sebelumnya.",
  "Supply chain adalah skema hubungan ilustratif dari identitas koperasi dan mitra di dataset. Nilai panah dalam rupiah, bukan tonase atau catatan pengiriman aktual. Lokasi mitra belum diketahui.",
];

export function parseOptions(
  params: Record<string, string | string[] | undefined>,
): ModelOptions {
  const str = (key: string, fallback: string) => {
    const val = params[key];
    return (Array.isArray(val) ? val[0] : val) || fallback;
  };
  const numeric = (key: string, min: number, max: number) => {
    const value = Number(str(key, "0"));
    return Number.isFinite(value)
      ? Math.max(min, Math.min(max, Math.round(value)))
      : 0;
  };
  const month = (key: "from" | "to") => {
    const value = str(key, DEFAULT_OPTIONS[key]);
    return /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : DEFAULT_OPTIONS[key];
  };
  return {
    province: str("province", "ALL"),
    cooperative: str("cooperative", "ALL"),
    from: month("from"),
    to: month("to"),
    price: numeric("price", -50, 50),
    cost: numeric("cost", -30, 50),
    lag: numeric("lag", 0, 2),
  };
}
export function optionsQuery(options: ModelOptions) {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(options).map(([key, value]) => [key, String(value)]),
    ),
  ).toString();
}
export function scopeLabel(options: ModelOptions) {
  const cooperative = MOCK_KOPERASI.find((k) => k.id === options.cooperative);
  return (
    cooperative?.nama ||
    (options.province === "ALL"
      ? "Seluruh Indonesia"
      : PROVINSI_LIST.find((p) => p.id === options.province)?.nama ||
        "Wilayah tidak ditemukan")
  );
}
export function periodLabel(options: ModelOptions) {
  const label = (value: string) =>
    `${MONTH_NAMES[Number(value.slice(5)) - 1]} ${value.slice(0, 4)}`;
  return `${label(options.from)} – ${label(options.to)}`;
}
export function categoryFor(k: KoperasiItem) {
  const name = `${k.komoditasUtama} ${k.jenisUsaha.join(" ")}`.toLowerCase();
  if (/beras|padi/.test(name)) return "Beras";
  if (/kopi|kakao|cokelat/.test(name)) return "Kopi";
  if (/susu|daging|sapi|bebek|telur/.test(name)) return "Susu";
  if (/sawit|tbs|karet|tebu/.test(name)) return "Sawit";
  if (/ikan|udang|kerapu|cumi/.test(name)) return "Ikan";
  if (/lada|pala|cengkih|sayur|bawang|n[ae]nas|rempah/.test(name))
    return "Rempah";
  return "Lainnya";
}

export interface MonthlyRecord {
  cooperativeId: string;
  month: string;
  revenue: number;
  goods: number;
  logistics: number;
  operating: number;
  expenses: number;
  profit: number;
  openingCash: number;
  cashIn: number;
  cashOut: number;
  closingCash: number;
}
const weights = [70, 72, 78, 80, 82, 84, 86, 88, 90, 94, 88, 88];
// Cumulative rounding preserves the exact annual total in integer rupiah.
function distribute(total: number) {
  const weightTotal = weights.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  let assigned = 0;
  return weights.map((weight) => {
    cumulative += weight;
    const target = Math.round((total * cumulative) / weightTotal);
    const result = target - assigned;
    assigned = target;
    return result;
  });
}
export function monthlyRecords(
  k: KoperasiItem,
  options: ModelOptions,
): MonthlyRecord[] {
  const revenues = distribute(k.volumeUsaha);
  const profits = distribute(k.totalShu);
  const scenarioRevenues = revenues.map((n) =>
    Math.round(n * (1 + options.price / 100)),
  );
  let cash = Math.round(k.totalAset * 0.1);
  return revenues.map((revenue, index) => {
    const baseExpenses = revenue - profits[index];
    const baseGoods = Math.round(baseExpenses * 0.8);
    const baseLogistics = Math.round(baseExpenses * 0.07);
    const goods = Math.round(baseGoods * (1 + options.cost / 100));
    const logistics = Math.round(baseLogistics * (1 + options.cost / 100));
    const operating = Math.round(
      (baseExpenses - baseGoods - baseLogistics) * (1 + options.cost / 100),
    );
    const expenses = goods + logistics + operating;
    const cashIn = scenarioRevenues[index - options.lag] || 0;
    const openingCash = cash;
    cash += cashIn - expenses;
    return {
      cooperativeId: k.id,
      month: `${DEMO_YEAR}-${String(index + 1).padStart(2, "0")}`,
      revenue: scenarioRevenues[index],
      goods,
      logistics,
      operating,
      expenses,
      profit: scenarioRevenues[index] - expenses,
      openingCash,
      cashIn,
      cashOut: expenses,
      closingCash: cash,
    };
  });
}
const sum = <T>(rows: T[], get: (row: T) => number) =>
  rows.reduce((total, row) => total + get(row), 0);
export function summarize(rows: MonthlyRecord[]) {
  return {
    revenue: sum(rows, (r) => r.revenue),
    expenses: sum(rows, (r) => r.expenses),
    goods: sum(rows, (r) => r.goods),
    logistics: sum(rows, (r) => r.logistics),
    operating: sum(rows, (r) => r.operating),
    profit: sum(rows, (r) => r.profit),
    cashIn: sum(rows, (r) => r.cashIn),
    cashOut: sum(rows, (r) => r.cashOut),
  };
}
export function buildModel(options: ModelOptions) {
  const validRange = options.from <= options.to;
  const matching = MOCK_KOPERASI.filter(
    (k) =>
      (options.province === "ALL" || k.provinsiId === options.province) &&
      (options.cooperative === "ALL" || k.id === options.cooperative),
  );
  const records = validRange
    ? matching.flatMap((k) =>
        monthlyRecords(k, options).filter(
          (r) => r.month >= options.from && r.month <= options.to,
        ),
      )
    : [];
  const ids = new Set(records.map((r) => r.cooperativeId));
  const cooperatives = matching.filter((k) => ids.has(k.id));
  const months = [...new Set(records.map((r) => r.month))].sort();
  const trend = months.map((month) => {
    const selected = records.filter((r) => r.month === month);
    return {
      month,
      label: MONTH_NAMES[Number(month.slice(5)) - 1],
      ...summarize(selected),
      openingCash: sum(selected, (r) => r.openingCash),
      closingCash: sum(selected, (r) => r.closingCash),
    };
  });
  const cooperativeRows = cooperatives.map((k) => {
    const rows = records.filter((r) => r.cooperativeId === k.id);
    return {
      cooperative: k,
      ...summarize(rows),
      openingCash: rows[0]?.openingCash || 0,
      closingCash: rows.at(-1)?.closingCash || 0,
    };
  });
  const provinces = PROVINSI_LIST.map((p) => {
    const rows = cooperativeRows.filter(
      (r) => r.cooperative.provinsiId === p.id,
    );
    return {
      id: p.id,
      name: p.nama,
      count: rows.length,
      revenue: sum(rows, (r) => r.revenue),
      profit: sum(rows, (r) => r.profit),
      assets: sum(rows, (r) => r.cooperative.totalAset),
      members: sum(rows, (r) => r.cooperative.jumlahAnggota),
    };
  }).filter((p) => p.count > 0);
  return {
    options,
    validRange,
    records,
    cooperatives,
    cooperativeRows,
    trend,
    provinces,
    totals: {
      ...summarize(records),
      openingCash: trend[0]?.openingCash || 0,
      closingCash: trend.at(-1)?.closingCash || 0,
      cooperativeCount: cooperatives.length,
      members: sum(cooperatives, (k) => k.jumlahAnggota),
      assets: sum(cooperatives, (k) => k.totalAset),
      nibCount: cooperatives.filter((k) => Boolean(k.nib)).length,
      activeCount: cooperatives.filter((k) => k.status === "AKTIF").length,
      attentionCount: cooperatives.filter((k) => k.status === "PERLU_ATENSI")
        .length,
    },
  };
}
export type ModelResult = ReturnType<typeof buildModel>;
export function modelDataset(result: ModelResult) {
  return {
    metadata: {
      dataset: MODEL_VERSION,
      isDemo: true,
      currency: "IDR",
      scope: scopeLabel(result.options),
      period: periodLabel(result.options),
      assumptions: MODEL_ASSUMPTIONS,
      options: result.options,
    },
    totals: result.totals,
    cooperatives: result.cooperatives,
    monthlyRecords: result.records,
    supplyChain: result.cooperativeRows.map((row) => ({
      source: `Produsen / anggota ${row.cooperative.desa}`,
      cooperativeId: row.cooperative.id,
      cooperativeName: row.cooperative.nama,
      province: row.cooperative.provinsiNama,
      partner: row.cooperative.mitraOfftaker || "Mitra belum terdata",
      partnerLocation: null,
      commodity: row.cooperative.komoditasUtama,
      purchaseValue: row.goods,
      salesValue: row.revenue,
      illustrative: true,
    })),
  };
}
