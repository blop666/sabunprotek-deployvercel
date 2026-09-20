# PROTEK Laundry Solution - Full Stack Website

Website full-stack untuk PROTEK Laundry Solution dengan fitur kalkulator perbandingan biaya chemical laundry dan blog CMS.

## 🚀 Fitur Utama

### Frontend (Public)
- ✅ Landing Page dengan hero section
- ✅ Kalkulator Perbandingan Biaya Chemical Laundry
- ✅ Blog dengan featured articles, filter kategori, dan pagination
- ✅ Halaman detail artikel
- ✅ Responsive design untuk mobile dan desktop

### Admin Dashboard (Protected)
- ✅ Login authentication dengan username/password
- ✅ CRUD artikel blog (Create, Read, Update, Delete)
- ✅ Upload gambar via URL
- ✅ Rich HTML content editor
- ✅ Featured article toggle
- ✅ Kategori management

### Backend
- ✅ Supabase PostgreSQL database
- ✅ Real-time data sync
- ✅ Row Level Security (RLS)

---

## 📋 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Plain CSS (no framework)
- **Database:** Supabase PostgreSQL
- **Authentication:** Simple localStorage-based auth
- **Routing:** Hash-based routing (#/)

---

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

Dependencies yang akan terinstall:
- `react` & `react-dom`
- `vite`
- `@vitejs/plugin-react`
- `@supabase/supabase-js`

### 2. Setup Supabase Database

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project: `dgelqhspusjfzsvujmmy`
3. Buka **SQL Editor**
4. Jalankan SQL dari file `DATABASE_SETUP.md`

### 3. Setup Environment Variables

1. Copy file `.env.example` ke `.env`:
   ```bash
   copy .env.example .env
   ```

2. Dapatkan Supabase Anon Key:
   - Buka [Supabase Dashboard](https://app.supabase.com)
   - Project: `dgelqhspusjfzsvujmmy`
   - Klik **Settings** → **API**
   - Copy **anon/public key**

3. Edit file `.env` dan isi dengan credentials yang benar:
   ```env
   VITE_SUPABASE_URL=https://dgelqhspusjfzsvujmmy.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   VITE_ADMIN_USERNAME=admin
   VITE_ADMIN_PASSWORD=sipotekk112233
   ```

### 4. Run Development Server

```bash
npm run dev
```

Website akan berjalan di: `http://localhost:5173`

---

## 🔐 Login Admin

### Credentials Default:
- **URL:** `http://localhost:5173/#/login`
- **Username:** `admin` (sesuai .env)
- **Password:** `sipotekk112233` (sesuai .env)

**PENTING:** Ubah password di `.env` sebelum production!

---

## 📂 Struktur Project

```
sabunprotek/
├── public/
│   ├── assets/
│   │   ├── logo.png
│   │   ├── hero.png
│   │   ├── outro.png
│   │   └── ...
│   └── card.jpeg
├── src/
│   ├── main.jsx              # Routing utama
│   ├── style.css             # Global styles
│   ├── header.jsx            # Header component
│   ├── kalkulator.jsx        # Halaman kalkulator
│   ├── kalkulator.css
│   ├── blog.jsx              # Halaman list blog
│   ├── blog.css
│   ├── blogDetail.jsx        # Halaman detail artikel
│   ├── blogDetail.css
│   ├── login.jsx             # Halaman login admin
│   ├── login.css
│   ├── dashboard.jsx         # Dashboard admin (CRUD)
│   ├── dashboard.css
│   └── supabaseClient.js     # Supabase config
├── .env                      # Environment variables (JANGAN COMMIT!)
├── .env.example              # Template .env
├── package.json
├── DATABASE_SETUP.md         # SQL schema untuk Supabase
└── README.md
```

---

## 🗺️ Routing

| Route | Halaman | Auth Required |
|-------|---------|---------------|
| `#/` | Landing Page | No |
| `#/kalkulator` | Kalkulator | No |
| `#/blog` | List Blog | No |
| `#/blog/:slug` | Detail Artikel | No |
| `#/login` | Login Admin | No |
| `#/admin` | Dashboard Admin | **Yes** |

---

## 📊 Database Schema

### Table: `articles`

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| title | TEXT | Judul artikel |
| slug | TEXT | URL slug (unique) |
| excerpt | TEXT | Ringkasan artikel |
| content | TEXT | Konten HTML |
| category | TEXT | Kategori artikel |
| date | DATE | Tanggal publikasi |
| read_time | TEXT | Estimasi waktu baca |
| image | TEXT | URL gambar |
| featured | BOOLEAN | Featured di homepage |
| status | TEXT | published/draft |
| created_at | TIMESTAMP | Auto timestamp |
| updated_at | TIMESTAMP | Auto timestamp |

---

## 🎨 Design System

### Colors:
- **Primary Blue:** `#2C7EFB`
- **Dark Blue:** `#1e5dd9`
- **Text Dark:** `#021d46`
- **Text Medium:** `#5a6b85`
- **Text Light:** `#7a8ba5`
- **Background:** `#F8F9FD`
- **Light Blue:** `#EDF0FF`

### Font:
- **Plus Jakarta Sans** (Google Fonts)

---

## 🔧 Admin Dashboard Usage

### Buat Artikel Baru:
1. Login ke dashboard (#/login)
2. Klik **"Buat Artikel"** di sidebar
3. Isi form:
   - Judul (auto-generate slug)
   - Excerpt (ringkasan)
   - Kategori
   - Tanggal publikasi
   - URL gambar
   - Konten HTML
4. Centang "Featured" jika ingin tampil di top
5. Klik **"Publikasikan Artikel"**

### Edit Artikel:
1. Di halaman "Artikel", klik tombol **"Edit"**
2. Update field yang ingin diubah
3. Klik **"Update Artikel"**

### Hapus Artikel:
1. Di halaman "Artikel", klik tombol **"Hapus"**
2. Konfirmasi penghapusan
3. Artikel akan dihapus dari database

---

## 📝 Tips Content HTML

### Format HTML untuk konten artikel:

```html
<p>Paragraf pertama dengan <strong>teks bold</strong> dan <em>italic</em>.</p>

<h2>Heading Level 2</h2>
<p>Paragraf di bawah heading.</p>

<h3>Heading Level 3</h3>
<p>Sub section content.</p>

<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>

<blockquote>
  <p>Kutipan atau highlight text.</p>
</blockquote>
```

---

## 🚀 Deployment

### Build untuk Production:

```bash
npm run build
```

Output ada di folder `dist/`

### Deploy ke:
- **Vercel:** `vercel --prod`
- **Netlify:** Drag & drop folder `dist/`
- **GitHub Pages:** Setup GitHub Actions

**PENTING:** Pastikan environment variables sudah di-set di hosting!

---

## 🔒 Security Notes

1. **Password Admin:** Ubah password di `.env` sebelum production
2. **Supabase RLS:** Sudah enabled, public hanya bisa read published articles
3. **Environment Variables:** JANGAN commit file `.env` ke git
4. **Authentication:** Saat ini simple localStorage, untuk production gunakan Supabase Auth

---

## 📞 Support

Jika ada issue atau pertanyaan:
1. Cek file `DATABASE_SETUP.md` untuk SQL schema
2. Pastikan `.env` sudah di-setup dengan benar
3. Cek console browser untuk error messages

---

## 📄 License

Proprietary - PT. Anugerah Sejahtera Abadi (ASA) - PROTEK Laundry Solution

---

**Dibuat dengan ❤️ untuk PROTEK Laundry Solution**
