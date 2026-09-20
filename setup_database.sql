-- ============================================
-- PROTEK BLOG DATABASE SCHEMA
-- Auto Setup Script for Supabase
-- ============================================

-- Step 1: Create articles table
CREATE TABLE IF NOT EXISTS articles (
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

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date DESC);

-- Step 3: Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access" ON articles;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON articles;

-- Step 5: Create policies
-- Policy: Allow everyone to read published articles (untuk website public)
CREATE POLICY "Allow public read access" ON articles
  FOR SELECT
  USING (status = 'published');

-- Policy: Allow service_role to do everything (untuk admin dashboard)
CREATE POLICY "Allow full access for service role" ON articles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 6: Insert sample data
INSERT INTO articles (title, slug, excerpt, content, category, date, read_time, image, featured, status)
VALUES
(
  'Mengapa Efisiensi Laundry Rumah Sakit Tidak Cukup Dilihat dari Harga Chemical?',
  'efisiensi-laundry-rumah-sakit-chemical',
  'Harga chemical hanyalah satu bagian dari biaya laundry. Pelajari bagaimana dosis, penggunaan proses kerja, dan layanan pendukung turut memengaruhi efisiensi secara keseluruhan.',
  '<p>Dalam operasional laundry rumah sakit, banyak pihak yang terjebak dalam pemikiran bahwa efisiensi hanya bisa dicapai dengan memilih chemical laundry dengan harga per liter terendah. Padahal, cara pandang ini justru bisa membuat biaya operasional membengkak tanpa disadari.</p><p>Harga chemical per liter memang terlihat menarik di atas kertas, namun yang sebenarnya menentukan efisiensi adalah <strong>total biaya per kilogram linen yang dicuci</strong>. Inilah yang sering luput dari perhitungan.</p><h2>Mengapa Harga Per Liter Bisa Menyesatkan?</h2><p>Chemical dengan harga rendah cenderung memiliki konsentrasi bahan aktif yang lebih rendah. Akibatnya, dosis pemakaian per kilogram linen menjadi lebih tinggi. Dalam jangka panjang, chemical yang tampak murah justru bisa menghabiskan anggaran lebih besar.</p><h2>Kesimpulan</h2><p>Efisiensi laundry rumah sakit bukan tentang mencari harga terendah, tapi tentang <strong>nilai terbaik per kilogram linen yang dicuci</strong>.</p>',
  'Laundry Rumah Sakit',
  '2024-09-05',
  '5 menit membaca',
  '/card.jpeg',
  true,
  'published'
),
(
  '5 Cara Mengurangi Biaya Laundry Rumah Sakit Tanpa Mengorbankan Kualitas',
  'cara-mengurangi-biaya-laundry',
  'Efisiensi laundry bukan hanya tentang memilih chemical dengan harga paling rendah. Kenali berbagai faktor yang dapat memengaruhkan biaya operasional.',
  '<p>Biaya laundry rumah sakit yang tinggi sering menjadi beban operasional. Namun, ada berbagai cara untuk mengurangi biaya tanpa mengorbankan kualitas hasil pencucian.</p><h2>1. Optimalisasi Dosis Chemical</h2><p>Gunakan chemical dengan dosis yang tepat. Terlalu banyak atau terlalu sedikit sama-sama merugikan.</p><h2>2. Pemeliharaan Mesin Rutin</h2><p>Mesin yang terawat akan lebih efisien dan tahan lama.</p><h2>3. Pelatihan Staff</h2><p>Staff yang terlatih akan bekerja lebih efisien dan mengurangi kesalahan.</p>',
  'Efisiensi Biaya',
  '2024-09-02',
  '5 menit membaca',
  '/card.jpeg',
  false,
  'published'
)
ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '✅ Sample articles inserted!';
  RAISE NOTICE '✅ You can now use the admin dashboard to manage articles.';
END $$;
