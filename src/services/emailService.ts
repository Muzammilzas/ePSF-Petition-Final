import axios from 'axios';
import { ScamReport, ScamTypeDetail, ContactMethod, MetaDetails } from './scamReportService';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const ADMIN_EMAIL = 'zasprince007@gmail.com';

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

export const sendScamReportNotification = async (data: AdminNotificationData) => {
  try {
    if (!BREVO_API_KEY) {
      console.error('Email service not configured: Missing Brevo API key');
      return { success: false, error: 'Email service not configured' };
    }

    const requestBody = {
      sender: {
        name: 'ePublic Safety Foundation',
        email: 'admin@epublicsf.org'
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
        browser: data.metaDetails.browser || 'Not available',
        device_type: data.metaDetails.device_type || 'Not available',
        screen_resolution: data.metaDetails.screen_resolution || 'Not available',
        user_agent: data.metaDetails.user_agent || 'Not available',
        timezone: data.metaDetails.timezone || 'Not available',
        ip_address: data.metaDetails.ip_address || 'Not available',
        meta_city: data.metaDetails.city || 'Not available',
        meta_region: data.metaDetails.region || 'Not available',
        meta_country: data.metaDetails.country || 'Not available'
      }
    };

    console.log('Sending admin notification with full details:', {
      apiKey: BREVO_API_KEY ? 'Present' : 'Missing',
      sender: requestBody.sender,
      recipient: requestBody.to[0].email,
      templateId: requestBody.templateId,
      params: requestBody.params
    });

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', requestBody, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('Admin notification API response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error in sendScamReportNotification:', {
      error,
      message: error.message,
      stack: error.stack
    });
    
    return { 
      success: false, 
      error: `Failed to send notification: ${error.message}` 
    };
  }
};

// Send confirmation email to the reporter if they want updates
export const sendReporterConfirmation = async (data: ScamReportEmailData) => {
  if (!BREVO_API_KEY || !data.report.want_updates || !data.report.reporter_email) {
    return { success: false, error: 'Email service not configured or reporter does not want updates' };
  }

  try {
    console.log('Sending confirmation to reporter...');

    // First send the immediate confirmation
    const confirmationBody = {
      sender: {
        name: 'ePublic Safety Foundation',
        email: 'info@epublicsf.org'
      },
      to: [{
        email: data.report.reporter_email,
        name: data.report.reporter_name
      }],
      templateId: 7,
      params: {
        REPORTER_NAME: data.report.reporter_name,
        DATE_OCCURRED: new Date(data.report.date_occurred).toLocaleDateString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        REPORT_DATE: new Date().toLocaleDateString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        COMPANY_NAME: data.report.company_name || 'the company',
        MONEY_LOST: data.report.money_lost ? 'Yes' : 'No',
        AMOUNT_LOST: data.report.amount_lost 
          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.report.amount_lost)
          : 'N/A'
      }
    };

    const confirmResponse = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      confirmationBody,
      {
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );

    // Then send the newsletter signup confirmation
    const newsletterBody = {
      sender: {
        name: 'ePublic Safety Foundation',
        email: 'timeshare@epublicsf.org'
      },
      to: [{
        email: data.report.reporter_email,
        name: data.report.reporter_name
      }],
      templateId: 17,
      params: {
        NAME: data.report.reporter_name,
        EMAIL: data.report.reporter_email
      }
    };

    const newsletterResponse = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      newsletterBody,
      {
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );

    console.log('Reporter notifications sent successfully:', {
      confirmation: confirmResponse.data,
      newsletter: newsletterResponse.data
    });
    
    return { success: true, data: { confirmation: confirmResponse.data, newsletter: newsletterResponse.data } };
  } catch (error: any) {
    console.error('Error sending reporter notifications:', {
      message: error.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
    return { 
      success: false, 
      error: error?.response?.data?.message || error.message 
    };
  }
}; 