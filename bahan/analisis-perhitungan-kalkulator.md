# Analisis Perhitungan Kalkulator Perbandingan Produk Laundry

**Tanggal:** 17 September 2026  
**Website:** PROTEK Laundry Solution (CV. Anugerah Sejahtera Abadi)

---

## 📌 Ringkasan Eksekutif

Kalkulator perbandingan produk laundry di website saat ini menggunakan **kombinasi antara perhitungan real (berbasis data input user) dan asumsi marketing (berbasis nilai tetap)**. Dokumen ini menjelaskan mana yang sudah valid dan mana yang perlu data riil untuk meningkatkan kredibilitas.

---

## 🎯 Tujuan Kalkulator

Memberikan perbandingan objektif antara:
- **PROTEK Laundry Solution** (produk dari CV. ASA)
- **Produk Laundry Lain** (kompetitor yang di-input oleh user)

Perbandingan ditampilkan dalam:
1. **Radar Chart** (5 aspek penilaian)
2. **Tabel Detail** (breakdown biaya dan kualitas)

---

## 📊 Komponen Kalkulator

### **A. INPUT DARI USER**
Data yang dimasukkan oleh rumah sakit/user:

| Data | Contoh | Digunakan Untuk |
|------|--------|-----------------|
| Nama Rumah Sakit | RS Hermina | Identifikasi |
| Berat Linen Kotor | 500 kg/hari | Hitung biaya harian |
| Jenis Linen | Infeksius / Non-Infeksius | Tentukan dosis yang dipakai |
| Dosis Produk Pembanding | 1.2 ml/kg (user input) | Hitung biaya kompetitor |
| Harga Produk Pembanding | Rp 1.700.000 / 25L | Hitung biaya kompetitor |

**Status:** ✅ **VALID** - Semua data real dari input user

---

### **B. RADAR CHART - 5 ASPEK PENILAIAN**

Chart radar menampilkan 5 aspek dengan skor 0-100%:

#### **1. Efektivitas Pembersihan**

**Cara Hitung Saat Ini (HARDCODE):**
```
Score = 1 - (avgDosis - 2ml/kg) / 3
```

**Logika:**
- Asumsi: Semakin rendah dosis, semakin efektif
- Jika rata-rata dosis = 2 ml/kg → Score = 100%
- Jika rata-rata dosis = 5 ml/kg → Score = 0%

**Status:** ⚠️ **TIDAK VALID**

**Masalah:**
- Efektivitas pembersihan tidak otomatis tinggi hanya karena dosis rendah
- Dosis rendah bisa jadi kurang efektif jika konsentrasi bahan aktif rendah
- Tidak ada bukti lab test atau standar industri

**Untuk Validitas Real, Butuh Data:**
- ✅ Lab test hasil pencucian (whiteness index, soil removal percentage)
- ✅ Standar industri atau benchmark (misal: ASTM, ISO standard)
- ✅ Hasil uji coba di lapangan dengan berbagai jenis noda
- ✅ Perbandingan before-after pencucian dengan alat ukur objektif

---

#### **2. Kualitas Hasil Linen**

**Cara Hitung Saat Ini (HARDCODE):**
```
PROTEK: Score = 80% (nilai tetap)
Kompetitor: Score = 68% (nilai tetap)
```

**Status:** ⚠️ **TIDAK VALID**

**Masalah:**
- Angka 80% dan 68% tidak ada dasar perhitungan
- Pure marketing claim tanpa data objektif

**Untuk Validitas Real, Butuh Data:**
- ✅ Test pH balance linen setelah pencucian
- ✅ Textile damage rate (kerusakan serat per 100x pencucian)
- ✅ Color retention test (ketahanan warna)
- ✅ Softness rating (tingkat kelembutan)
- ✅ Bacterial count setelah pencucian (CFU/cm²)

---

#### **3. Efisiensi Dosis**

**Cara Hitung Saat Ini (HARDCODE):**
```
Score = 1 - (avgDosis - 1.5ml/kg) / 4
```

