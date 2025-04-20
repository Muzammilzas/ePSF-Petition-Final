import axios from 'axios';
import { supabase } from '../services/supabase';

interface SignatureMetadata {
  device: {
    browser: string;
    device_type: string;
    screen_resolution: string;
    user_agent: string;
    timezone: string;
    language: string;
  };
  location: {
    city: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    ip_address: string;
  };
  submission_date: string;
}

interface SignatureData {
  first_name: string;
  last_name: string;
  email: string;
  timeshare_name: string;
  metadata: SignatureMetadata;
  created_at: string;
}

// Test function to verify email sending
export const testEmailNotification = async () => {
  const testData: SignatureData = {
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    timeshare_name: "Test Timeshare",
    created_at: new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    metadata: {
      device: {
        browser: "Test Browser",
        device_type: "Desktop",
        screen_resolution: "1920x1080",
        user_agent: "Test Agent",
        timezone: "UTC",
        language: "en-US"
      },
      location: {
        city: "Test City",
        region: "Test Region",
        country: "Test Country",
        latitude: 0,
        longitude: 0,
        ip_address: "127.0.0.1"
      },
      submission_date: new Date().toLocaleString('en-US', {
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

  try {
    console.log('Starting email test with Brevo API...');
    console.log('API Key available:', !!import.meta.env.VITE_BREVO_API_KEY);

    const requestBody = {
      to: [{
        email: 'info@epublicsf.org',
        name: 'ePSF Admin'
      }],
      templateId: 3,
      params: {
        FIRST_NAME: testData.first_name,
        LAST_NAME: testData.last_name,
        EMAIL: testData.email,
        TIMESHARE_NAME: testData.timeshare_name,
        SIGNED_AT: new Date(testData.created_at).toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        CITY: testData.metadata.location.city,
        REGION: testData.metadata.location.region,
        COUNTRY: testData.metadata.location.country,
        IP_ADDRESS: testData.metadata.location.ip_address,
        BROWSER: testData.metadata.device.browser,
        DEVICE_TYPE: testData.metadata.device.device_type,
        SCREEN_RESOLUTION: testData.metadata.device.screen_resolution,
        LANGUAGE: testData.metadata.device.language,
        TIMEZONE: testData.metadata.device.timezone,
        CURRENT_SIGNATURES: "47",
        SIGNATURE_GOAL: "2000",
        PROGRESS_PERCENTAGE: "2.35",
        AUTOMATION_NUMBER: "1",
        STEP_NUMBER: "4"
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

    console.log('Brevo API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Detailed error information:', {
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
    throw error;
  }
};

export const sendSignatureNotification = async (signatureData: SignatureData) => {
  const {
    first_name,
    last_name,
    email,
    timeshare_name,
    metadata,
    created_at
  } = signatureData;

  try {
    console.log('Sending signature notification email...');
    
    // Get current signature count from Supabase
    const { data: signatures, error: countError } = await supabase
      .from('signatures')
      .select('id', { count: 'exact' });
    
    const currentCount = signatures?.length || 0;
    const signatureGoal = 2000;
    const progressPercentage = ((currentCount / signatureGoal) * 100).toFixed(2);

    const requestBody = {
      to: [{
        email: 'info@epublicsf.org',
        name: 'ePSF Admin'
      }],
      templateId: 3,
      params: {
        FIRST_NAME: first_name,
        LAST_NAME: last_name,
        EMAIL: email,
        TIMESHARE_NAME: timeshare_name,
        SIGNED_AT: new Date(created_at).toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        CITY: metadata.location.city,
        REGION: metadata.location.region,
        COUNTRY: metadata.location.country,
        IP_ADDRESS: metadata.location.ip_address,
        BROWSER: metadata.device.browser,
        DEVICE_TYPE: metadata.device.device_type,
        SCREEN_RESOLUTION: metadata.device.screen_resolution,
        LANGUAGE: metadata.device.language,
        TIMEZONE: metadata.device.timezone,
        CURRENT_SIGNATURES: currentCount.toString(),
        SIGNATURE_GOAL: signatureGoal.toString(),
        PROGRESS_PERCENTAGE: progressPercentage,
        AUTOMATION_NUMBER: "1",
        STEP_NUMBER: "4"
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

    console.log('Signature notification email sent successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending signature notification email:', {
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
    throw error;
  }
};

export const sendSharePetitionEmail = async (signatureData: SignatureData) => {
  const {
    first_name,
    email,
    created_at
  } = signatureData;

  try {
    console.log('Sending share petition email...');
    
    // Generate sharing URL with UTM parameters for tracking
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://epublicsf.org';
    const sharingUrl = `${baseUrl}/petition?utm_source=email&utm_medium=share&utm_campaign=petition_share&ref=${encodeURIComponent(email)}`;
    
    // Get current signature count from Supabase
    const { data: signatures, error: countError } = await supabase
      .from('signatures')
      .select('id', { count: 'exact' });
    
    const currentCount = signatures?.length || 0;
    const signatureGoal = 2000;
    const progressPercentage = ((currentCount / signatureGoal) * 100).toFixed(2);

    const requestBody = {
      to: [{
        email: email,
        name: first_name
      }],
      templateId: 4, // New template ID for share petition email
      params: {
        FIRST_NAME: first_name,
        SIGNED_AT: new Date(created_at).toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        CURRENT_SIGNATURES: currentCount.toString(),
        SIGNATURE_GOAL: signatureGoal.toString(),
        PROGRESS_PERCENTAGE: progressPercentage,
        SHARE_LINK: sharingUrl,
        FACEBOOK_SHARE_LINK: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharingUrl)}`,
        TWITTER_SHARE_LINK: `https://twitter.com/intent/tweet?url=${encodeURIComponent(sharingUrl)}&text=${encodeURIComponent('I just signed the Timeshare Reform petition. Join me in making a difference!')}`,
        LINKEDIN_SHARE_LINK: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharingUrl)}`,
        AUTOMATION_NUMBER: "1",
        STEP_NUMBER: "4"
      }
    };

    console.log('Sending share petition request to Brevo with:', JSON.stringify(requestBody, null, 2));

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

    console.log('Share petition email sent successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending share petition email:', {
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
    throw error;
  }
};
