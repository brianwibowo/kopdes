from pathlib import Path
from xml.sax.saxutils import escape
import json
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, Flowable
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage

ROOT=Path('/Users/mymac/Documents/Codes/kopdes')
OUT=ROOT/'output/pdf'; ASSETS=ROOT/'tmp/pdfs/assets'
FONTROOT=Path('/Users/mymac/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype')
for name,file in [('VS','NotoSans-Regular.ttf'),('VS-Bold','NotoSans-Bold.ttf'),('VS-Italic','NotoSans-Italic.ttf')]: pdfmetrics.registerFont(TTFont(name,str(FONTROOT/file)))
pdfmetrics.registerFontFamily('VS',normal='VS',bold='VS-Bold',italic='VS-Italic',boldItalic='VS-Bold')
PAGE_W,PAGE_H=A4; M=44; W=PAGE_W-2*M
NAVY=colors.HexColor('#102D52'); BLUE=colors.HexColor('#0754AC'); PALE=colors.HexColor('#EDF4FC'); INK=colors.HexColor('#1B2D43'); MUTED=colors.HexColor('#62748B'); LINE=colors.HexColor('#DCE5EF'); LIGHT=colors.HexColor('#F7F9FC'); GOLD=colors.HexColor('#946020')
styles={
 'body':ParagraphStyle('body',fontName='VS',fontSize=9.5,leading=14.2,textColor=INK,spaceAfter=7),
 'small':ParagraphStyle('small',fontName='VS',fontSize=8.4,leading=12.2,textColor=MUTED,spaceAfter=5),
 'tiny':ParagraphStyle('tiny',fontName='VS',fontSize=7.4,leading=10.2,textColor=MUTED,spaceAfter=3),
 'h1':ParagraphStyle('h1',fontName='VS-Bold',fontSize=23,leading=28,textColor=NAVY,spaceAfter=10),
 'h2':ParagraphStyle('h2',fontName='VS-Bold',fontSize=14.5,leading=19,textColor=NAVY,spaceBefore=8,spaceAfter=8),
 'h3':ParagraphStyle('h3',fontName='VS-Bold',fontSize=10.5,leading=15,textColor=BLUE,spaceBefore=5,spaceAfter=5),
 'eyebrow':ParagraphStyle('eyebrow',fontName='VS-Bold',fontSize=8,leading=11,textColor=BLUE,spaceAfter=7),
 'cell':ParagraphStyle('cell',fontName='VS',fontSize=8.3,leading=11.6,textColor=INK),
 'cellsm':ParagraphStyle('cellsm',fontName='VS',fontSize=7.7,leading=10.6,textColor=INK),
 'num':ParagraphStyle('num',fontName='VS',fontSize=8.2,leading=11.6,textColor=INK,alignment=TA_RIGHT),
 'th':ParagraphStyle('th',fontName='VS-Bold',fontSize=8,leading=11,textColor=colors.white),
 'thnum':ParagraphStyle('thnum',fontName='VS-Bold',fontSize=8,leading=11,textColor=colors.white,alignment=TA_RIGHT),
 'white':ParagraphStyle('white',fontName='VS-Bold',fontSize=18,leading=24,textColor=colors.white),
}

def P(text,kind='body'):return Paragraph(text,styles[kind])
def money(value):return 'Rp '+f'{value:,.0f}'.replace(',','.')
def link(url,label=None):return f'<link href="{escape(url,{chr(34):"&quot;"})}" color="#0754AC">{escape(label or url)}</link>'
def gap(n=7):return Spacer(1,n)
def title(section,heading,sub=''):
    flow=[P(section.upper(),'eyebrow'),P(heading,'h1')]
    if sub:flow.append(P(sub))
    return flow

def box(text,bg=PALE):
    t=Table([[P(text)]],colWidths=[W]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),bg),('BOX',(0,0),(-1,-1),0.6,LINE),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),5)]));return t

def table(headers,rows,widths=None,small=False,compact=False):
    data=[[P(h,'th') for h in headers]]+[[P(str(v),'cellsm' if small else 'cell') for v in row] for row in rows]
    t=Table(data,colWidths=widths or [W/len(headers)]*len(headers),repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),NAVY),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,0),0.7,NAVY),('LINEBELOW',(0,1),(-1,-1),0.4,LINE),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),4 if compact else 7),('BOTTOMPADDING',(0,0),(-1,-1),4 if compact else 7)]))
    return t

def steps(items,start=1):
    result=[]
    for i,text in enumerate(items,start):
        t=Table([[P(f'{i:02d}','h3'),P(text)]],colWidths=[28,W-28]);t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),1),('BOTTOMPADDING',(0,0),(-1,-1),3)]));result.append(t)
    return result

def screenshot(name,caption,width=W):
    path=ASSETS/name
    iw,ih=PILImage.open(path).size
    return [Image(str(path),width=width,height=width*ih/iw),gap(4),P(caption,'tiny'),gap(6)]

def brand_cover(label,compact=False):
    row=Table([[Image(str(ASSETS/'logo-vuriko.png'),width=58 if compact else 77,height=58 if compact else 77),[P('PT VURIKO STUDIO','h2'),P('Pengembangan website &amp; modelling Kopdes','small'),P(label,'eyebrow')]]],colWidths=[95,W-95]);row.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),8)]));return row

