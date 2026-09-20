# Penjelasan Perhitungan Chart Radar - Kalkulator PROTEK

**Dibuat:** 20 September 2026  
**Tujuan:** Menjelaskan secara transparan bagaimana kelima aspek di chart radar dihitung berdasarkan data yang Anda masukkan.

---

## Mengapa Kami Menggunakan Chart Radar?

Chart radar (spider chart) memudahkan Anda untuk **melihat perbandingan 5 aspek penting** dalam satu visualisasi. Anda bisa langsung melihat:

- Aspek mana yang lebih unggul dari PROTEK
- Aspek mana yang lebih unggul dari produk yang Anda gunakan saat ini
- Apakah perbedaannya signifikan atau hanya sedikit

Semua perhitungan **100% berdasarkan data yang Anda input**, bukan angka marketing yang dibuat-buat.

---

## 5 Aspek yang Dibandingkan

### 1. Efektivitas Pembersihan

**Apa yang diukur:**  
Seberapa efektif produk dalam membersihkan linen, diukur dari **reject rate** (persentase linen yang masih kotor setelah pencucian dan harus dicuci ulang).

**Data yang dipakai:**
- Reject rate PROTEK: 0% (asumsi ideal, bisa diisi dari data operasional Anda)
- Reject rate produk lain: Anda input sendiri saat menambahkan produk pembanding

**Cara hitung:**
```
Skor = 1 - (reject rate ÷ 10)

Contoh:
- Reject rate 0% → Skor = 1 - (0 ÷ 10) = 1.0 = 100%
- Reject rate 2% → Skor = 1 - (2 ÷ 10) = 0.8 = 80%
- Reject rate 5% → Skor = 1 - (5 ÷ 10) = 0.5 = 50%
```

**Kenapa pakai reject rate?**
- Reject rate adalah **indikator operasional nyata** yang bisa dicatat rumah sakit
- Semakin tinggi reject rate = semakin banyak linen yang harus dicuci ulang
- Semakin banyak cuci ulang = chemical tidak efektif membersihkan

**Catatan penting:**
- Reject rate hanya valid jika berasal dari pencatatan linen yang benar-benar dicuci ulang
- Standar industri: **≤ 2% dianggap efektif**
- Jika tidak ada data reject rate, bisa dikosongkan (default 0%)

---

### 2. Konsumsi Chemical

**Apa yang diukur:**  
Berapa banyak produk chemical yang terpakai untuk mencuci linen Anda per hari.

**Data yang dipakai:**
- Dosis rata-rata ml/kg dari semua produk yang dipakai
- Berat linen kotor per hari (kg)

**Cara hitung:**
```
Konsumsi per hari = (dosis rata-rata × berat linen per hari) ÷ 1.000

Contoh:
- Dosis rata-rata PROTEK: 3,4 ml/kg
- Berat linen: 500 kg/hari
- Konsumsi = (3,4 × 500) ÷ 1.000 = 1,7 liter/hari

Skor di chart:
Skor relatif antara PROTEK vs Produk Lain
- Produk dengan dosis lebih rendah = skor lebih tinggi
```

**Kenapa pakai konsumsi chemical?**
- Data dosis sudah pasti ada di datasheet produk
- Volume linen Anda sudah tahu pasti
- Konsumsi lebih rendah = lebih hemat stok chemical
- Bisa langsung dihitung berapa liter chemical yang dibutuhkan per hari/bulan

**Yang perlu diperhatikan:**
- Dosis rendah **bukan otomatis lebih bagus**, harus tetap efektif membersihkan
- Dosis yang dipakai harus sesuai rekomendasi dari datasheet atau SOP rumah sakit
- Jangan turunkan dosis hanya untuk hemat jika hasilnya linen tidak bersih

---

### 3. Efisiensi Dosis

**Apa yang diukur:**  
Seberapa efisien produk dalam pemakaian dosis per kg linen.

**Data yang dipakai:**
- Dosis rata-rata ml/kg dari semua produk

**Cara hitung:**
```
Skor = 1 - ((dosis - 1,5) ÷ 4)

Contoh:
- Dosis 1,5 ml/kg → Skor = 1 - ((1,5 - 1,5) ÷ 4) = 1.0 = 100%
- Dosis 3,5 ml/kg → Skor = 1 - ((3,5 - 1,5) ÷ 4) = 0.5 = 50%
- Dosis 5,5 ml/kg → Skor = 1 - ((5,5 - 1,5) ÷ 4) = 0.0 = 0%
```

