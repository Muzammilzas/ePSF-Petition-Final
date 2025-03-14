import { supabase } from '../services/supabase';
import { Petition, Signature } from '../services/supabase';

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