**Logika:**
- Asumsi: Semakin rendah dosis, semakin efisien
- Jika rata-rata dosis = 1.5 ml/kg → Score = 100%
- Jika rata-rata dosis = 5.5 ml/kg → Score = 0%

**Status:** ⚠️ **TIDAK VALID**

**Masalah:**
- Hampir duplikat dengan "Efektivitas Pembersihan" (sama-sama ukur dosis)
- Efisiensi seharusnya = hasil per unit cost, bukan cuma dosis

**Untuk Validitas Real, Butuh Data:**
- ✅ Cost per Clean Load (biaya per kg linen yang bersih sempurna)
- ✅ Hasil pencucian per ml produk (cleaning power per unit)
- ✅ Perbandingan: (Hasil Pencucian / Biaya) antara PROTEK vs Kompetitor

---

#### **4. Biaya per Kg Linen**

**Cara Hitung Saat Ini (PERHITUNGAN REAL):**
```
avgCostPerKg = (dosis/1000) × hargaPerLiter

Contoh:
- Dosis: 2 ml/kg
- Harga: Rp 52.209/liter
- Cost = (2/1000) × 52.209 = Rp 104,42/kg

Score = 1 - (avgCostPerKg - 500) / 1000
```

**Status:** ✅ **VALID**

**Data Real:**
- Dosis dari input user atau produk PROTEK
- Harga dari data produk atau input user
- Perhitungan matematis akurat

**Skor Chart:**
- Baseline: Rp 500/kg (target cost ideal)
- Jika cost = Rp 500 → Score = 100%
- Jika cost = Rp 1.500 → Score = 0%

---

#### **5. Dukungan PPI (Prevention and Control of Infection)**

**Cara Hitung Saat Ini (HARDCODE):**
```
PROTEK:
- Infeksius: Score = 90%
- Non-Infeksius: Score = 62%

Kompetitor: Score = 40% (semua jenis)
```

**Status:** ⚠️ **TIDAK VALID**

**Masalah:**
- Angka 90%, 62%, 40% tidak ada dasar perhitungan
- PPI compliance seharusnya berdasarkan sertifikasi atau checklist standar
- Kenapa Non-Infeksius lebih rendah (62%)? Tidak ada penjelasan

**Untuk Validitas Real, Butuh Data:**
- ✅ Sertifikasi dari Kemenkes atau lembaga kesehatan
- ✅ Compliance checklist PPI (misal: 10 kriteria, berapa yang terpenuhi?)
- ✅ Lab test bacterial reduction rate (harus >99.9% untuk infeksius)
- ✅ Approval dari PERSI (Perhimpunan Rumah Sakit Seluruh Indonesia)
- ✅ Dokumentasi SDS (Safety Data Sheet) yang lengkap

---

### **C. TABEL PERBANDINGAN DETAIL**

Tabel menampilkan 9 aspek perbandingan:

| Aspek | Cara Hitung | Status |
|-------|-------------|--------|
| **1. Dosis Pemakaian** | Rata-rata dari semua produk | ✅ VALID (dari input) |
| **2. Biaya per kg Infeksius** | (dosisInfeksius/1000) × hargaPerLiter | ✅ VALID (perhitungan real) |
| **3. Biaya per kg Non-Infeksius** | (dosisNonInfeksius/1000) × hargaPerLiter | ✅ VALID (perhitungan real) |
| **4. Biaya per Hari** | avgCostPerKg × beratLinenHarian | ✅ VALID (perhitungan real) |
| **5. Biaya per Bulan** | biayaHarian × 30 hari | ✅ VALID (perhitungan real) |
| **6. Biaya per Tahun** | biayaBulanan × 12 | ✅ VALID (perhitungan real) |
| **7. Hasil Pencucian** | Text tetap: "Bersih optimal vs Cukup bersih" | ⚠️ TIDAK VALID (marketing text) |
| **8. Efisiensi Operasional** | Text tetap: "Lebih hemat vs Standar" | ⚠️ TIDAK VALID (marketing text) |
| **9. Dukungan PPI** | Text tetap: "Ya vs Terbatas" | ⚠️ TIDAK VALID (marketing text) |

