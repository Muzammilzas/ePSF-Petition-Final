import { supabase } from './supabase';

export interface ScamReport {
  id?: string; // UUID
  created_at?: string;
  // Reporter Information
  reporter_name: string;
  reporter_email: string;
  reporter_phone: string;
  reporter_city: string;
  reporter_state: string;
  reporter_age_range?: string;
  speak_with_team: boolean;
  share_anonymously: boolean;
  preferred_contact: 'Email' | 'Phone' | 'Either' | 'None';

  // Scam Information
  money_lost: boolean;
  amount_lost?: number;
  date_occurred: string;
  scammer_name: string;
  company_name: string;
  scammer_phone: string;
  scammer_email: string;
  scammer_website: string;
  reported_elsewhere: boolean;
  reported_to?: string;
  want_updates: boolean;
  evidence_file_url?: string;
}

export interface ScamTypeDetail {
  id?: string; // UUID
  report_id?: string; // UUID
  scam_type: 'fake_resale' | 'upfront_fees' | 'high_pressure' | 'refund_exit' | 'other';
  claimed_sale_amount?: number;
  amount?: number;
  promised_services?: string;
  tactics?: string;
  limited_time_or_threat?: boolean;
  promised_refund?: string;
  contacted_after_other_company?: boolean;
  description?: string;
}

export interface ContactMethod {
  id?: string; // UUID
  report_id?: string; // UUID
  method: 'phone' | 'email' | 'social_media' | 'in_person';
  phone_number?: string;
  email_address?: string;
  social_media_platform?: string;
  social_media_profile?: string;
  location?: string;
  event_type?: string;
  evidence_file_url?: string;
}

export const submitScamReport = async (
  report: ScamReport,
  scamTypes: ScamTypeDetail[],
  contactMethods: ContactMethod[]
) => {
  try {
    // Start a transaction
    const { data: reportData, error: reportError } = await supabase
      .from('scam_reports')
      .insert(report)
      .select()
      .single();

    if (reportError) throw reportError;

    // Insert scam types
    const scamTypesWithReportId = scamTypes.map(type => ({
      ...type,
      report_id: reportData.id
    }));

    const { error: scamTypesError } = await supabase
      .from('scam_types')
      .insert(scamTypesWithReportId);

    if (scamTypesError) throw scamTypesError;

    // Insert contact methods
    const contactMethodsWithReportId = contactMethods.map(method => ({
      ...method,
      report_id: reportData.id
    }));

    const { error: contactMethodsError } = await supabase
      .from('contact_methods')
      .insert(contactMethodsWithReportId);

    if (contactMethodsError) throw contactMethodsError;

    return { success: true, data: reportData };
  } catch (error) {
    console.error('Error submitting scam report:', error);
    return { success: false, error };
  }
};

export const uploadEvidence = async (file: File, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('scam-evidence')
      .upload(path, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('scam-evidence')
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading evidence:', error);
    return { success: false, error };
  }
}; 