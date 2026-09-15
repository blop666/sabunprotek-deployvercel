import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dgelqhspusjfzsvujmmy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Database connection string (optional, untuk reference)
// postgresql://postgres.dgelqhspusjfzsvujmmy:sipotekk112233@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin credentials dari .env
export const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'sipotekk112233';

