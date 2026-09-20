# Spesiﬁkasi Formula — Kalkulator

**Perbandingan Biaya Chemical Laundry**

**PROTEK Laundry Calculator | PT. Anugerah Sejahtera Abadi (ASA)**

Dokumen ini berisi rumus, variabel, dan alur perhitungan lengkap untuk implementasi kalkulator di website. Struktur mengikuti alur input → hitung → bandingkan yang sudah ada di brosur/prototype.

## Input dari User (Rumah Sakit)

### 1 .1 Data Umum Laundry RS

| **Variabel**               | **Kode**              | **Tipe**             | **Keterangan**                   |
| -------------------------- | --------------------- | -------------------- | -------------------------------- |
| Berat linen kotor per hari | **beratLinenHarian**  | number<br><br>(kg)   | Input bebas, default contoh: 600 |
| Hari operasional per bulan | **hariOperasional**   | number<br><br>(hari) | Default: 30                      |
| Kapasitas mesin per load   | **kapasitasMesin**    | number<br><br>(kg)   | Default: 35 (bisa diedit RS)     |
| Rasio linen Non-Infeksius  | **rasioNonInfeksius** | % (0–<br><br>1 00)   | **Editable**, default:<br><br>30 |

| **Variabel**                 | **Kode**           | **Tipe**           | **Keterangan**                      |
| ---------------------------- | ------------------ | ------------------ | ----------------------------------- |
|                              |                    |                    | **Editable**, default:              |
| Rasio linen<br><br>Infeksius | **rasioInfeksius** | % (0–<br><br>1 00) | 70\. Harus<br><br>otomatis = 1 00 − |
|                              |                    |                    | rasioNonInfeksius                   |

**Validasi UI:** harus

**rasioNonInfeksius + rasioInfeksius**

selalu = 1 00%. Sarankan slider tunggal (geser satu, yang lain otomatis menyesuaikan) daripada dua ﬁeld input terpisah, untuk mencegah input yang tidak valid.

### 1 .2 Data Produk — Sisi PROTEK (Fixed)

Diambil dari data referensi ( **cost_chamical.xlsx** ), **tidak diinput ulang oleh user**, hanya ditampilkan sebagai basis perhitungan:

| **No** | **Produk**           | **Harga/Galon**<br><br>**25L (Rp)** | **Harga/Liter**<br><br>**(Rp)** | **Dosis Non-Infeksius (ml/kg)** | **Dosis Infeksius (ml/kg)** |
| ------ | -------------------- | ----------------------------------- | ------------------------------- | ------------------------------- | --------------------------- |
| 1      | Avanger<br><br>L     | 1 .305.234                          | 52.209,36                       | 1                               | 5                           |
| 2      | Launtex<br><br>L     | 1 .305.234                          | 52.209,36                       | 1                               | 5                           |
| 3      | Protek Oxygen Active | 1 .283.028                          | 51 .321 ,1 2                    | 2                               | 6                           |
| 4      | Protek Fabric Soft   | 1 .305.234                          | 52.209,36                       | 6                               | 6                           |
| 5      | Sentry L             | 1 .238.293                          | 49.531 ,72                      | 1                               | 2                           |

| **No** | **Produk** | **Harga/Galon**<br><br>**25L (Rp)** | **Harga/Liter**<br><br>**(Rp)** | **Dosis Non-Infeksius (ml/kg)** | **Dosis Infeksius (ml/kg)** |
| ------ | ---------- | ----------------------------------- | ------------------------------- | ------------------------------- | --------------------------- |
| 6      | Action     | 1 .579.786                          | 63.1 91 ,44                     | 1                               | 2                           |

**Catatan:** Harga/Liter = Harga/Galon ÷ 25. Dosis di atas adalah nilai **ﬁx**, hard-coded di sistem sebagai default database produk Protek. Jika ASA mengubah harga jual sewaktu-waktu, cukup

update ﬁeld di database — dosis tidak berubah.

**hargaPerGalon**

### 1 .3 Data Produk — Sisi Kompetitor (Input Bebas RS)

Untuk **setiap** chemical yang ingin dibandingkan (RS boleh input 1 –6 produk kompetitor, mengikuti kategori fungsi produk Protek di atas):

| **Variabel**                   | **Kode**                        | **Tipe**                                     |
| ------------------------------ | ------------------------------- | -------------------------------------------- |
| Nama produk<br><br>kompetitor  | **namaProdukKompetitor**        | text                                         |
| Harga per<br><br>galon/kemasan | **hargaKompetitor**             | number<br><br>(Rp)                           |
| Volume<br><br>kemasan          | **volumeKemasanKompetitor**     | number (liter) — default 25,<br><br>editable |
| Dosis Non-<br><br>Infeksius    | **dosisNonInfeksiusKompetitor** | number<br><br>(ml/kg)                        |
| Dosis Infeksius                | **dosisInfeksiusKompetitor**    | number<br><br>(ml/kg)                        |

## Formula Perhitungan (Berlaku Sama untuk Kedua Sisi)

Jalankan formula berikut dua kali secara paralel: sekali dengan data Protek (ﬁxed), sekali dengan data kompetitor (input RS). Hasilnya dijejerkan untuk dibandingkan.

### Harga per Liter