class NumberedCanvas(canvas.Canvas):
    def __init__(self,*a,**kw):super().__init__(*a,**kw);self.states=[]
    def showPage(self):self.states.append(dict(self.__dict__));self._startPage()
    def save(self):
        total=len(self.states)
        for state in self.states:
            self.__dict__.update(state)
            self.setStrokeColor(LINE);self.setLineWidth(.6);self.line(M,44,PAGE_W-M,44)
            self.setFont('VS',7.2);self.setFillColor(MUTED)
            self.drawString(M,30,'Dibuat oleh PT Vuriko Studio  |  7 Oktober 2026')
            self.drawRightString(PAGE_W-M,30,f'{self._pageNumber:02d} / {total:02d}')
            super().showPage()
        super().save()

def create_pdf(name,doc_title,story,label):
    def page(c,doc):
        c.setTitle(doc_title);c.setAuthor('PT Vuriko Studio');c.setSubject('Kopdes - panduan dan estimasi penawaran');c.setCreator('PT Vuriko Studio')
        if doc.page>1:
            c.drawImage(str(ASSETS/'logo-vuriko.png'),M,PAGE_H-51,width=24,height=24,mask='auto')
            c.setFont('VS-Bold',8.6);c.setFillColor(NAVY);c.drawString(M+32,PAGE_H-36,'PT VURIKO STUDIO')
            c.setFont('VS',7.4);c.setFillColor(MUTED);c.drawRightString(PAGE_W-M,PAGE_H-36,label)
            c.setStrokeColor(LINE);c.line(M,PAGE_H-61,PAGE_W-M,PAGE_H-61)
    doc=SimpleDocTemplate(str(OUT/name),pagesize=A4,leftMargin=M,rightMargin=M,topMargin=78,bottomMargin=57,title=doc_title,author='PT Vuriko Studio',pageCompression=1)
    doc.build(story,onFirstPage=page,onLaterPages=page,canvasmaker=NumberedCanvas)

PUBLIC='https://kopdes-brin.vercel.app'
LOCAL='http://127.0.0.1:3000'

