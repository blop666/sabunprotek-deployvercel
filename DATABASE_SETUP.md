# Database Schema untuk Supabase

## Setup Supabase

1. **Login ke Supabase Dashboard**: https://app.supabase.com
2. **Pilih Project**: dgelqhspusjfzsvujmmy
3. **Buka SQL Editor**
4. **Jalankan SQL berikut:**

## Connection String

```
postgresql://postgres.dgelqhspusjfzsvujmmy:sipotekk112233@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres
```

**Note:** Connection string ini sudah termasuk dalam konfigurasi Supabase. Anda hanya perlu **SUPABASE_URL** dan **ANON_KEY** untuk aplikasi frontend.

---

## Table: articles

```sql
-- Create articles table
CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  read_time TEXT DEFAULT '5 menit membaca',
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on slug for faster lookup
CREATE INDEX idx_articles_slug ON articles(slug);

-- Create index on category for filtering
CREATE INDEX idx_articles_category ON articles(category);

-- Create index on featured for homepage
CREATE INDEX idx_articles_featured ON articles(featured);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read published articles
CREATE POLICY "Allow public read access" ON articles
  FOR SELECT
  USING (status = 'published');

-- Policy: Allow authenticated users to do everything (for admin)
CREATE POLICY "Allow full access for authenticated users" ON articles
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

---

## Insert Dummy Data

```sql
-- Insert sample articles
INSERT INTO articles (title, slug, excerpt, content, category, date, read_time, image, featured, status)
VALUES
(
  'Mengapa Efisiensi Laundry Rumah Sakit Tidak Cukup Dilihat dari Harga Chemical?',
  'efisiensi-laundry-rumah-sakit-chemical',
  'Harga chemical hanyalah satu bagian dari biaya laundry. Pelajari bagaimana dosis, penggunaan proses kerja, dan layanan pendukung turut memengaruhi efisiensi secara keseluruhan.',
  '<p>Dalam operasional laundry rumah sakit, banyak pihak yang terjebak dalam pemikiran bahwa efisiensi hanya bisa dicapai dengan memilih chemical laundry dengan harga per liter terendah. Padahal, cara pandang ini justru bisa membuat biaya operasional membengkak tanpa disadari.</p><p>Harga chemical per liter memang terlihat menarik di atas kertas, namun yang sebenarnya menentukan efisiensi adalah <strong>total biaya per kilogram linen yang dicuci</strong>. Inilah yang sering luput dari perhitungan.</p><h2>Mengapa Harga Per Liter Bisa Menyesatkan?</h2><p>Chemical dengan harga rendah cenderung memiliki konsentrasi bahan aktif yang lebih rendah. Akibatnya, dosis pemakaian per kilogram linen menjadi lebih tinggi. Dalam jangka panjang, chemical yang tampak murah justru bisa menghabiskan anggaran lebih besar.</p>',
  'Laundry Rumah Sakit',
  '2024-09-05',
  '5 menit membaca',
  '/card.jpeg',
  true,
  'published'
),
(
  '5 Cara mengurangi biaya laundry rumah sakit tanpa mengorbankan kualitas',
  'cara-mengurangi-biaya-laundry',
  'Efisiensi laundry bukan hanya tentang memilih chemical dengan harga paling rendah. Kenali berbagai faktor yang dapat memengaruhkan biaya operasional.',
  '<p>Biaya laundry rumah sakit yang tinggi sering menjadi beban operasional. Namun, ada berbagai cara untuk mengurangi biaya tanpa mengorbankan kualitas hasil pencucian.</p><h2>1. Optimalisasi Dosis Chemical</h2><p>Gunakan chemical dengan dosis yang tepat. Terlalu banyak atau terlalu sedikit sama-sama merugikan.</p><h2>2. Pemeliharaan Mesin Rutin</h2><p>Mesin yang terawat akan lebih efisien dan tahan lama.</p>',
  'Efisiensi Biaya',
  '2024-09-02',
  '5 menit membaca',
  '/card.jpeg',
  false,
  'published'
);
```

---

## Cara Mendapatkan Supabase Anon Key

1. Buka **Supabase Dashboard**: https://app.supabase.com
2. Pilih project Anda: **dgelqhspusjfzsvujmmy**
3. Klik **Settings** di sidebar kiri
4. Klik **API**
5. Copy **Project URL** dan **anon/public key**
6. Paste ke file `.env`:

```
VITE_SUPABASE_URL=https://dgelqhspusjfzsvujmmy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Notes

- **Row Level Security (RLS)** enabled untuk keamanan
- **Public dapat read** artikel yang published
- **Admin (authenticated)** dapat CRUD semua artikel
- **Index** untuk performa query yang lebih cepat
- **Slug** harus unique untuk URL artikel

---

## Next Steps

Setelah database schema dibuat:
1. Update `.env` dengan Supabase Anon Key yang benar
2. Install dependencies: `npm install`
3. Jalankan `npm run dev`
4. Test login admin di `#/login`
5. Test CRUD artikel di dashboard
