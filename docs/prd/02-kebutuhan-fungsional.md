# 02 — Kebutuhan Fungsional (Fase 1: Viewer / Read-only)

Format: **ID — User story — Kriteria penerimaan (AC)**. Prioritas: **P0** wajib MVP, **P1** sebaiknya ada, **P2** bila waktu cukup.
Semua pengguna adalah **Viewer**. Tidak ada form tambah/ubah/hapus data di antarmuka.

---

## M1. Autentikasi (Viewer)
| ID | User story | AC | Prio |
|---|---|---|---|
| M1-1 | Sebagai viewer, saya login dengan email & password | Login sukses ke Overview; gagal menampilkan pesan jelas; sesi berakhir wajar; logout tersedia | P0 |
| M1-2 | Sebagai sistem, saya menolak akses tanpa login | Semua halaman & API (selain login) butuh sesi valid | P0 |
| M1-3 | Sebagai sistem, saya menjamin akses hanya-baca | Tidak ada endpoint tulis untuk data bisnis; percobaan POST/PATCH/DELETE ditolak | P0 |
| M1-4 | Akun viewer dibuat developer | Dibuat lewat seed/skrip (tidak ada registrasi publik) | P0 |

## M2. Dashboard Overview
| ID | User story | AC | Prio |
|---|---|---|---|
| M2-1 | Saya melihat kartu ringkasan nasional | Kartu: total kopdes, % berbadan hukum, % bangunan selesai, % beroperasi, total omzet periode | P0 |
| M2-2 | Saya melihat sebaran status koperasi | Grafik donut/bar status tahap; klik untuk memfilter daftar | P0 |
| M2-3 | Saya melihat tren omzet/aktivitas | Grafik garis bulanan, filter periode | P0 |
| M2-4 | Saya melihat ranking wilayah | Tabel top/bottom provinsi/kabupaten berdasarkan progres atau omzet | P1 |
| M2-5 | Saya melihat daftar perhatian | Koperasi tertahan di satu tahap > N hari, atau omzet turun drastis | P1 |
| M2-6 | Filter global wilayah & periode | Filter memengaruhi seluruh widget; tersimpan di URL | P0 |

## M3. Peta Sebaran
| ID | User story | AC | Prio |
|---|---|---|---|
| M3-1 | Saya melihat pin seluruh kopdes | Pin ter-cluster saat zoom jauh; terurai saat zoom dekat | P0 |
| M3-2 | Saya mengklik pin untuk info | Panel detail: nama, alamat, status, anggota, unit usaha, tombol "Lihat profil" | P0 |
| M3-3 | Saya memfilter pin | Filter wilayah, tahap, jenis unit usaha; hasil langsung | P0 |
| M3-4 | Warna pin = status | Legenda tampil; konsisten dengan dashboard | P0 |
| M3-5 | Saya mencari koperasi dari peta | Search autocomplete; peta menuju lokasi | P1 |
| M3-6 | Mode choropleth/heatmap per wilayah | Toggle intensitas per kab/kota | P2 |
| M3-7 | Peta nyaman di mobile | Layout responsif, panel detail menjadi bottom sheet | P0 |

## M4. Daftar & Profil Kopdes (hanya baca)
| ID | User story | AC | Prio |
|---|---|---|---|
| M4-1 | Saya melihat tabel semua kopdes | Kolom: nama, wilayah, tahap, anggota, unit aktif, omzet; sortir, paginasi server-side, pencarian | P0 |
| M4-2 | Saya memfilter tabel | Wilayah bertingkat, tahap, unit usaha, rentang tanggal | P0 |
| M4-3 | Saya membuka profil lengkap | Tab: Ringkasan, Legalitas & Pengurus, Fisik & Aset, Unit Usaha, Alur Produk, Riwayat Tahap | P0 |
| M4-4 | Mini-peta lokasi di profil | Pin koperasi tersebut | P0 |
| M4-5 | Ekspor tabel | CSV/Excel mengikuti filter aktif | P0 |
| M4-6 | Lampiran foto progres/dokumen (tampil saja) | Galeri dari URL/aset yang sudah dimuat developer | P2 |

## M5. Monitoring Progres Tahapan
Tahapan standar (usulan, perlu konfirmasi): Musyawarah desa → Badan hukum → Pengurus & manajer → Pembangunan fisik → Perlengkapan → Operasional dimulai → Beroperasi stabil.

| ID | User story | AC | Prio |
|---|---|---|---|
| M5-1 | Saya melihat tahap tiap koperasi | Stepper/timeline di profil dengan tanggal tiap tahap | P0 |
| M5-2 | Saya melihat funnel agregat | Jumlah koperasi per tahap, mengikuti filter wilayah | P0 |
| M5-3 | Saya melihat koperasi yang macet | Daftar tertahan > ambang hari (ambang default di konfigurasi kode) | P1 |
| M5-4 | Progres fisik (%) | Bar persentase pembangunan di profil | P1 |

