import axios from 'axios';
import { ScamReport, ScamTypeDetail, ContactMethod, MetaDetails } from './scamReportService';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const ADMIN_EMAIL = 'zasprince007@gmail.com';

// Update sender email addresses to match verified Brevo senders
const SENDER_EMAILS = {
  ADMIN: 'noreply@epublicsf.org',  // Update this to your verified sender
  INFO: 'noreply@epublicsf.org',   // Update this to your verified sender
};

interface ScamReportEmailData {
  report: ScamReport;
  scamTypes: ScamTypeDetail[];
  contactMethods: ContactMethod[];
}

interface AdminNotificationData extends ScamReportEmailData {
  metaDetails: MetaDetails;
}

const formatScamTypes = (scamTypes: any[]) => {
  return scamTypes.map(type => {
    switch(type.scam_type) {
      case 'fake_resale':
        return `Fake Resale - Claimed Amount: ${type.claimed_sale_amount || 'Not provided'}`;
      case 'upfront_fees':
        return `Upfront Fees - Amount: ${type.amount || 'Not provided'}, Services: ${type.promised_services || 'Not provided'}`;
      case 'high_pressure':
        return `High Pressure - Tactics: ${type.tactics || 'Not provided'}, Limited Time/Threat: ${type.limited_time_or_threat ? 'Yes' : 'No'}`;
      case 'refund_exit':
        return `Refund/Exit - Promised: ${type.promised_refund || 'Not provided'}, After Other Company: ${type.contacted_after_other_company ? 'Yes' : 'No'}`;
      case 'other':
        return `Other - ${type.description || 'Not provided'}`;
      default:
        return 'Unknown scam type';
    }
  }).join('\n');
};

const formatMetaDetails = (metaDetails: MetaDetails) => {
  const formattedDate = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return `
Browser: ${metaDetails.browser || 'Not available'}
Device Type: ${metaDetails.device_type || 'Not available'}
Screen Resolution: ${metaDetails.screen_resolution || 'Not available'}
User Agent: ${metaDetails.user_agent || 'Not available'}
Timezone: ${metaDetails.timezone || 'Not available'}
Language: ${metaDetails.language || 'Not available'}
IP Address: ${metaDetails.ip_address || 'Not available'}
City: ${metaDetails.city || 'Not available'}
Region: ${metaDetails.region || 'Not available'}
Country: ${metaDetails.country || 'Not available'}
Location: ${metaDetails.latitude && metaDetails.longitude ? `${metaDetails.latitude}, ${metaDetails.longitude}` : 'Not available'}
Submission Time: ${formattedDate}
`.trim();
};

const formatContactMethods = (contactMethods: ContactMethod[]): string => {
  return contactMethods.map(contact => {
    let details = `- ${contact.method.replace(/_/g, ' ').toUpperCase()}`;
    if (contact.phone_number) details += `\n  Number: ${contact.phone_number}`;
    if (contact.email_address) details += `\n  Email: ${contact.email_address}`;
    if (contact.social_media_platform) details += `\n  Platform: ${contact.social_media_platform}`;
    if (contact.social_media_profile) details += `\n  Profile: ${contact.social_media_profile}`;
    if (contact.location) details += `\n  Location: ${contact.location}`;
    if (contact.event_type) details += `\n  Event Type: ${contact.event_type}`;
    return details;
  }).join('\n\n');
};

// Add debug logging function
const logEmailAttempt = (type: string, data: any) => {
  console.group(`Email Attempt - ${type}`);
  console.log('API Key Present:', !!BREVO_API_KEY);
  console.log('Template Data:', JSON.stringify(data, null, 2));
  console.groupEnd();
};

