import { supabase } from './supabase';

export interface ScamReport {
  id?: string; // UUID
  created_date?: string;
  created_time?: string;
  // Reporter Information
  reporter_name: string;
  reporter_email: string;
  reporter_city: string;
  reporter_state: string;
  reporter_age_range?: string;
  speak_with_team: boolean;
  share_anonymously: boolean;

  // Scam Information
  money_lost: boolean;
  amount_lost?: number;
  date_occurred: string;
  scammer_name: string;
  company_name: string;
  scammer_phone: string;
  scammer_email: string;
  scammer_website: string | null; // Must be null or a valid URL matching ^https?:\/\/[^\s/$.?#].[^\s]*$
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

export interface MetaDetails {
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
}

export const submitScamReport = async (
  report: ScamReport,
  scamTypes: ScamTypeDetail[],
  contactMethods: ContactMethod[],
  metaDetails: MetaDetails
) => {
  try {
    // Validate required fields
    if (!report.reporter_name || !report.reporter_email) {
      throw new Error('Name and email are required fields');
    }

    console.log('Starting scam report submission:', {
      reporterName: report.reporter_name,
      reporterEmail: report.reporter_email,
      scammerWebsite: report.scammer_website,
      scamTypes: scamTypes.length,
      hasMetaDetails: !!metaDetails
    });

    // Create a copy of the report to modify
    const reportToSubmit = { ...report };

    // Handle website field
    if (reportToSubmit.scammer_website === undefined || reportToSubmit.scammer_website === '') {
      reportToSubmit.scammer_website = null;
    } else if (reportToSubmit.scammer_website) {
      try {
        let formattedUrl = reportToSubmit.scammer_website.trim();
        
        // Add protocol if missing
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
          formattedUrl = 'https://' + formattedUrl;
        }

        // Test URL construction
        new URL(formattedUrl);
        
        // Test against the required pattern
        const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
        if (!urlPattern.test(formattedUrl)) {
          console.log('URL failed pattern validation:', {
            url: formattedUrl,
            matches: urlPattern.test(formattedUrl)
          });
          reportToSubmit.scammer_website = null;
        } else {
          reportToSubmit.scammer_website = formattedUrl;
        }
      } catch (error) {
        console.log('URL validation error:', {
          url: reportToSubmit.scammer_website,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        reportToSubmit.scammer_website = null;
      }
    }

    // Submit the report
    const { data: reportData, error: reportError } = await supabase
      .from('scam_reports')
      .insert(reportToSubmit)
      .select()
      .single();

    if (reportError) {
      console.error('Error inserting scam report:', reportError);
      throw new Error(`Failed to submit report: ${reportError.message}`);
    }

    if (!reportData) {
      throw new Error('No data returned from report submission');
    }

    console.log('Scam report inserted successfully:', {
      reportId: reportData.id,
      createdDate: reportData.created_date,
      createdTime: reportData.created_time
    });

    // Insert scam types
    if (scamTypes.length > 0) {
      const scamTypeRecords = scamTypes.map(type => ({
        report_id: reportData.id,
        ...type
    }));

    const { error: scamTypesError } = await supabase
      .from('scam_types')
        .insert(scamTypeRecords);

    if (scamTypesError) {
      console.error('Error inserting scam types:', scamTypesError);
        console.log('Continuing despite scam type insertion error');
      } else {
        console.log('Scam types inserted successfully');
      }
    }

    // Insert contact methods
    if (contactMethods.length > 0) {
      const contactMethodRecords = contactMethods.map(method => ({
        report_id: reportData.id,
        ...method
    }));

    const { error: contactMethodsError } = await supabase
      .from('contact_methods')
        .insert(contactMethodRecords);

    if (contactMethodsError) {
      console.error('Error inserting contact methods:', contactMethodsError);
        console.log('Continuing despite contact methods insertion error');
      } else {
        console.log('Contact methods inserted successfully');
      }
    }

    // Insert meta details - make this non-blocking
    try {
      console.log('Attempting to insert metadata:', {
        report_id: reportData.id,
        ...metaDetails
      });

      const { data: metaData, error: metaError } = await supabase
        .from('scam_report_metadata')
        .insert({
          report_id: reportData.id,
          ...metaDetails
        })
        .select();

    if (metaError) {
        console.error('Error inserting meta details:', {
          error: metaError,
          code: metaError.code,
          message: metaError.message,
          details: metaError.details,
          hint: metaError.hint
        });
        console.log('Continuing despite metadata insertion error');
      } else {
        console.log('Meta details inserted successfully:', metaData);
      }
    } catch (error) {
      console.error('Error submitting meta details:', error);
      console.log('Continuing despite metadata error');
    }

    return { success: true, data: reportData };
  } catch (error: any) {
    console.error('Error submitting scam report:', {
      error: error,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to submit report'),
      data: null 
    };
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