# 01 — Overview & Scope
**Proyek:** Platform Penguatan Bisnis Koperasi Desa/Kelurahan Merah Putih (KDMP/KKMP)
**Versi dokumen:** 0.2 (draft untuk konfirmasi) — *Fase 1: pengguna Viewer (read-only)*
**Status:** Draft — butuh validasi dari pemberi tugas (lihat `06-pertanyaan-konfirmasi.md`)

---

## 1. Latar Belakang
Pemerintah meluncurkan puluhan ribu Koperasi Desa/Kelurahan Merah Putih sebagai wadah ekonomi desa (sembako, simpan pinjam, layanan obat/klinik, logistik, pupuk, LPG, dll). Dengan jumlah koperasi sebesar itu, pihak pengelola program membutuhkan satu tempat untuk **melihat kondisi seluruh koperasi sekaligus**: di mana lokasinya, sudah sampai tahap apa, bisnis apa yang berjalan, dan bagaimana alur produk bergerak.

## 2. Visi Produk
Satu platform web terpusat yang memberi **visibilitas menyeluruh** atas jaringan Kopdes Merah Putih: lokasi, progres, kinerja bisnis, dan alur produk, dalam bentuk peta dan dashboard yang mudah dipahami.

## 3. Tujuan
| # | Tujuan | Indikator keberhasilan |
|---|---|---|
| G1 | Memetakan seluruh kopdes secara geografis peta indonesia LENGKAP | Seluruh kopdes tampil sebagai pin di peta, dapat difilter dan diklik untuk detail |
| G2 | Memantau progres pembentukan & operasionalisasi | Tiap kopdes punya status tahap yang jelas; agregat per wilayah terlihat |
| G3 | Memantau kinerja bisnis per unit usaha | Omzet/transaksi per unit dan per koperasi dapat dilihat |
| G4 | Memvisualisasikan alur produk | Alur pemasok → gudang → gerai → anggota dapat ditelusuri per produk/koperasi |
| G5 | Mendukung pengambilan keputusan | Dashboard ringkasan, indikator koperasi bermasalah, ekspor laporan |

## 4. Pengguna
### Fase 1: satu peran saja
| Peran | Kebutuhan | Hak akses |
|---|---|---|
| **Viewer** | Melihat peta, dashboard, profil koperasi, progres, kinerja, alur produk; mengekspor data yang terlihat | **Hanya baca** (read-only) pada seluruh data |

Tidak ada pengguna yang menambah/mengubah data lewat antarmuka pada Fase 1.

### Disiapkan untuk fase lanjut (tidak dibangun sekarang)
Admin Pusat, Admin Wilayah, Pengurus Kopdes, Mitra/BUMN. Model data dan lapisan otorisasi dirancang sehingga peran baru dapat ditambahkan tanpa membongkar struktur (lihat `03` bagian "Kesiapan Ekspansi").

## 5. Ruang Lingkup

### 5.1 Fase 1 — MVP (masuk RAB)
1. Login sederhana untuk akun Viewer (akun dibuat oleh developer/seed)
2. Dashboard Overview (kartu ringkasan, grafik)
3. Peta sebaran kopdes (pin, clustering, filter, panel detail)
4. Daftar & profil kopdes (tabel, pencarian, halaman detail) — hanya baca
5. Monitoring progres tahapan kopdes
6. Monitoring unit usaha & kinerja bisnis
7. Visualisasi alur produk (rantai pasok)
8. Ekspor data (CSV/Excel) mengikuti filter
9. Halaman "Tentang Data" (sumber, tanggal pembaruan, definisi indikator)
10. Pemuatan data awal lewat **seed + skrip import (CLI)** yang dijalankan developer
11. Dokumentasi teknis & serah terima

### 5.2 Fase Lanjutan (di luar RAB Fase 1)
- Peran tambahan (Admin Pusat/Wilayah, Pengurus, Mitra) dan manajemen user lewat UI
- Input/ubah data lewat UI (CRUD koperasi, tahap, unit usaha, omzet, pergerakan produk)
- Import data lewat UI (wizard + validasi)
- Audit log
- Integrasi API dengan sistem resmi/pihak ketiga
- Aplikasi mobile / PWA
- Modul operasional (POS, stok real-time, simpan pinjam, akuntansi)
- Notifikasi (email/WhatsApp)
- Hosting on-premise / data center lokal

### 5.3 Di luar lingkup (eksplisit)
- Payment gateway, pengadaan perangkat keras
- Migrasi data skala nasional dari sistem lama
- Pembaruan data rutin oleh developer setelah serah terima (kecuali disepakati dalam paket pemeliharaan)
- Revisi tanpa batas (jumlah putaran revisi disepakati di RAB)

## 6. Asumsi
- A1: Pengguna Fase 1 hanya **Viewer**; tidak ada fitur tulis di UI.
- A2: Data awal berupa **data dummy** atau file Excel/CSV dari pemberi tugas, dimuat developer lewat skrip.
- A3: Platform berupa **web responsif**; tidak ada aplikasi native.
- A4: Hosting awal di **Vercel** + database Postgres terkelola (mis. Neon/Supabase).
- A5: Jumlah koperasi pada demo: ratusan–ribuan titik; arsitektur dirancang agar bisa membesar ke puluhan ribu.
- A6: Bahasa antarmuka: Indonesia.
- A7: Referensi wilayah administratif (provinsi–desa) tersedia atau di-seed sebagian.
- A8: Tidak ada data pribadi sensitif anggota pada Fase 1 (hanya agregat/jumlah).
- A9: Pembaruan data setelah demo dilakukan dengan menjalankan ulang skrip import (frekuensi disepakati kemudian).

## 7. Batasan & Risiko
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Sumber & mekanisme pembaruan data belum jelas | Dashboard cepat usang/kosong | Tentukan sumber data & frekuensi pembaruan sejak awal; sediakan template CSV |
| Ekspektasi "bisa input data" muncul belakangan | Scope melebar | Tegaskan Fase 1 read-only; fitur tulis jadi change request/fase 2 |
| Performa peta untuk puluhan ribu titik | Lambat | Clustering, muat berdasarkan viewport |
| Keamanan & privasi data pemerintah | Kebocoran/penolakan | Autentikasi, HTTPS, akses baca saja, tinjau kebutuhan hosting lokal |
| Ketergantungan satu vendor hosting | Sulit pindah | Postgres standar, tanpa fitur eksklusif vendor |

## 8. Prinsip Desain Produk
- **Peta dan angka lebih dulu:** informasi kunci terlihat tanpa banyak klik.
- **Sederhana tapi meyakinkan:** tampilan bersih, konsisten, siap dipresentasikan.
- **Drill-down:** nasional → provinsi → kab/kota → kecamatan → desa → detail koperasi.
- **Data jujur:** setiap angka punya sumber dan waktu pembaruan.
- **Siap tumbuh:** fitur tulis dan peran baru bisa ditambah tanpa menulis ulang.