def guide():
    s=[brand_cover('Panduan penggunaan | Versi MVP 1.0'),P('Panduan akses<br/>website &amp; modelling<br/>Kopdes','h1'),P('Langkah penggunaan seluruh fitur, simulasi usaha, dan pengunduhan dataset.','body')]
    s+=screenshot('beranda.jpg','Beranda pada build MVP yang menjadi acuan panduan ini.')
    s+=[box('<b>Alamat website acuan</b><br/>'+link(PUBLIC)+'<br/><b>Penyusun dan pengembang:</b> PT Vuriko Studio.'),gap(9),P('<b>Status panduan:</b> mengacu pada build lokal tanggal 7 Oktober 2026. Penerapan fitur modelling ke domain publik belum dikonfirmasi dalam dokumen ini. Jika menu baru belum tampil, gunakan preview lokal yang dijalankan pengembang atau lakukan deployment build terbaru.','small'),P('Dataset contoh: 53 koperasi pada 38 provinsi; periode Januari-Desember 2026. Seluruh data dan rumus bersifat simulasi untuk presentasi.','small'),PageBreak()]
    s+=title('01 / Persiapan','Mulai dari satu alamat','Website dan modelling berada dalam satu aplikasi. Pada MVP, pengguna dapat menjelajah fitur tanpa akun atau login.')
    s+=steps(['Buka '+link(PUBLIC)+' melalui browser. Untuk demonstrasi di komputer pengembang, gunakan '+link(LOCAL)+'. Alamat lokal hanya bekerja saat aplikasi sedang dijalankan di komputer tersebut.','Gunakan menu <b>Beranda, Statistik, Modelling, Direktori,</b> atau <b>Marketplace</b>. Pada layar kecil, buka tombol menu bergaris tiga di kanan atas.','Pastikan label <b>DEMO / MVP</b> terlihat. Gunakan tahun <b>2026</b> untuk mencoba data yang tersedia.'])
    rows=[('Beranda','/','Ringkasan, tahapan, dan peta awal','3'),('Direktori','/koperasi','Cari koperasi dan unduh rekap','3'),('Profil koperasi','/pers/dashboard/village/[id]','Dibuka melalui tombol Detail / Lihat','4'),('Marketplace','/marketplace','Jelajahi komoditas dan model usaha','4'),('Statistik','/pers/dashboard','Ringkasan serta pilihan dataset','5'),('Supply chain','/modelling/supply-chain','Diagram dan hubungan mitra','6'),('Peta Kopdes','/modelling/peta','Peta serta daftar lokasi','7'),('Keuntungan','/modelling/keuntungan','Pendapatan, biaya, dan laba','8'),('Arus kas','/modelling/arus-kas','Penerimaan dan saldo kas','9')]
    s+=[table(['Menu','Rute pada domain yang sama','Kegunaan','Hal.'],rows,[83,177,215,W-475],True),gap(12),box('<b>Alur penggunaan</b><br/>Pilih wilayah dan periode &gt; buka model &gt; ubah skenario &gt; periksa hasil &gt; unduh dataset. Tautan antartab dan navigasi Statistik/Modelling membawa filter aktif.'),gap(8),P('Rute /modelling membuka Supply chain; /peta membuka Peta Kopdes. /statistik dan /progres mengarah ke Statistik. Jangan mengetik [id] secara literal: gunakan tautan profil pada tabel.','small'),PageBreak()]
    s+=title('02 / Website','Beranda dan direktori','Gunakan direktori untuk menemukan koperasi yang akan dianalisis.')
    s+=screenshot('direktori.jpg','Contoh direktori setelah provinsi Jawa Barat dipilih.')
    s+=steps(['Dari <b>Beranda</b>, pilih <b>Buka Dashboard Statistik</b> untuk ringkasan atau <b>Jelajahi Modelling</b> untuk analisis. Gulir untuk melihat tahapan, peta, dan catatan pendampingan.','Buka <b>Direktori</b>. Isi kolom pencarian dengan nama koperasi, desa, kabupaten, ketua, nomor registrasi, atau komoditas.','Pilih <b>provinsi</b> dan <b>status keaktifan</b>. Jumlah hasil berubah sesuai kombinasi pencarian dan filter.','Gunakan tombol halaman dan pilihan jumlah data per halaman bila hasilnya banyak. Pilih <b>Reset Filter</b> untuk kembali ke seluruh data.','Klik nama koperasi atau <b>Detail</b> untuk membuka profil. Pilih <b>Unduh Rekap CSV</b> untuk seluruh hasil filter, bukan hanya halaman tabel yang sedang terlihat.'])
    s+=[box('<b>Perbedaan rekap:</b> CSV direktori berisi profil dan angka tahunan contoh. CSV pada modul modelling berisi rincian koperasi per bulan serta skenario aktif.'),PageBreak()]
    s+=title('03 / Website','Profil dan marketplace','Profil menghubungkan identitas koperasi dengan analisis; marketplace menjadi pintu masuk berdasarkan komoditas.')
    left=screenshot('profil.jpg','Profil koperasi terpilih.',width=(W-16)/2)
    right=screenshot('marketplace.jpg','Etalase komoditas pada wilayah terpilih.',width=(W-16)/2)
    gallery=Table([[left,right]],colWidths=[(W-16)/2+8,(W-16)/2+8]);gallery.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),8)]));s+=[gallery,gap(6),P('A. Membaca profil koperasi','h2')]
    s+=steps(['Buka <b>Detail</b> dari direktori, tautan <b>Lihat</b> pada hasil model, atau <b>Buka profil koperasi</b> dari panel peta.','Periksa identitas, status, anggota, aset, komoditas, mitra, serta catatan monitoring. Data legalitas yang belum tersedia ditampilkan sebagai belum terdata.','Pilih <b>Supply chain, Peta Kopdes, Keuntungan,</b> atau <b>Arus kas</b> pada bagian <b>Jelajahi model koperasi ini</b>. Koperasi otomatis menjadi fokus analisis.'])
    s+=[P('B. Menggunakan marketplace','h2')]
    s+=steps(['Buka <b>Marketplace</b>. Pilih kategori komoditas, gunakan pencarian, lalu pilih provinsi bila diperlukan.','Pada kartu komoditas, baca koperasi asal, lokasi, mitra penyerapan, dan pendapatan contoh tahunan.','Klik <b>Profil Koperasi</b> untuk identitas atau <b>Model usaha</b> untuk membuka supply chain koperasi tersebut.'])
    s+=[box('Marketplace MVP merupakan etalase data. Transaksi, pembayaran, kontak kemitraan, tonase, dan verifikasi sertifikasi belum disediakan.'),PageBreak()]
    s+=title('04 / Analisis','Statistik dan pilihan dataset','Filter yang sama digunakan oleh Ringkasan, Supply chain, Peta Kopdes, Keuntungan, dan Arus kas.')
    s+=screenshot('statistik.jpg','Kontrol wilayah, koperasi, periode, dan skenario berada di bagian atas halaman.')
    s+=[table(['Kontrol','Cara menggunakan'],[
      ('Provinsi','Pilih satu provinsi atau Seluruh Indonesia. Mengganti provinsi mengembalikan pilihan koperasi ke semua koperasi pada wilayah tersebut.'),
      ('Koperasi','Pilih semua koperasi di wilayah atau satu koperasi tertentu.'),
      ('Dari / Sampai bulan','Gunakan bulan awal dan akhir pada tahun 2026; bulan awal tidak boleh melewati bulan akhir.'),
      ('Harga / biaya / jeda','Geser harga jual dan biaya, lalu pilih jeda penerimaan 0, 1, atau 2 bulan. Perubahan berlaku pada hasil seluruh model.'),
      ('Reset semua','Mengembalikan wilayah, koperasi, periode, dan skenario ke kondisi awal.'),
      ('Kembalikan kondisi dasar','Mengembalikan harga, biaya, dan jeda ke nol sambil mempertahankan pilihan wilayah dan periode.')
    ],[118,W-118]),gap(10),P('<b>Baca hasil:</b> kartu ringkasan menunjukkan jumlah koperasi, anggota, pendapatan, dan laba. Bagian kelembagaan menunjukkan status serta tahapan; grafik dan tabel berasal dari dataset terpilih.','small'),P('Pilihan tersimpan dalam URL. Salin alamat halaman untuk membuka ulang hasil yang sama. Filter direktori dan marketplace merupakan pencarian tersendiri.','small'),PageBreak()]
    s+=title('05 / Modelling','Supply chain','Tampilkan hubungan ilustratif produsen atau anggota, koperasi, dan mitra penyerapan.')
    s+=screenshot('supply-chain.jpg','Contoh model Jawa Barat, Januari-April 2026, dengan skenario harga +10% dan biaya +5%.')
    s+=steps(['Buka <b>Modelling</b>, lalu pilih tab <b>Supply chain</b>. Tentukan provinsi, koperasi, serta periode.','Baca diagram dari kiri ke kanan: <b>Produsen / anggota &gt; Koperasi &gt; Mitra</b>. Nilai pembelian dan penjualan mengikuti hasil model.','Gulir ke tabel <b>Hubungan supply chain</b> untuk melihat komoditas dan mitra setiap koperasi. Klik <b>Lihat</b> untuk membuka profil.','Pilih <b>Diagram SVG</b> untuk gambar, <b>JSON</b> untuk dataset termasuk hubungan mitra, atau <b>CSV / Excel</b> untuk rincian keuangan per koperasi-bulan.'])
    s+=[box('<b>Cara menafsirkan:</b> nilai panah adalah rupiah, bukan tonase atau catatan pengiriman. Diagram bersifat agregat dan ilustratif. Lokasi mitra, rute logistik, dan optimasi distribusi belum dimodelkan.'),PageBreak()]
    s+=title('06 / Modelling','Peta Kopdes','Peta dan tabel lokasi mengikuti koperasi pada pilihan wilayah serta periode yang aktif.')
    s+=screenshot('peta.jpg','Tiga koperasi contoh di Jawa Barat; satu titik mewakili satu koperasi.')
    s+=steps(['Pilih tab <b>Peta Kopdes</b>. Pastikan wilayah dan periode yang diinginkan masih terpilih.','Gunakan tombol <b>+</b> dan <b>-</b> untuk mengatur zoom. Geser peta untuk melihat area sekitar.','Klik titik bernomor <b>1</b> untuk membuka panel ringkasan koperasi. Panel memuat anggota, aset profil, komoditas, dan mitra.','Pilih <b>Buka profil koperasi</b> untuk detail, tombol <b>X</b> untuk menutup panel, atau <b>Lihat Indonesia</b> untuk mengembalikan cakupan peta nasional.','Baca tabel di bawah peta untuk lokasi administratif dan koordinat. Ekspor CSV/JSON memakai filter yang sama dengan hasil model.'])
    s+=[box('Koordinat adalah contoh untuk presentasi. Peta dasar membutuhkan internet. Bila peta gagal dimuat, tabel lokasi tetap dapat digunakan. Pada cetak/PDF, lokasi disajikan dalam tabel.'),PageBreak()]
    s+=title('07 / Modelling','Keuntungan dan skenario usaha','Bandingkan pendapatan dan biaya pada kondisi dasar maupun skenario perubahan usaha.')
    s+=screenshot('keuntungan.jpg','Grafik pendapatan dan laba pada periode Januari-April 2026.')
    s+=steps(['Pilih tab <b>Keuntungan</b>. Tetapkan wilayah, koperasi, dan periode analisis.','Baca kartu <b>Pendapatan, Total biaya, Laba model,</b> dan <b>Margin laba</b>.','Geser <b>Perubahan harga jual</b> dan <b>Perubahan seluruh biaya</b>. Contoh presentasi: harga <b>+10%</b> dan biaya <b>+5%</b>.','Baca baris <b>Dampak terhadap kondisi dasar</b>. Arahkan penunjuk ke grafik untuk nilai bulanan; buka rincian perhitungan untuk angka rupiah lengkap.','Pilih <b>Kembalikan kondisi dasar</b> untuk membandingkan lagi, atau unduh hasil sesuai skenario aktif.'])
    s+=[box('<b>Rumus demo:</b> laba = pendapatan - (pembelian + distribusi + operasional). Margin = laba / pendapatan. Harga mengubah pendapatan dengan volume tetap; biaya mengubah semua komponen biaya. Hasil bukan estimasi penelitian tervalidasi.'),PageBreak()]
    s+=title('08 / Modelling','Arus kas dan waktu pembayaran','Laba dan kas dapat berbeda karena penerimaan penjualan bisa tertunda.')
    s+=screenshot('arus-kas.jpg','Contoh jeda penerimaan 1 bulan. Saldo kas dapat negatif walaupun laba positif.')
    s+=steps(['Pilih tab <b>Arus kas</b>. Periksa kembali wilayah, koperasi, periode, dan skenario harga/biaya.','Pada <b>Jeda penerimaan penjualan</b>, pilih langsung, 1 bulan kemudian, atau 2 bulan kemudian.','Baca <b>Saldo awal periode, Penerimaan kas, Pembayaran kas,</b> dan <b>Saldo akhir periode</b>.','Bandingkan garis penerimaan, pembayaran, dan saldo akhir pada grafik. Tabel di bawahnya menampilkan perubahan per bulan.','Unduh CSV/JSON atau cetak laporan. Perubahan jeda mengubah waktu kas masuk; pengakuan laba dalam model tetap mengikuti bulan penjualan.'])
    s+=[box('<b>Rumus demo:</b> saldo akhir = saldo awal + penerimaan - pembayaran. Saldo awal Januari diasumsikan 10% aset. Saat periode diganti, saldo awal membawa hasil bulan sebelumnya; tidak dihitung ulang dari nol. Tidak ada piutang awal dan penerimaan setelah Desember belum masuk kas tahun ini.'),PageBreak()]
    s+=title('09 / Produk keluaran','Unduh data dan cetak laporan','Keluaran mengikuti pilihan yang aktif saat tombol unduh ditekan.')
    s+=[table(['Tombol','Isi hasil','Cara memakai'],[
      ('Unduh Rekap CSV','Profil koperasi dan angka tahunan pada direktori.','Buka di Excel atau impor melalui Data > From Text/CSV.'),
      ('CSV / Excel','Satu baris per koperasi per bulan: pendapatan, biaya, laba, kas, filter, dan parameter skenario.','Berkas berformat .csv, bukan .xlsx. Pilih UTF-8 dan delimiter koma jika kolom belum terpisah.'),
      ('JSON','Metadata, asumsi, profil koperasi, catatan bulanan, total, dan hubungan supply chain.','Dipakai untuk pengolahan data lanjutan atau integrasi aplikasi.'),
      ('Diagram SVG','Gambar supply chain agregat sesuai pilihan.','Tersedia pada tab Supply chain; dapat dibuka di browser atau aplikasi grafis.'),
      ('Cetak / PDF','Laporan berbasis tabel dari halaman model aktif.','Gunakan dialog cetak browser untuk menyimpan sebagai PDF.')
    ],[100,223,W-323]),gap(13),P('Langkah menyimpan PDF','h2')]
    s+=steps(['Atur wilayah, periode, dan skenario. Pastikan hasil data sudah tampil, lalu klik <b>Cetak / PDF</b>.','Pada dialog cetak, pilih <b>Simpan sebagai PDF / Save as PDF</b>. Gunakan kertas <b>A4</b> dan orientasi <b>landscape</b> jika browser tidak mengikuti pengaturan halaman.','Periksa pratinjau, lalu simpan. Laporan memuat tabel; grafik dan peta interaktif tetap dibaca di website. Dialog cetak dapat berbeda antarbrowser.'])
    s+=[P('Sinkronisasi yang perlu diketahui','h2'),box('Statistik, profil, model, dan ekspor menggunakan dataset serta fungsi hitung yang sama. Skenario tidak mengubah data dasar. MVP belum memiliki unggah dataset, login admin, database produksi, atau penyimpanan skenario lintas pengguna.'),gap(9),P('Untuk integrasi teknis, endpoint baca /api/modelling menerima filter yang sama dan format json, csv, atau svg. Contoh dokumentasi terdapat dalam README proyek. Endpoint ini hanya menyajikan data demo.','small'),PageBreak()]
    s+=title('10 / Presentasi','Alur demo dan bantuan singkat','Gunakan satu contoh wilayah agar perubahan pada empat model mudah dibandingkan.')
    s+=[table(['Urutan','Aksi','Hal yang diperlihatkan'],[
      ('1','Buka Statistik; mulai dari Seluruh Indonesia.','53 koperasi contoh dan ringkasan nasional.'),
      ('2','Pilih Jawa Barat, Januari-April 2026.','Hasil menyusut menjadi 3 koperasi.'),
      ('3','Buka Supply chain lalu Peta Kopdes.','Filter ikut terbawa; model mengikuti pilihan.'),
      ('4','Buka Keuntungan; harga +10%, biaya +5%.','Bandingkan laba dengan kondisi dasar.'),
      ('5','Buka Arus kas; jeda penerimaan 1 bulan.','Kas berbeda dari laba akibat waktu penerimaan.'),
      ('6','Unduh CSV/JSON; kembali ke Supply chain untuk SVG.','Hasil analisis dapat menjadi produk data dan gambar.'),
      ('7','Buka profil koperasi; kembali ke modelnya.','Koperasi terpilih menjadi fokus analisis.')
    ],[44,242,W-286]),gap(15),P('Jika hasil tidak sesuai harapan','h2'),table(['Kondisi','Langkah penanganan'],[
      ('Menu Modelling belum terlihat','Pastikan build terbaru sudah di-deploy. Untuk preview lokal, server aplikasi harus berjalan di komputer pengembang.'),
      ('Tidak ada data','Pilih tahun 2026 dan wilayah yang tersedia. Tekan Tampilkan dataset demo atau Reset semua.'),
      ('Periode belum valid','Pastikan Dari bulan tidak melewati Sampai bulan.'),
      ('Angka antarhalaman berbeda','Cocokkan provinsi, koperasi, periode, harga, biaya, dan jeda. Profil fokus pada satu koperasi; direktori memakai angka tahunan.'),
      ('Peta kosong / ekspor PDF tidak muncul','Periksa internet untuk peta. Untuk cetak, buka di browser penuh dan gunakan Print / Cetak jika browser tertanam tidak menampilkan dialog.'),
      ('Data koperasi belum ditemukan','Buka profil melalui direktori atau tabel model. ID yang tidak tersedia menghasilkan halaman 404.')
    ],[151,W-151]),gap(12),P('<b>Catatan versi:</b> gambar berasal dari aplikasi lokal. Data dan rumus final tahun 2027 menunggu bahan serta validasi periset. Panduan ini menjelaskan MVP, bukan janji bahwa seluruh lingkup produksi pada RAB telah selesai.','small')]
    create_pdf('Panduan-Akses-Kopdes-PT-Vuriko-Studio.pdf','Panduan Akses Website dan Modelling Kopdes - PT Vuriko Studio',s,'PANDUAN AKSES KOPDES | MVP 1.0')