---

#### **Detail: Efisiensi Operasional**

**Text Saat Ini:**
- PROTEK: "Lebih hemat, produktivitas meningkat"
- Kompetitor: "Standar"
- Selisih: "Lebih efisien (waktu & biaya)"

**Status:** ⚠️ **TIDAK VALID**

**Masalah:**
- Pure marketing text tanpa perhitungan sama sekali
- Tidak ada data objektif tentang waktu atau produktivitas

**Untuk Validitas Real, Butuh Data:**
- ✅ Waktu pencucian per load (menit)
- ✅ Jumlah load yang bisa diselesaikan per hari
- ✅ Downtime mesin (frekuensi maintenance)
- ✅ Produktivitas staff (kg linen per jam kerja)
- ✅ Energy consumption (listrik per kg linen)
- ✅ Water usage (liter air per kg linen)

---

## ✅ SUMMARY: YANG VALID vs TIDAK VALID

### **YANG SUDAH VALID (Berbasis Data Real):**

✅ **1. Semua Perhitungan Biaya**
- Biaya per kg Linen (Infeksius & Non-Infeksius)
- Biaya per Hari
- Biaya per Bulan
- Biaya per Tahun
- **Sumber data:** Input user (berat linen, dosis, harga)
- **Perhitungan:** Matematis akurat

✅ **2. Dosis Pemakaian**
- **Sumber data:** Input langsung dari user atau database produk PROTEK
- **Perhitungan:** Rata-rata dari semua chemical yang dipakai

✅ **3. Harga per Kemasan & Rp per ml**
- **Sumber data:** Database produk PROTEK atau input user
- **Perhitungan:** hargaPerKemasan / (volumeKemasan × 1000)

---

### **YANG TIDAK VALID (Berbasis Asumsi/Marketing):**

⚠️ **1. Efektivitas Pembersihan**
- Hardcode berdasarkan asumsi "dosis rendah = efektif"
- **Butuh:** Lab test soil removal percentage

⚠️ **2. Kualitas Hasil Linen**
- Hardcode nilai tetap 80% (PROTEK) vs 68% (kompetitor)
- **Butuh:** Test lab pH, textile damage, color retention

⚠️ **3. Efisiensi Dosis**
- Duplikat logic dengan Efektivitas
- **Butuh:** Cost per clean load atau hasil per rupiah

⚠️ **4. Dukungan PPI**
- Hardcode nilai tetap 90%/62% (PROTEK) vs 40% (kompetitor)
- **Butuh:** Sertifikasi Kemenkes, compliance checklist

⚠️ **5. Hasil Pencucian (Text)**
- Pure marketing claim
- **Butuh:** Before-after test dengan alat ukur objektif

⚠️ **6. Efisiensi Operasional (Text)**
- Pure marketing claim
- **Butuh:** Data waktu, produktivitas, energy & water usage

---

## 🎯 REKOMENDASI

### **Option 1: Tetap sebagai Marketing Tool (Current)**

**Kelebihan:**
- ✅ Mudah digunakan user
- ✅ Visual menarik (radar chart)
- ✅ Soft selling approach

**Kekurangan:**
- ⚠️ Tidak bisa dipakai untuk tender formal
- ⚠️ Kredibilitas dipertanyakan jika diperiksa detail
- ⚠️ Vulnerable terhadap komplain "data tidak valid"

**Action Required:**
Tambahkan disclaimer di halaman kalkulator:

> *"Hasil perbandingan ini adalah **estimasi berdasarkan data umum pasar** dan dapat berbeda sesuai kondisi aktual operasional. Untuk analisis mendalam, silakan hubungi tim kami untuk konsultasi gratis."*

---

### **Option 2: Upgrade ke Data-Driven Tool (Recommended)**

**Langkah-langkah:**

**1. Lakukan Lab Test untuk PROTEK Products (1-2 bulan)**
- Whiteness index test
- Soil removal percentage test
- Textile damage test (100x pencucian)
- Color retention test
- Bacterial reduction test
- pH balance test

