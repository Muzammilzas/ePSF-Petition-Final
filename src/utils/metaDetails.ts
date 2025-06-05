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
    console.log('Starting meta details collection...');
    
    // Collect device information first
    const deviceInfo = {
      browser: getBrowserInfo(),
      device_type: getDeviceType(),
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      user_agent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
    
    console.log('Device info collected:', deviceInfo);

    // Get location data from multiple sources for redundancy
    console.log('Fetching location data...');
    
    // Try ipapi.co first
    let locationInfo;
    try {
      const ipapiResponse = await fetch('https://ipapi.co/json/');
      if (ipapiResponse.ok) {
        const ipapiData = await ipapiResponse.json();
        if (!ipapiData.error) {
          locationInfo = {
            ip_address: ipapiData.ip || 'Unknown',
            city: ipapiData.city || 'Unknown',
            region: ipapiData.region || 'Unknown',
            country: ipapiData.country_name || 'Unknown',
            latitude: ipapiData.latitude || null,
            longitude: ipapiData.longitude || null
          };
        }
      }
    } catch (error) {
      console.error('ipapi.co error:', error);
    }

    // If ipapi.co fails, try ip-api.com as backup
    if (!locationInfo) {
      try {
        const ipApiResponse = await fetch('http://ip-api.com/json/');
        if (ipApiResponse.ok) {
          const ipApiData = await ipApiResponse.json();
          if (ipApiData.status === 'success') {
            locationInfo = {
              ip_address: ipApiData.query || 'Unknown',
              city: ipApiData.city || 'Unknown',
              region: ipApiData.regionName || 'Unknown',
              country: ipApiData.country || 'Unknown',
              latitude: ipApiData.lat || null,
              longitude: ipApiData.lon || null
            };
          }
        }
      } catch (error) {
        console.error('ip-api.com error:', error);
      }
    }

    // If both services fail, use a third service as final backup
    if (!locationInfo) {
      try {
        const geoJsResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (geoJsResponse.ok) {
          const geoJsData = await geoJsResponse.json();
          locationInfo = {
            ip_address: geoJsData.ip || 'Unknown',
            city: geoJsData.city || 'Unknown',
            region: geoJsData.region || 'Unknown',
            country: geoJsData.country || 'Unknown',
            latitude: geoJsData.latitude || null,
            longitude: geoJsData.longitude || null
          };
        }
      } catch (error) {
        console.error('geojs.io error:', error);
      }
    }

    // If all services fail, use fallback location info
    if (!locationInfo) {
      locationInfo = {
        ip_address: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        latitude: null,
        longitude: null
      };
    }

    console.log('Location info collected:', locationInfo);

    // Return all metadata in the expected structure
    const metaDetails = {
      device: deviceInfo,
      location: locationInfo,
      submission_date: new Date().toISOString()
    };

    console.log('Final meta details:', metaDetails);
    return metaDetails;
  } catch (error) {
    console.error('Error collecting meta details:', error);
    // Return basic info even if location data fails
    const fallbackDetails = {
      device: {
        browser: getBrowserInfo(),
        device_type: getDeviceType(),
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        user_agent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      },
      location: {
        ip_address: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        latitude: null,
        longitude: null
      },
      submission_date: new Date().toISOString()
    };
    console.log('Using fallback meta details:', fallbackDetails);
    return fallbackDetails;
  }
}; 