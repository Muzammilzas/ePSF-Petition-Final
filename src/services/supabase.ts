import { createClient } from '@supabase/supabase-js';

// Fallback values for development - DO NOT USE THESE IN PRODUCTION
const FALLBACK_URL = 'https://lbqhvgvvxvrrooalywhz.supabase.co';

// More detailed environment checking
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('Supabase Environment Check:', {
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  hasUrl: !!supabaseUrl,
  urlValue: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length || 0,
  envKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
  baseUrl: window.location.origin
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    mode: import.meta.env.MODE
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

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

// Update RLS policies to allow anonymous inserts
(async () => {
  try {
    const { error } = await supabase.rpc('update_rls_policies', {
      table_name: 'scam_reports',
      policy_name: 'Enable anonymous inserts',
      policy_definition: 'true'
    });
    if (error) {
      console.error('Error updating RLS policies:', error);
    }
  } catch (error) {
    console.error('Failed to update RLS policies:', error);
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