// Get browser info
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
};

// Get device type
const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'Mobile';
  }
  if (/iPad|Android|Tablet/.test(userAgent)) {
    return 'Tablet';
  }
  return 'Desktop';
};

export const collectMetaDetails = async () => {
  try {
    // Get location data directly from ipapi.co
    const geoResponse = await fetch('https://ipapi.co/json/');
    if (!geoResponse.ok) {
      throw new Error(`Failed to fetch location data: ${geoResponse.status}`);
    }
    
    const geoData = await geoResponse.json();
    console.log('Location data fetched:', geoData);
    
    if (geoData.error) {
      throw new Error(`Location API error: ${geoData.error}`);
    }

    // Return all metadata
    return {
      browser: getBrowserInfo(),
      device_type: getDeviceType(),
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      user_agent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      ip_address: geoData.ip || 'Unknown',
      city: geoData.city || 'Unknown',
      region: geoData.region || 'Unknown',
      country: geoData.country_name || 'Unknown',
      latitude: geoData.latitude || null,
      longitude: geoData.longitude || null
    };
  } catch (error) {
    console.error('Error collecting meta details:', error);
    // Return basic info even if location data fails
    return {
      browser: getBrowserInfo(),
      device_type: getDeviceType(),
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      user_agent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      ip_address: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      latitude: null,
      longitude: null
    };
  }
}; 