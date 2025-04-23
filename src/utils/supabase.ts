import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

export const createPetition = async (petition: Omit<Petition, 'id' | 'created_at' | 'signature_count'>) => {
  const { data, error } = await supabase
    .from('petitions')
    .insert([petition])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPetition = async (id: string) => {
  const { data, error } = await supabase
    .from('petitions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const addSignature = async (signature: Omit<Signature, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('signatures')
    .insert([signature])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPetitionSignatures = async (petitionId: string) => {
  const { data, error } = await supabase
    .from('signatures')
    .select('*')
    .eq('petition_id', petitionId);

  if (error) throw error;
  return data;
}; 