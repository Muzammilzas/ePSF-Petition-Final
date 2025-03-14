import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Environment Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl?.substring(0, 10) + '...',
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your configuration.');
  // Instead of throwing an error, provide a fallback or default values
  // This prevents the app from crashing completely
}

export const supabase = createClient(
  supabaseUrl || 'https://lbqhvgvvxvrrooalywhz.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicWh2Z3Z2eHZycm9vYWx5d2h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzc0NzEsImV4cCI6MjA1Njk1MzQ3MX0.LxFzvKRAnhRwTE52BiNPqq8APmSCFU6hW7avGWw43Xs'
);

// Test the connection and log detailed errors
(async () => {
  try {
    const { data, error } = await supabase.from('petitions').select('count').single();
    if (error) {
      console.error('Supabase connection error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('Supabase connection successful', data);
    }
  } catch (error: unknown) {
    console.error('Unexpected Supabase error:', error);
  }
})();

export interface Petition {
  id: string;
  created_at: string;
  signature_count: number;
  goal: number;
  title?: string;
  story?: string;
  assessed_value?: number;
}

export interface Signature {
  id: string;
  petition_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
} 