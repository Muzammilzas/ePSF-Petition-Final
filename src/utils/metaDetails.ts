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
          console.log('Successfully got location from ipapi.co:', locationInfo);
        } else {
          console.warn('ipapi.co returned error:', ipapiData.error);
        }
      }
    } catch (error) {
      console.error('ipapi.co error:', error);
    }

    // If ipapi.co fails, try ip-api.com as backup
    if (!locationInfo) {
      try {
        const ipApiResponse = await fetch('https://api.ip-api.com/json/');
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
            console.log('Successfully got location from ip-api.com:', locationInfo);
          } else {
            console.warn('ip-api.com returned error status:', ipApiData.status);
          }
        }
      } catch (error) {
        console.error('ip-api.com error:', error);
      }
    }

    // If both services fail, use geojs.io as final backup
    if (!locationInfo) {
      try {
        // First get IP from geojs.io
        const ipResponse = await fetch('https://get.geojs.io/v1/ip');
        if (ipResponse.ok) {
          const ip = await ipResponse.text();
          // Then get geo data
          const geoResponse = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            locationInfo = {
              ip_address: geoData.ip || 'Unknown',
              city: geoData.city || 'Unknown',
              region: geoData.region || 'Unknown',
              country: geoData.country || 'Unknown',
              latitude: geoData.latitude || null,
              longitude: geoData.longitude || null
            };
            console.log('Successfully got location from geojs.io:', locationInfo);
          }
        }
      } catch (error) {
        console.error('geojs.io error:', error);
      }
    }

    // If all services fail, use a simpler IP-only service as last resort
    if (!locationInfo) {
      try {
        const ipifyResponse = await fetch('https://api.ipify.org?format=json');
        if (ipifyResponse.ok) {
          const ipData = await ipifyResponse.json();
          locationInfo = {
            ip_address: ipData.ip || 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            country: 'Unknown',
            latitude: null,
            longitude: null
          };
          console.log('Got IP only from ipify:', locationInfo);
        }
      } catch (error) {
        console.error('ipify error:', error);
      }
    }

    // If all services fail, use fallback location info
    if (!locationInfo) {
      console.warn('All location services failed, using fallback values');
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

    // Return all metadata in the expected MetaDetails structure
    return {
      browser: deviceInfo.browser,
      device_type: deviceInfo.device_type,
      screen_resolution: deviceInfo.screen_resolution,
      user_agent: deviceInfo.user_agent,
      timezone: deviceInfo.timezone,
      language: deviceInfo.language,
      ip_address: locationInfo.ip_address,
      city: locationInfo.city,
      region: locationInfo.region,
      country: locationInfo.country,
      latitude: locationInfo.latitude,
      longitude: locationInfo.longitude
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