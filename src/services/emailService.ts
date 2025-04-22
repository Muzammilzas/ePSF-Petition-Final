import axios from 'axios';
import { ScamReport, ScamTypeDetail, ContactMethod } from './scamReportService';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const ADMIN_EMAIL = 'zasprince007@gmail.com';

interface ScamReportEmailData {
  report: ScamReport;
  scamTypes: ScamTypeDetail[];
  contactMethods: ContactMethod[];
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

export const sendScamReportNotification = async (data: ScamReportEmailData) => {
  if (!BREVO_API_KEY) {
    console.error('Brevo API key is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    console.log('Starting scam report notification process...');
    console.log('Admin email recipient:', ADMIN_EMAIL);

    const { report, scamTypes, contactMethods } = data;

    // Format money lost amount
    const moneyLostAmount = report.amount_lost 
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(report.amount_lost)
      : 'N/A';

    // Format scam types for template
    const formattedScamTypes = scamTypes.reduce((acc, type) => {
      acc[`${type.scam_type}_selected`] = true;
      if (type.claimed_sale_amount) acc[`${type.scam_type}_amount`] = type.claimed_sale_amount;
      if (type.amount) acc[`${type.scam_type}_amount`] = type.amount;
      if (type.promised_services) acc[`${type.scam_type}_services`] = type.promised_services;
      if (type.tactics) acc[`${type.scam_type}_tactics`] = type.tactics;
      if (type.limited_time_or_threat !== undefined) acc[`${type.scam_type}_threat`] = type.limited_time_or_threat;
      if (type.promised_refund) acc[`${type.scam_type}_promise`] = type.promised_refund;
      if (type.contacted_after_other_company !== undefined) acc[`${type.scam_type}_contacted`] = type.contacted_after_other_company;
      if (type.description) acc[`${type.scam_type}_description`] = type.description;
      return acc;
    }, {} as Record<string, any>);

    console.log('Formatted scam types:', formattedScamTypes);

    // Format contact methods for template
    const formattedContactMethods = contactMethods.reduce((acc, method) => {
      acc[`${method.method}_contact_selected`] = true;
      if (method.phone_number) acc.contact_phone_number = method.phone_number;
      if (method.email_address) acc.contact_email_address = method.email_address;
      if (method.evidence_file_url) acc.contact_email_evidence = method.evidence_file_url;
      if (method.social_media_platform) acc.social_media_platform = method.social_media_platform;
      if (method.social_media_profile) acc.social_media_profile = method.social_media_profile;
      if (method.location) acc.in_person_location = method.location;
      if (method.event_type) acc.in_person_event = method.event_type;
      return acc;
    }, {} as Record<string, any>);

    console.log('Formatted contact methods:', formattedContactMethods);

    const requestBody = {
      sender: {
        name: 'ePublic Safety Foundation',
        email: 'info@epublicsf.org'
      },
      to: [{
        email: ADMIN_EMAIL,
        name: 'ePSF Admin'
      }],
      templateId: 7,
      params: {
        reporter_name: report.reporter_name,
        reporter_email: report.reporter_email || 'Not provided',
        reporter_phone: report.reporter_phone || 'Not provided',
        reporter_city: report.reporter_city,
        reporter_state: report.reporter_state,
        reporter_age_range: report.reporter_age_range || 'Not provided',
        preferred_contact: report.preferred_contact,
        speak_with_team: report.speak_with_team ? 'Yes' : 'No',
        share_anonymously: report.share_anonymously ? 'Yes' : 'No',
        
        date_occurred: new Date(report.date_occurred).toLocaleDateString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        money_lost: report.money_lost ? 'Yes' : 'No',
        amount_lost: moneyLostAmount,
        scammer_name: report.scammer_name || 'Not provided',
        company_name: report.company_name || 'Not provided',
        scammer_phone: report.scammer_phone || 'Not provided',
        scammer_email: report.scammer_email || 'Not provided',
        scammer_website: report.scammer_website || 'Not provided',
        
        reported_elsewhere: report.reported_elsewhere ? 'Yes' : 'No',
        reported_to: report.reported_to || 'N/A',
        want_updates: report.want_updates ? 'Yes' : 'No',
        evidence_file_url: report.evidence_file_url || '',
        
        admin_url: `${window.location.origin}/admin/scam-reports`,
        
        ...formattedScamTypes,
        ...formattedContactMethods
      }
    };

    console.log('Preparing to send email with request body:', JSON.stringify(requestBody, null, 2));

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

    console.log('Email API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Detailed error sending notification:', {
      message: error.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      headers: error?.response?.headers,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        headers: error?.config?.headers
      }
    });
    return { 
      success: false, 
      error: error?.response?.data?.message || error.message 
    };
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