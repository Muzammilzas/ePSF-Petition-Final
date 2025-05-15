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

    // 1. First sync with Supabase
    console.log('Starting Supabase sync...');
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: supabaseData, error: supabaseError } = await supabase
      .from('where_scams_thrive_submissions')
      .insert([
        {
          full_name: fullName,
          email,
          newsletter_consent: newsletterConsent,
          meta_details: metaDetails,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Database error',
          details: supabaseError.message
        })
      };
    }

    console.log('Successfully synced with Supabase');

    // 2. Then sync with Google Sheets
    console.log('Starting Google Sheets sync...');
    try {
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

      console.log('Successfully synced with Google Sheets');
    } catch (sheetsError) {
      console.error('Google Sheets error:', sheetsError);
      // Don't fail the request if sheets sync fails, since data is already in Supabase
      console.log('Continuing despite Google Sheets error since Supabase sync was successful');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success',
        details: 'Data saved successfully'
      })
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Unexpected error',
        details: error.message || 'Unknown error occurred'
      })
    };
  }
}; 