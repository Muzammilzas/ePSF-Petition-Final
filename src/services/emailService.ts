import axios from 'axios';
import { ScamReport, ScamTypeDetail, ContactMethod, MetaDetails } from './scamReportService';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const ADMIN_EMAIL = 'timeshare@epublicsf.org';

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

const formatMetaDetails = (metaDetails: any) => {
  return `
Browser: ${metaDetails.browser}
Device Type: ${metaDetails.device_type}
Screen Resolution: ${metaDetails.screen_resolution}
User Agent: ${metaDetails.user_agent}
Timezone: ${metaDetails.timezone}
Language: ${metaDetails.language}
IP Address: ${metaDetails.ip_address}
City: ${metaDetails.city}
Region: ${metaDetails.region}
Country: ${metaDetails.country}
Location: ${metaDetails.latitude && metaDetails.longitude ? `${metaDetails.latitude}, ${metaDetails.longitude}` : 'Not available'}
Submission Time: ${new Date().toLocaleString('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
})}
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
      return { success: false, error: 'Email service not configured' };
    }

    const requestBody = {
      to: [{
        email: ADMIN_EMAIL,
        name: 'ePSF Admin'
      }],
      templateId: 6,
      params: {
        REPORTER_NAME: data.report.reporter_name,
        REPORTER_CITY: data.report.reporter_city,
        REPORTER_STATE: data.report.reporter_state,
        REPORTER_AGE_RANGE: data.report.reporter_age_range || 'Not provided',
        REPORTER_EMAIL: data.report.reporter_email || 'Not provided',
        SPEAK_WITH_TEAM: data.report.speak_with_team ? 'Yes' : 'No',
        SHARE_ANONYMOUSLY: data.report.share_anonymously ? 'Yes' : 'No',
        MONEY_LOST: data.report.money_lost ? 'Yes' : 'No',
        AMOUNT_LOST: data.report.amount_lost 
          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.report.amount_lost)
          : 'N/A',
        DATE_OCCURRED: new Date(data.report.date_occurred).toLocaleDateString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: 'long',
          day: '2-digit'
        }),
        SCAMMER_NAME: data.report.scammer_name || 'Not provided',
        COMPANY_NAME: data.report.company_name || 'Not provided',
        SCAMMER_PHONE: data.report.scammer_phone || 'Not provided',
        SCAMMER_EMAIL: data.report.scammer_email || 'Not provided',
        SCAMMER_WEBSITE: data.report.scammer_website || 'Not provided',
        REPORTED_ELSEWHERE: data.report.reported_elsewhere ? 'Yes' : 'No',
        REPORTED_TO: data.report.reported_to || 'N/A',
        WANT_UPDATES: data.report.want_updates ? 'Yes' : 'No',
        EVIDENCE_FILE_URL: data.report.evidence_file_url || 'No evidence file uploaded',
        SCAM_TYPES: formatScamTypes(data.scamTypes),
        META_DETAILS: formatMetaDetails(data.metaDetails)
      }
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', requestBody, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
};

// Send confirmation email to the reporter if they want updates
export const sendReporterConfirmation = async (data: ScamReportEmailData) => {
  if (!BREVO_API_KEY || !data.report.want_updates || !data.report.reporter_email) {
    return { success: false, error: 'Email service not configured or reporter does not want updates' };
  }

  try {
    console.log('Sending confirmation to reporter...');

    const requestBody = {
      to: [{
        email: data.report.reporter_email,
        name: data.report.reporter_name
      }],
      templateId: 7, // Updated to use template ID 7
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

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      requestBody,
      {
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );

    console.log('Reporter confirmation sent successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error sending reporter confirmation:', {
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