**Kenapa pakai formula ini?**
- **1,5 ml/kg** adalah baseline dosis rendah yang ideal (berdasarkan data produk di industri)
- **5,5 ml/kg** adalah dosis tinggi (batas atas)
- Semakin rendah dosis yang dibutuhkan = semakin efisien produk

**Bedanya dengan Konsumsi Chemical:**
- **Konsumsi Chemical:** Berapa liter yang terpakai (dipengaruhi juga oleh volume linen)
- **Efisiensi Dosis:** Berapa ml per kg linen (murni efisiensi produk, tidak dipengaruhi volume linen)

---

### 4. Efisiensi Biaya

**Apa yang diukur:**  
Berapa biaya chemical yang dikeluarkan untuk mencuci 1 kg linen (campuran infeksius dan non-infeksius sesuai rasio Anda).

**Data yang dipakai:**
- Dosis infeksius dan non-infeksius (ml/kg)
- Harga produk per liter (dihitung dari harga kemasan ÷ volume kemasan)
- Rasio linen infeksius vs non-infeksius

**Cara hitung:**
```
Biaya per kg = (dosis ÷ 1.000) × harga per liter

Contoh:
- Dosis weighted average: 3,4 ml/kg
- Harga: Rp 52.209/liter
- Biaya per kg = (3,4 ÷ 1.000) × 52.209 = Rp 177,5/kg

Skor di chart:
Skor = 1 - ((biaya per kg - 500) ÷ 1.500)

Jika biaya per kg = Rp 500 → Skor = 100%
Jika biaya per kg = Rp 2.000 → Skor = 0%
```

**Kenapa pakai biaya per kg?**
- Biaya per kg adalah **metrik paling relevan** untuk rumah sakit
- Anda bisa langsung hitung: total linen × biaya per kg = biaya operasional
- Mempertimbangkan **harga produk dan dosis sekaligus**
- Produk murah tapi dosis tinggi bisa jadi lebih mahal dibanding produk mahal tapi dosis rendah

**Weighted average dosis:**
```
Dosis weighted = (dosis infeksius × rasio infeksius) + (dosis non-infeksius × rasio non-infeksius)

Contoh:
- Rasio linen: 70% infeksius, 30% non-infeksius
- Dosis infeksius: 5 ml/kg
- Dosis non-infeksius: 1 ml/kg
- Dosis weighted = (5 × 70%) + (1 × 30%) = 3,5 + 0,3 = 3,8 ml/kg
```

---

### 5. Biaya Linen Infeksius

**Apa yang diukur:**  
Berapa biaya khusus untuk mencuci linen infeksius (linen yang terkontaminasi).

**Data yang dipakai:**
- Dosis infeksius (ml/kg) dari datasheet produk
- Harga produk per liter

**Cara hitung:**
```
Biaya linen infeksius = (dosis infeksius ÷ 1.000) × harga per liter

Contoh:
- Dosis infeksius: 5 ml/kg
- Harga: Rp 52.209/liter
- Biaya = (5 ÷ 1.000) × 52.209 = Rp 261/kg

Skor di chart (relatif):
Skor PROTEK = biaya produk lain ÷ (biaya PROTEK + biaya produk lain)
Skor produk lain = biaya PROTEK ÷ (biaya PROTEK + biaya produk lain)

Contoh:
- Biaya PROTEK: Rp 228/kg
- Biaya produk lain: Rp 408/kg
- Skor PROTEK = 408 ÷ (228 + 408) = 64,2%
- Skor produk lain = 228 ÷ (228 + 408) = 35,8%
```

**Kenapa fokus ke linen infeksius?**
- Linen infeksius **membutuhkan biaya lebih tinggi** karena dosis lebih besar
- Linen infeksius **lebih kritis** untuk keamanan pasien dan staf
- Rumah sakit perlu tahu **berapa biaya khusus** untuk linen yang terkontaminasi
- Berbeda dengan "Efisiensi Biaya" yang menghitung rata-rata campuran infeksius dan non-infeksius