# Each row is (scope, quantity, unit, unit price); amounts are derived, never typed separately.
WEB=[
 ('A','Analisis kebutuhan dan UI/UX',[
  ('Pemetaan kebutuhan, alur pengguna, dan koordinasi awal',2,'sesi',750000),
  ('Arsitektur aplikasi, kontrak API, dan struktur informasi',1,'paket',1000000),
  ('Desain enam template layar responsif',6,'template',500000)]),
 ('B','Pengembangan frontend (FE)',[
  ('Beranda, navigasi, dan komponen tampilan responsif',1,'paket',2000000),
  ('Direktori: pencarian, filter, tabel, dan pagination',1,'modul',2500000),
  ('Profil koperasi, legalitas, dan informasi usaha',1,'modul',2000000),
  ('Dashboard statistik, grafik, dan tahapan kelembagaan',1,'modul',2500000),
  ('Etalase marketplace dan tautan profil / model usaha',1,'modul',1500000)]),
 ('C','Pengembangan backend (BE)',[
  ('API kelola data profil koperasi dan komoditas',1,'paket',3000000),
  ('Alur akun, login admin, dan manajemen peran dasar',1,'paket',2000000),
  ('Import satu format CSV dan ekspor rekap data',1,'paket',1500000),
  ('Endpoint agregasi statistik dan integrasi frontend',1,'paket',1000000)]),
 ('D','Database dan penyiapan data',[
  ('Perancangan ERD dan skema database operasional',1,'paket',1500000),
  ('Migrasi, indeks dasar, dan koneksi database',1,'paket',1500000),
  ('Validasi, pemetaan, dan pemuatan dataset awal terstruktur',1,'paket',1000000)]),
 ('E','Keamanan aplikasi',[
  ('Penguatan sesi dan pengujian pembatasan hak akses',1,'paket',1200000),
  ('Validasi input, batas permintaan, dan konfigurasi header',1,'paket',1300000),
  ('Pemeriksaan dependensi, rahasia aplikasi, dan konfigurasi',1,'paket',1000000)]),
 ('F','Pengujian dan perbaikan',[
  ('Pengujian fungsi utama dan regresi alur pengguna',1,'paket',2000000),
  ('Pemeriksaan browser, tampilan responsif, dan peta',1,'paket',1000000),
  ('Pendampingan UAT dan perbaikan temuan sesuai scope',1,'paket',1000000)]),
 ('G','Deployment dan serah terima',[
  ('Pipeline build, deployment aplikasi, dan konfigurasi domain',1,'paket',1500000),
  ('Konfigurasi environment serta uji backup dan pemulihan awal',1,'paket',1200000),
  ('Dokumentasi teknis dan panduan penggunaan',1,'paket',900000),
  ('Pelatihan operator dan serah terima akses / source code',1,'sesi',800000)]),
 ('H','Manajemen pekerjaan',[
  ('Koordinasi progres, pencatatan keputusan, dan pengendalian revisi',10,'minggu',250000)]),
 ('I','Server / hosting dan operasional 12 bulan',[
  ('Alokasi kapasitas hosting aplikasi website',12,'bulan',175000),
  ('Alokasi kapasitas database operasional / VPS',12,'bulan',200000),
  ('Penyimpanan cadangan data operasional',12,'bulan',75000),
  ('Monitoring dasar dan pemeliharaan layanan infrastruktur',12,'bulan',100000),
  ('Alokasi transfer data / traffic tahunan',1,'paket',400000)])
]
MODEL=[
 ('A','Analisis model dan kontrak data',[
  ('Pemetaan empat model dan kebutuhan hasil bersama periset',1,'sesi',800000),
  ('Kontrak struktur data, filter wilayah, dan periode',1,'paket',700000),
  ('Penyepakatan parameter skenario serta contoh hasil acuan',1,'paket',500000)]),
 ('B','Layouting dan frontend visualisasi',[
  ('Supply chain: diagram agregat dan tabel hubungan',1,'modul',1250000),
  ('Peta Kopdes: filter wilayah, titik, dan tautan profil',1,'modul',1250000),
  ('Keuntungan: kartu hasil, grafik, dan kontrol skenario',1,'modul',1250000),
  ('Arus kas: grafik, tabel bulanan, dan simulasi jeda',1,'modul',1250000)]),
 ('C','Backend perhitungan dan integrasi',[
  ('Implementasi mesin hitung deterministik dari rumus periset',1,'paket',1500000),
  ('Endpoint model serta penyaringan wilayah dan periode',1,'paket',1000000),
  ('Ekspor CSV, JSON, SVG dan layout cetak / PDF browser',1,'paket',1000000)]),
 ('D','Database dataset modelling',[
  ('Ekstensi skema periode, parameter, dan versi dataset',1,'paket',800000),
  ('Pemetaan import terstruktur dan validasi dataset modelling',1,'paket',700000)]),
 ('E','Keamanan modul modelling',[
  ('Validasi parameter model dan sanitasi keluaran ekspor',1,'paket',500000),
  ('Integrasi hak akses dataset / ekspor dengan akun website',1,'paket',500000)]),
 ('F','Pengujian hasil dan UAT',[
  ('Pencocokan keluaran terhadap contoh hitung yang disetujui periset',1,'paket',1500000),
  ('Uji integrasi antarmodul, filter, ekspor, dan perbaikan UAT',1,'paket',1000000)]),
 ('G','Deployment, panduan, dan serah terima',[
  ('Deployment rute modelling pada aplikasi / domain yang sama',1,'paket',500000),
  ('Panduan model, asumsi, serta penggunaan hasil ekspor',1,'paket',500000),
  ('Pelatihan penggunaan dan serah terima modul',1,'sesi',500000)]),
 ('H','Koordinasi finalisasi',[
  ('Koordinasi finalisasi data, rumus, dan hasil bersama periset',3,'sesi',300000)]),
 ('I','Server / hosting modelling dan operasional 12 bulan',[
  ('Alokasi tambahan komputasi model dan pembuatan hasil ekspor',12,'bulan',250000),
  ('Penyimpanan tambahan dataset dan hasil modelling',12,'bulan',125000),
  ('Cadangan dan retensi versi dataset modelling',12,'bulan',75000),
  ('Monitoring kapasitas komputasi dan layanan modelling',12,'bulan',100000),
  ('Alokasi transfer dataset / traffic tahunan modelling',1,'paket',400000)])
]

