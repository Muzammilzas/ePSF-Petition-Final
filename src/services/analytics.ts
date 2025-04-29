import { supabase } from './supabase';

interface AnalyticsData {
  ip_address: string;
  location?: string;
  device?: string;
  user_agent?: string;
  referrer?: string;
  page_url?: string;
  session_duration?: number;
}

export const trackPageView = async (data: AnalyticsData) => {
  try {
    const { error } = await supabase
      .from('website_analytics')
      .insert([data]);

    if (error) {
      console.error('Error tracking page view:', error);
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const getDeviceType = (userAgent: string): string => {
  if (/mobile/i.test(userAgent)) {
    return 'Mobile';
  } else if (/tablet/i.test(userAgent)) {
    return 'Tablet';
  } else if (/ipad/i.test(userAgent)) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
};

export const getLocationFromIP = async (ip: string): Promise<string> => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    return `${data.city}, ${data.country}`;
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return 'Unknown';
  }
}; 