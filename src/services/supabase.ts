import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging in development only
if (import.meta.env.DEV) {
  console.log('Supabase Environment Check:', {
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
    hasUrl: !!supabaseUrl,
    urlValue: supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
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

// Test the connection and log detailed errors in development
if (import.meta.env.DEV) {
  (async () => {
    try {
      const { data, error } = await supabase.from('petitions').select('count').single();
      if (error) {
        console.error('Supabase connection error:', error);
      } else {
        console.log('Supabase connection successful', data);
      }
    } catch (error) {
      console.error('Unexpected Supabase error:', error);
    }
  })();
}

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