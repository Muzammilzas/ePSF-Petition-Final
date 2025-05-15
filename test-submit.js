import fetch from 'node-fetch';

async function testSubmission() {
  const testData = {
    fullName: "Test User",
    email: "test@example.com",
    newsletterConsent: true,
    metaDetails: {
      browser: "Test Browser",
      device_type: "Desktop",
      screen_resolution: "1920x1080",
      timezone: "America/New_York",
      ip_address: "127.0.0.1",
      city: "Test City",
      region: "Test Region",
      country: "Test Country"
    }
  };

  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    console.log('Response:', {
      status: response.status,
      data
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

testSubmission(); 