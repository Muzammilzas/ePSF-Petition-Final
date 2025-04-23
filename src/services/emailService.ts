import axios from 'axios';
import { ScamReport, ScamTypeDetail, ContactMethod, MetaDetails } from './scamReportService';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const ADMIN_EMAIL = 'zasprince007@gmail.com';

interface ScamReportEmailData {
  report: ScamReport;
  scamTypes: ScamTypeDetail[];
  contactMethods: ContactMethod[];
}

export interface AdminNotificationData {
  report: ScamReport;
  scamTypes: ScamTypeDetail[];
  contactMethods: ContactMethod[];
  metaDetails: MetaDetails;
}

const formatScamTypes = (scamTypes: ScamTypeDetail[]): string => {
  return scamTypes.map(type => {
    let details = `- ${type.scam_type.replace(/_/g, ' ').toUpperCase()}`;
    if (type.claimed_sale_amount) details += `\n  Claimed Amount: $${type.claimed_sale_amount}`;
    if (type.amount) details += `\n  Amount: $${type.amount}`;
    if (type.promised_services) details += `\n  Promised Services: ${type.promised_services}`;
    if (type.tactics) details += `\n  Tactics: ${type.tactics}`;
    if (type.promised_refund) details += `\n  Promised Refund: ${type.promised_refund}`;
    if (type.description) details += `\n  Description: ${type.description}`;
    return details;
  }).join('\n\n');
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
  const {
    report,
    scamTypes,
    contactMethods,
    metaDetails
  } = data;

  try {
    console.log('Sending scam report notification to admin...');

    // Format scam types for email
    const formattedScamTypes = scamTypes.map(type => {
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
    }).join('\\n');

    // Format contact methods for email
    const formattedContactMethods = contactMethods.map(method => {
      switch(method.method) {
        case 'phone':
          return `Phone: ${method.phone_number}`;
        case 'email':
          return `Email: ${method.email_address}${method.evidence_file_url ? ' (Evidence attached)' : ''}`;
        case 'social_media':
          return `Social Media: ${method.social_media_platform} - ${method.social_media_profile}`;
        case 'in_person':
          return `In Person: ${method.location} - ${method.event_type}`;
        default:
          return 'Unknown contact method';
      }
    }).join('\\n');

    const requestBody = {
      to: [{
        email: 'zasprince007@gmail.com',
        name: 'Admin'
      }],
      templateId: 8,
      params: {
        reporter_name: report.reporter_name,
        reporter_email: report.reporter_email,
        reporter_phone: report.reporter_phone,
        reporter_city: report.reporter_city,
        reporter_state: report.reporter_state,
        reporter_age_range: report.reporter_age_range || 'Not provided',
        speak_with_team: report.speak_with_team ? 'Yes' : 'No',
        share_anonymously: report.share_anonymously ? 'Yes' : 'No',
        preferred_contact: report.preferred_contact,
        money_lost: report.money_lost ? 'Yes' : 'No',
        amount_lost: report.amount_lost ? `$${report.amount_lost}` : 'Not provided',
        date_occurred: new Date(report.date_occurred).toLocaleDateString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        scammer_name: report.scammer_name || 'Not provided',
        company_name: report.company_name || 'Not provided',
        scammer_phone: report.scammer_phone || 'Not provided',
        scammer_email: report.scammer_email || 'Not provided',
        scammer_website: report.scammer_website || 'Not provided',
        reported_elsewhere: report.reported_elsewhere ? 'Yes' : 'No',
        reported_to: report.reported_to || 'Not provided',
        want_updates: report.want_updates ? 'Yes' : 'No',
        evidence_file_url: report.evidence_file_url || 'No evidence attached',
        scam_types: formattedScamTypes,
        contact_methods: formattedContactMethods,
        // Meta details
        browser: metaDetails.browser,
        device_type: metaDetails.device_type,
        screen_resolution: metaDetails.screen_resolution,
        user_agent: metaDetails.user_agent,
        timezone: metaDetails.timezone,
        language: metaDetails.language,
        ip_address: metaDetails.ip_address,
        meta_city: metaDetails.city,
        meta_region: metaDetails.region,
        meta_country: metaDetails.country,
        meta_location: metaDetails.latitude && metaDetails.longitude ? 
          `${metaDetails.latitude}, ${metaDetails.longitude}` : 'Not available',
        submission_time: new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      }
    };

    console.log('Sending request to Brevo with:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      requestBody,
      {
        headers: {
          'accept': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );

    console.log('Admin notification sent successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending admin notification:', {
      message: error.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data
    });
    throw error;
  }
};

// Send confirmation email to the reporter if they want updates
export const sendReporterConfirmation = async (report: ScamReport) => {
  if (!BREVO_API_KEY || !report.want_updates || !report.reporter_email) {
    return { success: false, error: 'Email service not configured or reporter does not want updates' };
  }

  try {
    console.log('Sending confirmation to reporter...');

    const requestBody = {
      sender: {
        name: 'ePublic Safety Foundation',
        email: 'info@epublicsf.org'
      },
      to: [{
        email: report.reporter_email,
        name: report.reporter_name
      }],
      templateId: 17,
      params: {
        NAME: report.reporter_name,
        EMAIL: report.reporter_email,
        SIGNUP_DATE: new Date().toLocaleDateString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        SIGNUP_SOURCE: 'Scam Report Form'
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