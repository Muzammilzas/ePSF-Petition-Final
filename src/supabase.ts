import { createClient } from '@supabase/supabase-js';

// Get the current environment
const isDevelopment = import.meta.env.DEV;
const baseUrl = isDevelopment ? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_APP_URL;

// Debug logging
console.log('Environment Variables Status:', {
  isDevelopment,
  baseUrl,
  hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
});

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lbqhvgvvxvrrooalywhz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicWh2Z3Z2eHZycm9vYWx5d2h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzc0NzEsImV4cCI6MjA1Njk1MzQ3MX0.LxFzvKRAnhRwTE52BiNPqq8APmSCFU6hW7avGWw43Xs';

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 