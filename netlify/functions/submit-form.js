const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const body = JSON.parse(event.body);
    const {
      fullName,
      email,
      newsletterConsent,
      metaDetails = {},
    } = body;

    // Google Sheets setup
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const SHEET_NAME = 'Sheet1';

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Prepare row for Google Sheet
    const row = [
      fullName,
      email,
      newsletterConsent ? 'Yes' : 'No',
      new Date().toISOString(),
      metaDetails.city || '',
      metaDetails.region || '',
      metaDetails.country || '',
      metaDetails.ip_address || metaDetails.ipAddress || '',
      metaDetails.browser || '',
      metaDetails.device_type || metaDetails.deviceType || '',
      metaDetails.screen_resolution || metaDetails.screenResolution || '',
      metaDetails.timezone || metaDetails.timeZone || '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    // Supabase sync
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error: supabaseError } = await supabase
      .from('where_scams_thrive_submissions')
      .insert([
        {
          full_name: fullName,
          email,
          newsletter_consent: newsletterConsent,
          meta_details: metaDetails,
          created_at: new Date().toISOString(),
        },
      ]);
    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return {
        statusCode: 500,
        body: 'Supabase error: ' + supabaseError.message,
      };
    }

    return {
      statusCode: 200,
      body: 'Success',
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: error.message || 'Error',
    };
  }
}; 