def subtotal(group):return sum(q*price for _,q,_,price in group[2])
def total(groups):return sum(map(subtotal,groups))
assert total(WEB)==48900000 and total(MODEL)==24900000
assert subtotal(WEB[-1])==subtotal(MODEL[-1])==7000000
assert total(WEB[:-1])==41900000 and total(MODEL[:-1])==17900000

def budget_table(groups):
    data=[[P(x,'thnum' if i>=4 else 'th') for i,x in enumerate(['Kode','Uraian pekerjaan / keluaran','Vol.','Satuan','Harga satuan','Jumlah'])]]
    group_rows=[]
    for letter,name,rows in groups:
        group_rows.append(len(data));data.append([P(f'<b>{letter}. {name}</b>','cell'),'','','','',P('<b>'+money(sum(q*p for _,q,_,p in rows))+'</b>','num')])
        for n,(desc,q,unit,price) in enumerate(rows,1): data.append([P(f'{letter}.{n}','cellsm'),P(escape(desc),'cellsm'),P(str(q),'cellsm'),P(unit,'cellsm'),P(money(price),'num'),P(money(q*price),'num')])
    t=Table(data,colWidths=[31,W-271,26,43,80,91],repeatRows=1,hAlign='LEFT')
    commands=[('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),NAVY),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),('LINEBELOW',(0,0),(-1,-1),0.35,LINE)]
    for index in group_rows:commands += [('SPAN',(0,index),(4,index)),('BACKGROUND',(0,index),(-1,index),PALE),('TOPPADDING',(0,index),(-1,index),6),('BOTTOMPADDING',(0,index),(-1,index),6)]
    t.setStyle(TableStyle(commands));return t

def totals_bar(groups):
    services=total(groups[:-1]);server=subtotal(groups[-1]);grand=services+server
    t=Table([[P('Jasa pengembangan','small'),P('Server / hosting 12 bulan','small'),P('TOTAL PAKET','th')],[P(money(services),'h2'),P(money(server),'h2'),P(money(grand),'white')]],colWidths=[W*.33,W*.33,W*.34]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(1,1),PALE),('BACKGROUND',(2,0),(2,1),BLUE),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),7)]));return t

