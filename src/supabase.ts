import { createClient } from '@supabase/supabase-js';

// Get the current environment
const isDevelopment = import.meta.env.DEV;
const baseUrl = isDevelopment ? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_APP_URL;

// Supabase configuration - using direct values
const supabaseUrl = 'https://lbqhvgvvxvrrooalywhz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicWh2Z3Z2eHZycm9vYWx5d2h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzc0NzEsImV4cCI6MjA1Njk1MzQ3MX0.LxFzvKRAnhRwTE52BiNPqq8APmSCFU6hW7avGWw43Xs';

console.log('Supabase Environment Check:', {
  isDevelopment,
  baseUrl,
  supabaseUrl,
  supabaseKeyLength: supabaseAnonKey.length
});

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 