import { createClient } from '@supabase/supabase-js';

// Get the current environment
const isDevelopment = import.meta.env.DEV;
const baseUrl = isDevelopment ? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_APP_URL;

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 