def budget(kind,groups):
    web=kind=='website'; heading='Pengembangan Website Kopdes' if web else 'Layouting & Modelling Kopdes'
    amount=total(groups)
    s=[brand_cover('RAB 01 | Website' if web else 'RAB 02 | Layouting & modelling',compact=True),P('Rencana anggaran biaya','h1'),P(heading,'h2'),P('Estimasi awal untuk pembahasan vendor dan rencana pelaksanaan 2027.','body'),totals_bar(groups),gap(14)]
    desc=('<b>Tujuan paket:</b> menyediakan fondasi website Kopdes: beranda, direktori, profil, statistik, peta, etalase komoditas, serta layanan pengelolaan data untuk operasional.' if web else '<b>Tujuan paket:</b> menghasilkan empat modul analisis yang terintegrasi dengan website: supply chain, peta Kopdes, keuntungan, dan arus kas, dilengkapi filter, skenario sederhana, dan ekspor.')
    s+=[P(desc),P('<b>Basis anggaran:</b> biaya server Rp7.000.000 sudah termasuk dalam total paket. Durasi layanan server diasumsikan 12 bulan sejak layanan paket tersebut diaktifkan.','small'),P('Rekap komponen','h2')]
    short_names=['Analisis dan desain','Frontend / visualisasi','Backend dan integrasi','Database dan data awal','Keamanan aplikasi','Pengujian dan UAT','Deployment dan serah terima','Koordinasi dan manajemen','Server / hosting 12 bulan']
    s+=[table(['Komponen','Alokasi'],[(f'{g[0]}. {short_names[i]}',money(subtotal(g))) for i,g in enumerate(groups)]+[('<b>Total estimasi paket</b>','<b>'+money(amount)+'</b>')],[W-128,128],compact=True),gap(10),box('<b>Status pekerjaan dan penawaran</b><br/>Aplikasi saat ini adalah MVP presentasi. RAB ini mengalokasikan jasa dan finalisasi untuk lingkup yang ditawarkan; bukan pernyataan bahwa backend admin, database produksi, atau seluruh penguatan keamanan sudah tersedia.'),gap(8),P('Harga merupakan estimasi paket PT Vuriko Studio berdasarkan lingkup dan batas pekerjaan pada dokumen ini. Perhitungan pajak belum dimasukkan; perlakuannya ditetapkan pada penawaran/kontrak final.','small'),PageBreak()]
    s+=title('Rincian biaya / 1 dari 2','Analisis dan pengembangan','Seluruh angka dalam rupiah. Nilai setiap baris = volume x harga satuan.')
    s+=[budget_table(groups[:4]),gap(12),box('<b>Subtotal A-D: '+money(total(groups[:4]))+'</b><br/>'+('Frontend adalah tampilan pengguna; backend adalah layanan aplikasi; database adalah struktur serta pengelolaan penyimpanan data. Ketiganya merupakan pekerjaan berbeda.' if web else 'Fondasi website, akun, dan navigasi digunakan kembali dari paket website. Biaya paket ini mencakup ekstensi modul dan dataset modelling, bukan pembangunan ulang seluruh website.')),gap(10),P(('Peta koperasi menggunakan komponen geospasial pada website. Kebutuhan peta tambahan untuk analisis dibahas pada paket modelling.' if web else 'Periset menyediakan rumus, struktur data, dan hasil hitung acuan. Pekerjaan vendor adalah menerjemahkan spesifikasi tersebut ke program dan tampilan; pengumpulan data lapangan tidak termasuk.'),'small'),PageBreak()]
    s+=title('Rincian biaya / 2 dari 2','Validasi, deployment, dan server','Deployment adalah pekerjaan penerapan awal. Layanan server adalah alokasi kapasitas dan pengelolaan selama masa layanan.')
    s+=[budget_table(groups[4:]),gap(10),box('<b>Total paket: '+money(amount)+'</b><br/>Jasa A-H '+money(total(groups[:-1]))+' + server I '+money(subtotal(groups[-1]))+'.'),gap(8),P('Alokasi server merupakan estimasi paket kapasitas dan operasional, bukan kutipan tarif atau rincian tagihan provider. Spesifikasi kapasitas final ditetapkan setelah kebutuhan data dan pola penggunaan disepakati.','small'),PageBreak()]
    s+=title('Pelaksanaan & batas layanan','Ruang lingkup dan serah terima','Acuan awal untuk memperjelas pembagian pekerjaan sebelum penawaran final.')
    if web:
        timeline=[('Minggu 1-2','Kebutuhan, struktur data, UI/UX, dan spesifikasi penerimaan.'),('Minggu 3-7','Frontend, backend, autentikasi dasar, serta database.'),('Minggu 8-10','Integrasi data, penguatan keamanan, dan pengujian.'),('Minggu 11-12','UAT, perbaikan sesuai scope, deployment, pelatihan, dan serah terima.')]
        accepted='Halaman utama dapat digunakan; pencarian/filter dan rekap sesuai data; admin dapat mengelola data sesuai peran; alur import yang disepakati berjalan; database, akses, backup awal, panduan, dan source code diserahterimakan.'
        limits='Satu aplikasi web responsif, satu skema data utama, satu format import CSV awal, dan dua putaran revisi terjadwal. Marketplace berupa etalase; transaksi, payment gateway, aplikasi mobile native, dan integrasi eksternal baru tidak termasuk.'
    else:
        timeline=[('Minggu 1','Konfirmasi data, rumus, skenario, dan hasil acuan dari periset.'),('Minggu 2-4','Empat visualisasi, mesin hitung, serta filter wilayah/periode.'),('Minggu 5-6','Integrasi database, keamanan akses, dan keluaran dataset.'),('Minggu 7-8','Validasi bersama periset, UAT, perbaikan, deployment, dan pelatihan.')]
        accepted='Empat model dapat dijalankan berulang pada dataset yang disetujui; filter konsisten; hasil hitung cocok dengan contoh acuan periset; CSV/JSON/SVG dan cetak browser mengikuti hasil model; panduan dan source code diserahterimakan.'
        limits='Empat model awal dan satu struktur dataset awal, skenario harga/biaya/jeda, serta dua putaran revisi terjadwal. Optimasi rantai pasok nasional, AI/ML, simulasi berat, ekspansi bisnis, dan penambahan model di luar empat modul belum termasuk.'
    s+=[table(['Tahap indikatif','Hasil kerja'],timeline,[106,W-106]),gap(9),P('Jadwal indikatif: '+('Maret-Mei 2027 sejak kontrak dan bahan kerja siap.' if web else 'September-Oktober 2027; penyesuaian ke November dibahas bila bahan periset bergeser.')+' Tanggal pasti mengikuti kontrak dan kesiapan data.','small'),P('Hasil yang menjadi dasar penerimaan','h3'),P(accepted),P('Batas paket yang diusulkan','h3'),P(limits),P('Pembagian infrastruktur dan biaya berulang','h3')]
    infra=('Server website membiayai layanan aplikasi dasar, database operasional, backup, dan monitoring. Server modelling pada RAB terpisah membiayai tambahan komputasi, penyimpanan dataset/hasil, serta pemantauan analisis.' if web else 'Alokasi Rp7.000.000 pada paket ini adalah kapasitas tambahan modelling. Hosting dasar, akun, dan database inti memakai fondasi paket website. Biaya dasar yang sama tidak dibebankan kembali sebagai resource modelling.')
    s+=[P(infra),P('Keduanya dapat berbagi domain, project aplikasi, atau VPS dengan pemisahan alokasi resource. Rincian penggunaan disepakati agar tidak terjadi pembebanan ganda. Jika VPS disediakan klien, porsi penyediaan kapasitas ditinjau kembali pada penawaran final.','small'),P('Ketentuan estimasi','h3'),P('Masa server dihitung 12 bulan; perpanjangan dan kelebihan kapasitas dibahas terpisah. MVP presentasi tidak mensyaratkan VPS berbayar. Penguatan keamanan bersifat dasar dan tidak termasuk pentest independen atau sertifikasi. Dukungan bug pascaserah-terima diusulkan 30 hari kalender untuk lingkup yang disepakati.','small'),P('Periset/klien menyediakan data, materi, akses, serta validasi hasil. Pembersihan data besar, perubahan mendasar rumus/struktur, lisensi berbayar di luar alokasi, dan kebutuhan tambahan dibahas sebagai perubahan scope. Termin pembayaran serta pajak ditetapkan pada penawaran final.','small'),gap(5),box('<b>Rekap dua paket:</b> website Rp48.900.000 + modelling Rp24.900.000 = <b>Rp73.800.000</b>.<br/>Termasuk total alokasi server Rp14.000.000 (Rp7.000.000 per paket).')]
    create_pdf('RAB-Website-Kopdes-PT-Vuriko-Studio.pdf' if web else 'RAB-Modelling-Kopdes-PT-Vuriko-Studio.pdf','RAB '+heading+' - PT Vuriko Studio',s,'RAB WEBSITE | ESTIMASI AWAL' if web else 'RAB MODELLING | ESTIMASI AWAL')

if __name__=='__main__':
    OUT.mkdir(exist_ok=True,parents=True)
    guide();budget('website',WEB);budget('modelling',MODEL)
    manifest={}
    for kind,groups in [('website',WEB),('modelling',MODEL)]:
        manifest[kind]={'services':total(groups[:-1]),'server':subtotal(groups[-1]),'total':total(groups),'groups':[{'code':a,'name':n,'subtotal':subtotal(g),'items':[{'description':d,'quantity':q,'unit':u,'unit_price':p,'amount':q*p} for d,q,u,p in rows]} for g in groups for a,n,rows in [g]]}
    manifest['grand_total']=total(WEB)+total(MODEL)
    (ROOT/'tmp/pdfs/budget-check.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    print(json.dumps({k:v['total'] for k,v in manifest.items() if isinstance(v,dict)}));print('Combined:',manifest['grand_total'])