**2. Dapatkan Sertifikasi PPI (3-6 bulan)**
- Audit compliance dari Kemenkes atau PERSI
- Dokumentasi SDS lengkap
- Approval untuk linen infeksius

**3. Field Test di Rumah Sakit Partner (2-3 bulan)**
- Ukur waktu pencucian real
- Ukur produktivitas staff
- Ukur energy & water consumption
- Compare dengan produk kompetitor

**4. Update Perhitungan di Website (1 minggu)**
- Replace hardcode values dengan data riil
- Tambahkan badge "Based on Lab Test Results"
- Link ke certificate/report

**Benefit:**
- ✅ Kredibilitas tinggi untuk tender & B2B sales
- ✅ Bisa dipakai sebagai sales ammunition
- ✅ Competitive advantage jelas
- ✅ Tahan audit/review dari calon customer

---

## 📋 DATA YANG DIBUTUHKAN UNTUK VALIDITAS PENUH

### **A. Lab Test & Certification**

| Data | Tujuan | Estimasi Biaya | Timeline |
|------|--------|----------------|----------|
| Whiteness Index Test | Ukur tingkat kebersihan linen | Rp 5-10 juta | 2 minggu |
| Soil Removal Test | Ukur efektivitas pembersihan noda | Rp 5-10 juta | 2 minggu |
| Textile Damage Test | Ukur kerusakan serat linen | Rp 10-15 juta | 1 bulan |
| Color Retention Test | Ukur ketahanan warna | Rp 5-10 juta | 2 minggu |
| Bacterial Reduction Test | Ukur reduksi bakteri (untuk PPI) | Rp 10-20 juta | 3 minggu |
| pH Balance Test | Ukur pH linen setelah pencucian | Rp 3-5 juta | 1 minggu |
| Sertifikasi PPI (Kemenkes/PERSI) | Compliance approval | Rp 20-50 juta | 3-6 bulan |

**Total Estimasi:** Rp 58-120 juta  
**Timeline Total:** 3-6 bulan

---

### **B. Field Test Data (di RS Partner)**

| Data | Cara Ukur | Timeline |
|------|-----------|----------|
| Waktu pencucian per load | Timer manual/mesin | 1 bulan |
| Jumlah load per hari | Log harian | 1 bulan |
| Produktivitas staff | Kg linen / jam kerja | 1 bulan |
| Energy consumption | Meter listrik | 1 bulan |
| Water usage | Meter air | 1 bulan |
| Downtime mesin | Log maintenance | 2-3 bulan |

**Biaya:** Minimal (cuma monitoring)  
**Timeline:** 2-3 bulan  
**Butuh:** Partnership dengan 1-2 RS yang willing untuk trial

---

### **C. Competitive Benchmark**

| Data | Cara Dapat | Timeline |
|------|-----------|----------|
| Harga kompetitor | Market survey | 2 minggu |
| Dosis kompetitor | Datasheet produk | 1 minggu |
| Performance kompetitor | Field test comparison | 2-3 bulan |

---

## 💡 KESIMPULAN

**Status Kalkulator Saat Ini:**
- ✅ **50% Valid** (perhitungan biaya sudah akurat)
- ⚠️ **50% Marketing** (kualitas, efektivitas, PPI masih asumsi)

**Rekomendasi:**
1. **Short Term (1 minggu):** Tambahkan disclaimer untuk transparansi
2. **Long Term (6 bulan):** Lakukan lab test & field test untuk upgrade ke fully data-driven tool

**ROI untuk Option 2:**
- Investment: Rp 60-120 juta + 6 bulan
- Benefit: Kredibilitas tinggi, bisa dipakai untuk tender formal, competitive advantage jelas
- Target: B2B sales (rumah sakit) yang butuh data objektif untuk procurement decision

---

**Dibuat oleh:** OpenCode AI  
**Untuk:** CV. Anugerah Sejahtera Abadi (PROTEK Laundry Solution)  
**Tanggal:** 17 September 2026
