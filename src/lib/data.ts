import { MOCK_KOPERASI, PROVINSI_LIST, getNationalStats } from "./mockData";
import { KoperasiItem, ProvinsiData, NationalStats } from "./types";

export interface FilterParams {
  search?: string;
  provinsiId?: string;
  status?: string;
  tahap?: string;
  komoditas?: string;
}

export function getKoperasiList(filters: FilterParams = {}): KoperasiItem[] {
  let result = [...MOCK_KOPERASI];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (k) =>
        k.nama.toLowerCase().includes(q) ||
        k.desa.toLowerCase().includes(q) ||
        k.kecamatan.toLowerCase().includes(q) ||
        k.kabupaten.toLowerCase().includes(q) ||
        k.provinsiNama.toLowerCase().includes(q) ||
        k.komoditasUtama.toLowerCase().includes(q) ||
        k.ketua.toLowerCase().includes(q) ||
        k.noRegistrasi.toLowerCase().includes(q),
    );
  }

  if (filters.provinsiId && filters.provinsiId !== "ALL") {
    result = result.filter((k) => k.provinsiId === filters.provinsiId);
  }

  if (filters.status && filters.status !== "ALL") {
    result = result.filter((k) => k.status === filters.status);
  }

  if (filters.tahap && filters.tahap !== "ALL") {
    result = result.filter((k) => k.tahap === filters.tahap);
  }

  if (filters.komoditas && filters.komoditas !== "ALL") {
    result = result.filter((k) =>
      k.komoditasUtama.toLowerCase().includes(filters.komoditas!.toLowerCase()),
    );
  }

  return result;
}

export function getKoperasiById(id: string): KoperasiItem | undefined {
  return MOCK_KOPERASI.find((k) => k.id === id);
}

export function getProvinsiList(): ProvinsiData[] {
  return PROVINSI_LIST;
}

export function getStats(): NationalStats {
  return getNationalStats();
}

export function formatRupiah(num: number): string {
  if (Math.abs(num) >= 1_000_000_000) {
    return `Rp ${(num / 1_000_000_000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;
  }
  if (Math.abs(num) >= 1_000_000) {
    return `Rp ${(num / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Jt`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatAngka(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}