**Linen infeksius vs non-infeksius:**
| Jenis Linen | Sumber | Dosis Chemical | Biaya |
|-------------|--------|----------------|-------|
| **Infeksius** | Ruang isolasi, ICU, OK, pasien menular | Tinggi (5-7 ml/kg) | Tinggi |
| **Non-Infeksius** | Rawat inap biasa, poliklinik | Rendah (1-2 ml/kg) | Rendah |

---

## Kenapa Tidak Ada Aspek "Kualitas Hasil Linen" atau "Keamanan & Sanitasi"?

**Pertanyaan yang sering muncul:**  
"Kenapa tidak ada aspek kualitas atau keamanan di chart?"

**Jawaban jujur kami:**

### Kualitas Hasil Linen
Untuk mengukur kualitas hasil linen secara objektif, butuh data dari laboratorium:
- **Whiteness index** (tingkat putih linen)
- **Soil removal percentage** (% noda yang hilang)
- **Textile damage rate** (kerusakan serat per 100x cuci)
- **Color retention** (ketahanan warna)
- **pH balance** linen setelah dicuci

Tanpa data lab test ini, angka kualitas akan **hanya klaim marketing**, bukan perbandingan objektif.

### Keamanan & Sanitasi
Untuk mengukur keamanan secara valid, butuh data:
- **Hasil uji mikrobiologi** (jumlah bakteri setelah dicuci)
- **Bacterial reduction rate** (% penurunan bakteri)
- **Sertifikasi PPI** dari Kemenkes atau PERSI
- **Lab test CFU/cm²** (colony-forming unit)

Tanpa data uji lab ini, angka keamanan akan **hanya asumsi**, bukan bukti ilmiah.

**Prinsip kami:**  
**Kami hanya menampilkan aspek yang bisa dihitung dari data yang Anda input.** Kami tidak ingin memberikan angka yang tidak bisa dipertanggungjawabkan.

---

## Bagaimana Skor Chart Dihitung?

### Metode 1: Formula dengan Baseline (untuk aspek yang bisa diukur objektif)

Dipakai untuk:
- Efektivitas Pembersihan
- Efisiensi Dosis
- Efisiensi Biaya

```
Skor = 1 - ((nilai aktual - nilai ideal) ÷ range)
```

**Contoh: Efektivitas Pembersihan**
```
Skor = 1 - (reject rate ÷ 10)

- Reject rate 0% → Skor = 100% (ideal)
- Reject rate 10% → Skor = 0% (sangat buruk)
```

### Metode 2: Skor Relatif (untuk aspek yang tidak punya standar mutlak)

Dipakai untuk:
- Konsumsi Chemical
- Biaya Linen Infeksius

```
Skor A = nilai B ÷ (nilai A + nilai B)
Skor B = nilai A ÷ (nilai A + nilai B)
```

**Kenapa pakai relatif?**
- Tidak ada standar industri universal untuk "konsumsi ideal"
- Tidak ada baseline mutlak untuk "biaya linen infeksius ideal"
- Yang penting adalah **perbandingan antara PROTEK vs produk Anda**

**Contoh: Biaya Linen Infeksius**
```
PROTEK: Rp 228/kg
Produk lain: Rp 408/kg

Skor PROTEK = 408 ÷ (228 + 408) = 64,2%
Skor produk lain = 228 ÷ (228 + 408) = 35,8%

Total kedua skor = 100%
```

---

## Validitas Data & Rekomendasi

### Data yang SUDAH VALID (bisa langsung dipercaya)

✅ **Biaya per kg** - Perhitungan matematis dari dosis × harga  
✅ **Konsumsi chemical** - Perhitungan matematis dari dosis × volume linen  
✅ **Efisiensi dosis** - Berdasarkan dosis yang tertera di datasheet produk  

### Data yang PERLU VERIFIKASI (tergantung input Anda)

⚠️ **Reject rate** - Hanya valid jika rumah sakit mencatat linen yang benar-benar dicuci ulang  
⚠️ **Dosis produk pembanding** - Hanya valid jika Anda input sesuai datasheet produk atau SOP rumah sakit yang sebenarnya  
⚠️ **Harga produk pembanding** - Hanya valid jika Anda input harga yang benar-benar Anda bayar  

### Rekomendasi untuk Hasil yang Akurat

1. **Catat reject rate selama 1 bulan**  
   - Hitung berapa kg linen yang harus dicuci ulang per hari
   - Bagi dengan total linen yang dicuci
   - Input angka real, bukan perkiraan

