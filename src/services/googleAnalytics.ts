// Google Analytics Service
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize dataLayer array if it doesn't exist
window.dataLayer = window.dataLayer || [];

// Basic gtag function
function gtag(...args: any[]) {
  window.dataLayer.push(arguments);
}

// Initialize Google Analytics
export const initializeGA = () => {
  // Create and add the Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-4F6WJQT672';
  
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-4F6WJQT672');
  `;
  
  // Add scripts to document head
  document.head.appendChild(script1);
  document.head.appendChild(script2);
};

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-4F6WJQT672', {
      page_path: path,
      send_page_view: true
    });
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      'event_category': 'button',
      'event_label': buttonName,
      'send_to': 'G-4F6WJQT672'
    });
  }
};

// Track petition signatures
export const trackPetitionSignature = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'G-4F6WJQT672',
      'event_category': 'petition',
      'event_label': 'signature'
    });
  }
};

export default {
  initializeGA,
  trackPageView,
  trackButtonClick,
  trackPetitionSignature,
}; 