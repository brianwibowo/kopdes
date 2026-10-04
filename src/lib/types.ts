export type TahapKoperasi =
  | "TAHAP_1_PERSIAPAN"
  | "TAHAP_2_KELEMBAGAAN"
  | "TAHAP_3_PERMODALAN"
  | "TAHAP_4_OPERASIONAL";

export type StatusKeaktifan = "AKTIF" | "BERKEMBANG" | "PERLU_ATENSI" | "TIDAK_AKTIF";

export interface ProvinsiData {
  id: string;
  nama: string;
  latitude: number;
  longitude: number;
  jumlahKoperasi: number;
}

export interface KoperasiItem {
  id: string;
  nama: string;
  noRegistrasi: string;
  provinsiId: string;
  provinsiNama: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  alamat: string;
  latitude: number;
  longitude: number;
  status: StatusKeaktifan;
  tahap: TahapKoperasi;
  jenisUsaha: string[];
  komoditasUtama: string;
  mitraOfftaker?: string;
  jumlahAnggota: number;
  totalAset: number; // in Rupiah
  totalShu: number; // in Rupiah
  volumeUsaha: number; // in Rupiah
  tahunBerdiri: number;
  ketua: string;
  telepon: string;
  email: string;
  skBadanHukum: string;
  nib: string;
  catatanMonitoring?: string;
  lastUpdated: string;
}

export interface NationalStats {
  totalKoperasi: number;
  totalAnggota: number;
  totalAset: number;
  totalVolumeUsaha: number;
  koperasiAktif: number;
  koperasiPerluAtensi: number;
  tahapCounts: {
    tahap1: number;
    tahap2: number;
    tahap3: number;
    tahap4: number;
  };
  provinsiTerbanyak: { nama: string; jumlah: number }[];
}