2. **Gunakan datasheet produk**  
   - Lihat rekomendasi dosis di label kemasan
   - Jangan tebak-tebak dosis
   - Jika tidak ada datasheet, tanya supplier Anda

3. **Cek invoice pembelian**  
   - Harga yang Anda input harus sesuai harga yang Anda bayar
   - Jangan pakai harga katalog, pakai harga setelah diskon/nego

4. **Update data secara berkala**  
   - Harga bisa berubah
   - Dosis bisa disesuaikan
   - Reject rate bisa berubah seiring waktu

---

## Kesimpulan: Mengapa Formula Ini yang Terbaik?

### 1. Berdasarkan Data Real, Bukan Klaim Marketing
Semua perhitungan menggunakan data yang **Anda input sendiri** atau **sudah pasti ada** (harga, dosis, volume). Tidak ada angka yang dibuat-buat.

### 2. Transparan & Bisa Diverifikasi
Anda bisa hitung ulang sendiri dengan kalkulator. Tidak ada formula rahasia atau angka tersembunyi.

### 3. Relevan untuk Operasional Rumah Sakit
Aspek yang kami pilih adalah aspek yang **benar-benar penting** untuk keputusan procurement:
- Berapa biaya per kg linen?
- Berapa konsumsi chemical per hari?
- Berapa reject rate produk?
- Berapa biaya khusus untuk linen infeksius?

### 4. Jujur tentang Keterbatasan
Kami **tidak menampilkan** aspek yang membutuhkan data lab test (kualitas, keamanan) karena tanpa data lab, angkanya hanya marketing claim.

### 5. Mudah Dipahami
Formula yang kami pakai adalah **matematika dasar** yang bisa dipahami siapa saja:
- Pembagian
- Perkalian
- Pengurangan
- Persentase

Tidak ada algoritma kompleks atau AI yang tidak bisa dijelaskan.

---

## Pertanyaan yang Sering Diajukan (FAQ)

**Q: Kenapa baseline Efisiensi Biaya pakai Rp 500/kg?**  
A: Rp 500/kg adalah **target biaya ideal** berdasarkan data produk PROTEK di industri. Bukan angka mutlak, tapi sebagai referensi skor 100%.

**Q: Apakah reject rate 0% realistis?**  
A: Reject rate 0% adalah **target ideal**. Di praktik, reject rate ≤ 2% sudah dianggap sangat baik. Anda bisa input reject rate PROTEK dari data operasional Anda jika ada.

**Q: Kenapa Konsumsi Chemical dan Efisiensi Dosis terpisah?**  
A: 
- **Konsumsi Chemical** = berapa liter yang terpakai (dipengaruhi volume linen Anda)
- **Efisiensi Dosis** = berapa ml per kg (murni efisiensi produk)

Dua aspek ini mengukur hal yang berbeda meski data dasarnya sama.

**Q: Apakah formula ini berlaku untuk semua rumah sakit?**  
A: Ya, formula ini universal. Yang berbeda hanya **input data Anda**: volume linen, rasio infeksius/non-infeksius, produk yang dipakai, reject rate.

**Q: Bagaimana jika saya tidak punya data reject rate?**  
A: Bisa dikosongkan (default 0%). Tapi kami sangat menyarankan untuk **mulai mencatat** reject rate karena ini indikator penting efektivitas produk.

**Q: Apakah chart ini memihak PROTEK?**  
A: Chart ini **netral**. Jika produk Anda lebih murah, dosis lebih rendah, dan reject rate lebih kecil, maka produk Anda akan mendapat skor lebih tinggi. Chart hanya menampilkan hasil perhitungan dari data yang Anda input.

---

## Dokumen Terkait

- `analisis-perhitungan-kalkulator.md` - Analisis validitas formula (untuk internal tim)
- `spesifikasi-formula-kalkulator-protek.md` - Spesifikasi teknis kalkulator (untuk developer)
- `cost chamical.csv` - Data produk PROTEK dan kompetitor

---

**Pertanyaan lebih lanjut?**  
Hubungi tim PROTEK untuk konsultasi gratis dan analisis mendalam untuk rumah sakit Anda.

---

_Dokumen ini dibuat untuk transparansi penuh kepada client. Kami percaya bahwa keputusan terbaik adalah keputusan yang berdasarkan data dan pemahaman yang jelas._
