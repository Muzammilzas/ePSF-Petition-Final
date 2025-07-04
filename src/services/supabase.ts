import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

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
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

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
  meta_details?: {
    browser: string;
    device_type: string;
    screen_resolution: string;
    user_agent: string;
    timezone: string;
    language: string;
    ip_address: string;
    city: string;
    region: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
  };
} 