# ⚡ QUICK REFERENCE - CHEAT SHEET

## 🔗 URLs Penting

| Deskripsi | URL |
|-----------|-----|
| Supabase Dashboard | https://app.supabase.com |
| Website Local | http://localhost:5173 |
| Blog | http://localhost:5173/#/blog |
| Login Admin | http://localhost:5173/#/login |
| Dashboard Admin | http://localhost:5173/#/admin |

---

## 🔑 Credentials

```
Admin Login:
Username: admin
Password: sipotekk112233
```

```
Supabase Project:
Project ID: dgelqhspusjfzsvujmmy
URL: https://dgelqhspusjfzsvujmmy.supabase.co
Anon Key: (dapatkan dari Settings → API)
```

---

## 💻 Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 File Penting

| File | Deskripsi |
|------|-----------|
| `.env` | Environment variables (credentials) |
| `setup_database.sql` | SQL schema untuk setup database |
| `SETUP_GUIDE.md` | Panduan lengkap step-by-step |
| `VISUAL_GUIDE.md` | Visual guide dengan diagram |
| `README.md` | Documentation lengkap |
| `src/supabaseClient.js` | Konfigurasi Supabase |

---

## 🎯 Setup Checklist

```
□ Login ke Supabase Dashboard
□ Pilih project dgelqhspusjfzsvujmmy
□ Run SQL schema (setup_database.sql)
□ Copy anon key dari Settings → API
□ Paste anon key ke file .env
□ Run: npm install
□ Run: npm run dev
□ Test: http://localhost:5173
□ Test login admin: #/login
```

---

## 🐛 Troubleshooting Cepat

| Problem | Solution |
|---------|----------|
| npm command not found | Install Node.js |
| Module not found | Run `npm install` |
| Cannot connect to DB | Check `.env` file |
| Login failed | Check username/password |
| Blank page | Check browser console (F12) |

---

## 📊 Database Structure

```sql
Table: articles
├── id (BIGSERIAL PRIMARY KEY)
├── title (TEXT)
├── slug (TEXT UNIQUE)
├── excerpt (TEXT)
├── content (TEXT)
├── category (TEXT)
├── date (DATE)
├── read_time (TEXT)
├── image (TEXT)
├── featured (BOOLEAN)
├── status (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🎨 Categories

```
- Laundry Rumah Sakit
- Chemical Laundry
- Efisiensi Biaya
- Perawatan Linen
- Tips & Insight
```

---

## 🚀 Deployment

```bash
# Build
npm run build

# Output folder
dist/

# Deploy to:
- Vercel (recommended)
- Netlify
- GitHub Pages
```

**Environment variables di hosting:**
```
VITE_SUPABASE_URL=https://dgelqhspusjfzsvujmmy.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=sipotekk112233
```

---

## 📞 Support Files

1. **SETUP_GUIDE.md** - Panduan lengkap bahasa Indonesia
2. **VISUAL_GUIDE.md** - Visual diagram step-by-step
3. **README.md** - Technical documentation
4. **setup_database.sql** - One-click database setup

---

## ✅ Success Indicators

Website berhasil jika:
- ✅ Blog menampilkan artikel
- ✅ Klik artikel bisa buka detail
- ✅ Login admin berhasil
- ✅ Dashboard menampilkan list artikel
- ✅ Bisa create/edit/delete artikel
- ✅ Artikel baru muncul di blog

---

**Last Updated:** September 15, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
