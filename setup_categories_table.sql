-- =====================================================
-- SETUP CATEGORIES TABLE FOR PROTEK SABUN
-- =====================================================
-- Jalankan script ini di Supabase SQL Editor
-- =====================================================

-- 1. CREATE TABLE categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CREATE INDEX untuk performa query
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICY untuk public read access
CREATE POLICY "Enable read access for all users" 
ON categories FOR SELECT 
USING (true);

-- 5. CREATE POLICY untuk authenticated insert/update/delete
CREATE POLICY "Enable insert for authenticated users only" 
ON categories FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON categories FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON categories FOR DELETE 
USING (true);

-- 6. INSERT DATA SAMPLE (kategori default)
INSERT INTO categories (name, article_count) VALUES
('Laundry Rumah Sakit', 0),
('Chemical Laundry', 0),
('Efisiensi Biaya', 0),
('Perawatan Linen', 0),
('Tips & Insight', 0)
ON CONFLICT (name) DO NOTHING;

-- 7. CREATE FUNCTION untuk update timestamp otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. CREATE TRIGGER untuk auto update timestamp
CREATE TRIGGER update_categories_updated_at 
BEFORE UPDATE ON categories 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SELESAI!
-- =====================================================
-- Tabel categories siap digunakan dengan:
-- - Auto-increment ID
-- - Unique name constraint
-- - Article count untuk tracking
-- - Auto timestamp (created_at, updated_at)
-- - RLS enabled dengan policy yang tepat
-- - Index untuk performa
-- =====================================================
