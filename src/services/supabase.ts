import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('Environment Check:', {
  NODE_ENV: import.meta.env.MODE,
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl?.substring(0, 10) + '...',
  baseUrl: window.location.origin
});

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

// Test the connection and log detailed errors
(async () => {
  try {
    const { data, error } = await supabase.from('scam_reports').select('count').single();
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