**hargaPerLiter = hargaPerGalon / volumeKemasan**

_(Untuk Protek, volumeKemasan = 25L tetap)_

### Cost per Load (per jenis linen)

**costPerLoadNonInfeksius = (dosisNonInfeksius × kapasitasMesin / 1000) × hargaPerLiter**

**costPerLoadInfeksius = (dosisInfeksius × kapasitasMesin / 1000) × hargaPerLiter**

_(dosis dalam ml, dibagi 1000 untuk konversi ke liter)_

### Cost per Kg (per jenis linen)

**costPerKgNonInfeksius = costPerLoadNonInfeksius / kapasitasMesin**

**costPerKgInfeksius = costPerLoadInfeksius / kapasitasMesin**

### Volume Linen per Bulan (berdasarkan rasio input RS)

**totalLinenBulanan = beratLinenHarian × hariOperasional volumeNonInfeksius = totalLinenBulanan ×**

**(rasioNonInfeksius / 100)**

**volumeInfeksius = totalLinenBulanan × (rasioInfeksius / 100)**

### Total Biaya Chemical per Bulan (per produk)

**biayaNonInfeksiusBulanan = costPerKgNonInfeksius × volumeNonInfeksius**

**biayaInfeksiusBulanan = costPerKgInfeksius × volumeInfeksius**

**totalBiayaProdukBulanan = biayaNonInfeksiusBulanan +**

**biayaInfeksiusBulanan**

### Total Biaya Seluruh Produk (akumulasi 6 kategori chemical)

**totalBiayaChemicalBulanan = Σ totalBiayaProdukBulanan (untuk semua produk dalam kategori yang dipakai)**

Hitung juga breakdown periode lain untuk ditampilkan di tabel ringkasan (sesuai pola brosur: Hari / Minggu / Bulan / Tahun):

**biayaHarian = totalBiayaChemicalBulanan / hariOperasional**

**biayaMingguan = biayaHarian × 7**

**biayaTahunan = totalBiayaChemicalBulanan × 12**

## Perbandingan & Output

### Selisih dan Persentase Hemat

Dihitung dengan Protek sebagai pembanding terhadap kompetitor:

**selisihRp = totalBiayaKompetitor − totalBiayaProtek**

**persenHemat = (selisihRp / totalBiayaKompetitor) × 100**

Jika negatif, artinya Protek lebih mahal dari

**selisihRp**

kompetitor untuk skenario input tersebut — tampilkan apa adanya, jangan disembunyikan (menjaga kredibilitas kalkulator sebagai alat yang transparan, bukan alat jualan yang bias).

### Struktur Output yang Ditampilkan ke User

- - 1. **Tabel ringkasan periode** — Hari / Minggu / Bulan / Tahun, kolom: Protek (Rp) | Kompetitor (Rp) | Selisih (Rp) | Hemat (%) 2. **Graﬁk bar chart** — perbandingan biaya bulanan Protek vs kompetitor 3. **Card highlight** — total hemat per tahun + persentase, sebagai angka "hook" utama 4. **Breakdown per produk (opsional/expand)** — rincian cost per kg per kategori chemical, untuk user yang ingin transparansi detail

## Struktur Data (Rekomendasi Skema untuk Developer)

**{**

**"inputRS": {**

**"beratLinenHarian": 600,**

**"hariOperasional": 30,**

**"kapasitasMesin": 35,**

**"rasioNonInfeksius": 30,**

**"rasioInfeksius": 70**

**},**

**"produkProtek": \[**

**{**

**"id": "avanger-l",**

**"nama": "Avanger L",**

**"hargaPerGalon": 1305234,**

**"volumeKemasan": 25,**

**"dosisNonInfeksius": 1,**

**"dosisInfeksius": 5**

**}**

**\],**

**"produkKompetitor": \[**

**{**

**"id": "kompetitor-1",**

**"kategoriPembanding": "avanger-l", "nama": "",**

**"hargaPerGalon": 0,**

**"volumeKemasan": 25,**

**"dosisNonInfeksius": 0,**

**"dosisInfeksius": 0**

**}**

**\]**

**}**

_(_ **_kategoriPembanding_** _menautkan produk kompetitor ke kategori fungsi Protek yang sepadan, misal Avanger L dibandingkan dengan alkali builder kompetitor)_

## Catatan Implementasi untuk Tim Dev

- Data produk Protek (harga, dosis) sebaiknya disimpan di satu ﬁle/tabel konﬁgurasi terpisah ( **produkProtekConfig** ), bukan hard-code di komponen kalkulator, supaya mudah diupdate ASA saat harga berubah tanpa perlu deploy ulang kode kalkulasi.
- Field kompetitor harus mendukung minimal 1 produk terisi untuk kalkulator tetap bisa jalan (tidak wajib isi keenam kategori) — beri opsi "Saya hanya pakai 2 jenis chemical" dsb.
- Semua hasil perhitungan sebaiknya real-time (update otomatis saat user mengubah input), sesuai kesan "smart calculator" yang jadi hook di halaman eﬁsiensi RS.
- Rasio infeksius:non-infeksius pakai slider dengan default 30:70 sudah ter-highlight sebagai "rata-rata umum RS" — beri tooltip

kecil menjelaskan ini bisa disesuaikan.