export const sendScamReportNotification = async (data: AdminNotificationData) => {
  try {
    console.group('Sending Admin Notification Email');
    console.log('Starting admin notification process...');

    if (!BREVO_API_KEY) {
      console.error('❌ Email service not configured: Missing Brevo API key');
      console.groupEnd();
      return { success: false, error: 'Email service not configured' };
    }

    // Log the API key length for verification (don't log the actual key)
    console.log('API Key check:', {
      present: !!BREVO_API_KEY,
      length: BREVO_API_KEY?.length,
      firstChar: BREVO_API_KEY?.[0],
      lastChar: BREVO_API_KEY?.[BREVO_API_KEY.length - 1]
    });

    const requestBody = {
      sender: {
        name: 'ePublic Safety Foundation',
        email: SENDER_EMAILS.ADMIN
      },
      to: [{
        email: ADMIN_EMAIL,
        name: 'ePSF Admin'
      }],
      templateId: 8,
      params: {
        reporter_name: data.report.reporter_name,
        reporter_email: data.report.reporter_email || 'Not provided',
        reporter_city: data.report.reporter_city,
        reporter_state: data.report.reporter_state,
        reporter_age_range: data.report.reporter_age_range || 'Not provided',
        speak_with_team: data.report.speak_with_team ? 'Yes' : 'No',
        share_anonymously: data.report.share_anonymously ? 'Yes' : 'No',
        browser: data.metaDetails?.browser || 'Not available',
        device_type: data.metaDetails?.device_type || 'Not available',
        screen_resolution: data.metaDetails?.screen_resolution || 'Not available',
        user_agent: data.metaDetails?.user_agent || 'Not available',
        timezone: data.metaDetails?.timezone || 'Not available',
        ip_address: data.metaDetails?.ip_address || 'Not available',
        meta_city: data.metaDetails?.city || 'Not available',
        meta_region: data.metaDetails?.region || 'Not available',
        meta_country: data.metaDetails?.country || 'Not available'
      }
    };

    console.log('Sending admin notification with:', {
      senderEmail: SENDER_EMAILS.ADMIN,
      recipientEmail: ADMIN_EMAIL,
      templateId: requestBody.templateId
    });

    try {
      const response = await axios.post('https://api.brevo.com/v3/smtp/email', requestBody, {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('✅ Admin notification API response:', {
        status: response.status,
        statusText: response.statusText,
        messageId: response.data?.messageId,
        data: response.data
      });
      console.groupEnd();

      return { success: true, data: response.data };
    } catch (apiError: any) {
      console.error('❌ Brevo API Error:', {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        message: apiError.message
      });
      throw apiError;
    }
  } catch (error: any) {
    console.error('❌ Error sending admin notification:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    console.groupEnd();
    return { 
      success: false, 
      error: `Failed to send notification: ${error.message}` 
    };
  }
};

// Send confirmation email to the reporter if they want updates
export const sendReporterConfirmation = async (data: ScamReportEmailData) => {
  try {
    console.group('Sending Reporter Confirmation Email');
    console.log('Starting reporter confirmation process...');

    if (!BREVO_API_KEY || !data.report.reporter_email) {
      console.error('❌ Email service not configured or reporter email missing:', {
        hasApiKey: !!BREVO_API_KEY,
        reporterEmail: data.report.reporter_email
      });
      console.groupEnd();
      return { success: false, error: 'Email service not configured or reporter email missing' };
    }

    const confirmationBody = {
      sender: {
        name: 'ePublic Safety Foundation',
        email: SENDER_EMAILS.INFO
      },
      to: [{
        email: data.report.reporter_email,
        name: data.report.reporter_name || 'Valued Reporter'
      }],
      templateId: 7,
      params: {
        name: data.report.reporter_name,
        email: data.report.reporter_email,
        city: data.report.reporter_city,
        state: data.report.reporter_state,
        date_occurred: new Date(data.report.date_occurred).toLocaleDateString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: 'long',
          day: '2-digit'
        }),
        report_date: new Date().toLocaleDateString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: 'long',
          day: '2-digit'
        }),
        company_name: data.report.company_name || 'the company',
        money_lost: data.report.money_lost ? 'Yes' : 'No',
        amount_lost: data.report.amount_lost 
          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.report.amount_lost)
          : 'N/A',
        scammer_name: data.report.scammer_name || 'the scammer',
        scammer_phone: data.report.scammer_phone || 'Not provided',
        scammer_email: data.report.scammer_email || 'Not provided',
        scammer_website: data.report.scammer_website || 'Not provided'
      }
    };

    console.log('Sending reporter confirmation with:', {
      senderEmail: SENDER_EMAILS.INFO,
      recipientEmail: data.report.reporter_email,
      templateId: confirmationBody.templateId
    });

    try {
      const response = await axios.post('https://api.brevo.com/v3/smtp/email', confirmationBody, {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('✅ Reporter confirmation API response:', {
        status: response.status,
        statusText: response.statusText,
        messageId: response.data?.messageId,
        data: response.data
      });
      console.groupEnd();

      return { success: true, data: response.data };
    } catch (apiError: any) {
      console.error('❌ Brevo API Error:', {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        message: apiError.message
      });
      throw apiError;
    }
  } catch (error: any) {
    console.error('❌ Error sending reporter confirmation:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    console.groupEnd();
    return { 
      success: false, 
      error: `Failed to send confirmation: ${error.message}` 
    };
  }
}; 