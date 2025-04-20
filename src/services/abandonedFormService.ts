import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export interface AbandonedForm {
  id: string;
  created_at: string;
  last_updated_at: string;
  session_id: string;
  current_step: string;
  form_data: {
    // Personal Information
    fullName: string;
    preferredContact: 'Email' | 'Phone' | 'Either' | 'None';
    email: string;
    phone: string;
    city: string;
    state: string;
    ageRange: string;
    speakWithTeam: boolean;
    shareAnonymously: boolean;

    // Scam Types
    scamTypes: {
      fakeResale: { selected: boolean; claimedSaleAmount: string };
      upfrontFees: { selected: boolean; amount: string; promisedServices: string };
      highPressure: { selected: boolean; tactics: string; limitedTimeOrThreat: boolean };
      refundExit: { selected: boolean; promisedRefund: string; contactedAfterOtherCompany: boolean };
      other: { selected: boolean; description: string };
    };

    // Contact Methods
    contactMethods: {
      phone: { selected: boolean; number: string };
      email: { selected: boolean; address: string; evidence: File | null };
      socialMedia: { selected: boolean; platform: string; profileName: string };
      inPerson: { selected: boolean; location: string; eventType: string };
    };

    // Incident Details
    moneyLost: boolean;
    amountLost: string;
    dateOccurred: string;
    scammerName: string;
    companyName: string;
    scammerPhone: string;
    scammerEmail: string;
    scammerWebsite: string;
    evidence: File | null;
    reportedElsewhere: boolean;
    reportedTo: string;
    wantUpdates: boolean;
  };
}

// Save abandoned form - update existing or create new
export const saveAbandonedForm = async (formData: any, currentStep: string, sessionId: string): Promise<{ data: AbandonedForm | null; error: any }> => {
  try {
    // First, check if an entry exists for this session
    const { data: existingForms, error: fetchError } = await supabase
      .from('abandoned_forms')
      .select()
      .eq('session_id', sessionId);

    if (fetchError) {
      console.error('Error checking for existing form:', fetchError);
      return { data: null, error: fetchError };
    }

    // If we found an existing form, update it
    if (existingForms && existingForms.length > 0) {
      const existingForm = existingForms[0];
      return supabase
        .from('abandoned_forms')
        .update({
          form_data: formData,
          current_step: currentStep,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', existingForm.id)
        .select()
        .single();
    }

    // If no existing form, create a new one
    return supabase
      .from('abandoned_forms')
      .insert([
        {
          session_id: sessionId,
          form_data: formData,
          current_step: currentStep,
          created_at: new Date().toISOString(),
          last_updated_at: new Date().toISOString()
        },
      ])
      .select()
      .single();
  } catch (error) {
    console.error('Error in saveAbandonedForm:', error);
    return { data: null, error };
  }
};

// Mark form as completed
export const markFormCompleted = async (sessionId: string): Promise<{ error: any }> => {
  return supabase
    .from('abandoned_forms')
    .delete()
    .eq('session_id', sessionId);
};

// Get all abandoned forms (admin only)
export const getAbandonedForms = async (): Promise<AbandonedForm[]> => {
  const { data, error } = await supabase
    .from('abandoned_forms')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching abandoned forms:', error);
    return [];
  }

  return data || [];
};

// Delete abandoned form
export const deleteAbandonedForm = async (id: string): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('abandoned_forms')
      .delete()
      .eq('id', id);

    return {
      success: !error,
      error
    };
  } catch (err) {
    return {
      success: false,
      error: err
    };
  }
};

// Delete all abandoned forms
export const deleteAllAbandonedForms = async (): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('abandoned_forms')
      .delete()
      .neq('id', ''); // This will match all records

    return {
      success: !error,
      error
    };
  } catch (err) {
    return {
      success: false,
      error: err
    };
  }
}; 