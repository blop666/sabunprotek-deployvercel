# 🚀 PANDUAN SETUP LENGKAP - STEP BY STEP

Ikuti panduan ini dari awal sampai akhir. Dijamin berhasil! 💪

---

## 📋 LANGKAH 1: Buka Supabase Dashboard

1. Buka browser, ketik: **https://app.supabase.com**
2. Login dengan akun Supabase Anda
3. Anda akan melihat dashboard dengan list project

---

## 📋 LANGKAH 2: Pilih Project

1. Di dashboard, cari project dengan nama yang mengandung **"dgelqhspusjfzsvujmmy"**
2. Klik project tersebut untuk masuk

---

## 📋 LANGKAH 3: Jalankan SQL Schema (SETUP DATABASE)

### Cara Mudah:

1. **Di sidebar kiri**, klik icon **"SQL Editor"** (icon seperti kode `</>`)
   
2. Klik tombol **"+ New query"** (tombol hijau di kanan atas)

3. **Copy SEMUA isi file `setup_database.sql`** yang ada di folder project ini

4. **Paste** ke SQL Editor di Supabase

5. Klik tombol **"Run"** (atau tekan Ctrl+Enter)

6. Tunggu beberapa detik, akan muncul pesan:
   ```
   ✅ Database schema created successfully!
   ✅ Sample articles inserted!
   ```

**SELESAI!** Database sudah siap dipakai! ✅

---

## 📋 LANGKAH 4: Dapatkan Supabase Anon Key

### Cara Mudah:

1. **Di sidebar kiri**, klik icon **"Settings"** (icon gear/roda ⚙️)

2. Klik **"API"** di menu Settings

3. Anda akan melihat halaman dengan 2 key penting:
   - **Project URL** (sudah benar: `https://dgelqhspusjfzsvujmmy.supabase.co`)
   - **anon public** key (key panjang yang dimulai dengan `eyJ...`)

4. **COPY** key yang ada di bagian **"anon public"**
   - Klik icon copy di sebelah kanan key tersebut
   - Key akan ter-copy otomatis

5. Buka file **`.env`** di folder project Anda

6. **Paste** key tersebut di baris ini:
   ```env
   VITE_SUPABASE_ANON_KEY=PASTE_KEY_DISINI
   ```

7. **SAVE** file `.env`

**SELESAI!** Konfigurasi sudah lengkap! ✅

---

## 📋 LANGKAH 5: Install Dependencies

Buka terminal/command prompt di folder project, jalankan:

```bash
npm install
```

Tunggu sampai selesai (biasanya 1-2 menit).

---

## 📋 LANGKAH 6: Jalankan Aplikasi

Di terminal yang sama, jalankan:

```bash
npm run dev
```

Akan muncul pesan seperti:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 📋 LANGKAH 7: Buka Browser & Test

1. Buka browser (Chrome/Edge/Firefox)

2. Ketik di address bar: **http://localhost:5173**

3. Website akan terbuka! 🎉

4. **Test Blog:**
   - Klik menu **"Blog"** atau ketik `http://localhost:5173/#/blog`
   - Anda akan melihat 2 artikel sample

5. **Test Admin Dashboard:**
   - Ketik di address bar: `http://localhost:5173/#/login`
   - Login dengan:
     - **Username:** `admin`
     - **Password:** `sipotekk112233`
   - Klik **"Login"**
   - Anda akan masuk ke dashboard admin

6. **Test Create Artikel:**
   - Di dashboard, klik **"Buat Artikel"** di sidebar
   - Isi form artikel baru
   - Klik **"Publikasikan Artikel"**
   - Artikel baru akan muncul di list

---

## ❓ TROUBLESHOOTING

### Problem 1: "npm: command not found"
**Solusi:** Install Node.js dari https://nodejs.org

### Problem 2: "Cannot find module '@supabase/supabase-js'"
**Solusi:** 
```bash
npm install @supabase/supabase-js
```

### Problem 3: "Failed to fetch articles"
**Solusi:** 
1. Cek file `.env` sudah diisi dengan benar
2. Cek SQL schema sudah dijalankan di Supabase
3. Cek internet connection

### Problem 4: "Login failed"
**Solusi:** 
1. Cek username: `admin`
2. Cek password: `sipotekk112233`
3. Cek file `.env` sudah ada

---

## ✅ CHECKLIST AKHIR

Pastikan semua ini sudah dilakukan:

- [ ] Supabase project sudah dipilih
- [ ] SQL schema sudah dijalankan (file `setup_database.sql`)
- [ ] Anon key sudah di-copy dan paste ke `.env`
- [ ] `npm install` sudah dijalankan
- [ ] `npm run dev` sudah dijalankan
- [ ] Browser bisa buka `http://localhost:5173`
- [ ] Blog menampilkan artikel sample
- [ ] Login admin berhasil
- [ ] Dashboard admin bisa diakses

---

## 📞 BANTUAN LEBIH LANJUT

Jika masih ada masalah:

1. **Cek console browser** (F12 → Console tab) untuk error messages
2. **Cek terminal** untuk error messages
3. **Screenshot error** dan tanya ke developer

---

## 🎉 SELAMAT!

Jika semua checklist sudah ✅, website Anda sudah siap dipakai!

Anda bisa:
- ✅ Membuat artikel baru
- ✅ Edit artikel
- ✅ Hapus artikel
- ✅ Set featured article
- ✅ Kelola blog penuh dari dashboard

**Happy blogging! 🚀**
