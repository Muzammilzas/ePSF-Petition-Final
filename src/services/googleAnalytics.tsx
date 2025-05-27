import React from 'react';

// Google Analytics Measurement IDs
const GTM_ID = 'GT-MRQKN668';
const GA_MEASUREMENT_ID = 'G-0HD72NXL5V';

// Initialize Google Analytics
export const initGA = () => {
  // Add Google Analytics script to the document
  const script1 = document.createElement('script');
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`;
  script1.async = true;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GTM_ID);
  gtag('config', GA_MEASUREMENT_ID);
};

// Track page views
export const trackPageView = (path: string) => {
  if (window.gtag) {
    // Track in GTM
    window.gtag('config', GTM_ID, {
      page_path: path,
    });
    // Track in GA4
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Track events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (window.gtag) {
    // Track in GTM
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      send_to: GTM_ID
    });
    // Track in GA4
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      send_to: GA_MEASUREMENT_ID
    });
  }
};

// Track user timing
export const trackTiming = (category: string, variable: string, value: number, label?: string) => {
  if (window.gtag) {
    // Track in GTM
    window.gtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label,
      send_to: GTM_ID
    });
    // Track in GA4
    window.gtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label,
      send_to: GA_MEASUREMENT_ID
    });
  }
};

// Declare gtag as a global function
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Google Analytics Provider component
export const GoogleAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    initGA();
  }, []);

  return <>{children}</>;
}; 