## M6. Unit Usaha & Kinerja Bisnis
Jenis unit (contoh): sembako, simpan pinjam, apotek/layanan obat murah, klinik desa, LPG, pupuk/saprodi, hasil tani/UMKM, logistik.

| ID | User story | AC | Prio |
|---|---|---|---|
| M6-1 | Saya melihat unit usaha tiap koperasi | Daftar unit + status (aktif/rencana/nonaktif) | P0 |
| M6-2 | Saya melihat omzet & transaksi per unit | Grafik bulanan, total, pertumbuhan | P0 |
| M6-3 | Saya membandingkan antar koperasi/wilayah/jenis unit | Tabel & bar perbandingan dengan filter | P1 |
| M6-4 | Indikator kesehatan usaha | Label baik/perhatian/kritis berbasis aturan transparan; alasan ditampilkan | P1 |

## M7. Alur Produk (Supply Chain)
Model: **Pemasok/BUMN → Gudang (koperasi) → Gerai → Anggota**, serta **Produk lokal desa → Koperasi → Offtaker**.

| ID | User story | AC | Prio |
|---|---|---|---|
| M7-1 | Saya melihat katalog produk | Daftar produk, kategori, satuan, harga acuan | P0 |
| M7-2 | Saya melihat alur satu produk | Diagram node-edge; ketebalan garis = volume; filter periode & wilayah | P0 |
| M7-3 | Saya melihat alur dari sisi koperasi | Di profil: produk masuk, stok ringkas, produk keluar | P0 |
| M7-4 | Saya melihat tabel pergerakan | Filter produk/tanggal/status; sortir; paginasi | P0 |
| M7-5 | Garis distribusi di peta | Garis dari pemasok ke koperasi | P2 |
| M7-6 | Peringatan stok rendah (tampil saja) | Penanda bila stok di bawah ambang | P2 |

## M8. Ekspor
| ID | User story | AC | Prio |
|---|---|---|---|
| M8-1 | Saya mengekspor data ke CSV/Excel | Daftar koperasi, metrik unit, pergerakan; mengikuti filter | P0 |
| M8-2 | Ringkasan cetak/PDF per wilayah | Halaman cetak KPI & grafik | P2 |

## M9. Tentang Data
| ID | User story | AC | Prio |
|---|---|---|---|
| M9-1 | Saya tahu data berasal dari mana & kapan diperbarui | Halaman menampilkan sumber, tanggal pembaruan terakhir, penanda "data contoh" bila dummy | P0 |
| M9-2 | Saya memahami definisi indikator | Glosarium: status tahap, "macet", skor kesehatan, dll | P1 |

## M10. Pemuatan Data (sisi developer, bukan UI)
| ID | Kebutuhan | AC | Prio |
|---|---|---|---|
| M10-1 | Seed wilayah & data dummy | Satu perintah mengisi database dari nol | P0 |
| M10-2 | Skrip import CSV/Excel | Perintah CLI untuk koperasi, tahap, unit, metrik, produk, pergerakan; validasi Zod; laporan error per baris; idempoten (upsert) | P0 |
| M10-3 | Template CSV | Disediakan di repo + dijelaskan di README | P0 |
| M10-4 | Pencatatan waktu pembaruan data | Setiap import memperbarui "terakhir diperbarui" di Tentang Data | P1 |

---

## Kebutuhan Non-Fungsional
| Kategori | Persyaratan |
|---|---|
| Performa | Halaman utama < 3 dtk (jaringan normal); peta 10.000+ titik lancar dengan clustering |
| Keamanan | HTTPS, hash password (argon2/bcrypt), rate limit login, semua endpoint data hanya GET dan terautentikasi, proteksi XSS/SQLi, rahasia di environment variables |
| Ketersediaan | Target 99% pada fase demo; backup database terjadwal |
| Responsif | Desktop utama; tablet & mobile layak digunakan |
| Aksesibilitas | Kontras memadai, navigasi keyboard dasar, label form, tidak mengandalkan warna saja |
| Lokalisasi | Bahasa Indonesia, tanggal & rupiah lokal, WIB |
| Skalabilitas | Skema & query siap 80.000+ koperasi (index, paginasi & agregasi di server) |
| Portabilitas | Tanpa fitur eksklusif vendor; Postgres standar |
| Ekstensibilitas | Peran & izin lewat satu lapisan (`lib/rbac.ts`); route baca terpisah dari logika tulis (lihat `03`) |
