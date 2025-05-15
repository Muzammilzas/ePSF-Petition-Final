require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  // Log environment variables (without sensitive data)
  console.log('Environment check:', {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasGoogleCreds: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    hasSpreadsheetId: !!process.env.GOOGLE_SPREADSHEET_ID,
  });

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
      // Verify Google Sheets credentials
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        throw new Error('Google service account credentials are missing');
      }
      if (!process.env.GOOGLE_SPREADSHEET_ID) {
        throw new Error('Google Spreadsheet ID is missing');
      }

      console.log('Parsing Google service account credentials...');
      const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
      const SHEET_NAME = 'Where Scam Thrive';

      console.log('Initializing Google Sheets client...');
      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      
      const client = await auth.getClient();
      console.log('Google auth client created successfully');
      
      const sheets = google.sheets({ version: 'v4', auth: client });
      console.log('Google Sheets client initialized');

      // First, verify if we can access the sheet
      console.log('Verifying sheet access...');
      try {
        const sheetInfo = await sheets.spreadsheets.get({
          spreadsheetId: SPREADSHEET_ID
        });
        console.log('Successfully accessed spreadsheet:', sheetInfo.data.properties.title);
        
        // Get available sheets
        const availableSheets = sheetInfo.data.sheets.map(sheet => sheet.properties.title);
        console.log('Available sheets:', availableSheets);
        
        // Use the first sheet if Form Responses doesn't exist
        if (!availableSheets.includes(SHEET_NAME)) {
          console.log(`Sheet "${SHEET_NAME}" not found. Using the first sheet:`, availableSheets[0]);
        }
      } catch (accessError) {
        console.error('Failed to access spreadsheet:', accessError);
        throw new Error(`Could not access Google Sheet. Error: ${accessError.message}`);
      }

      // Format date in EST timezone
      const now = new Date();
      const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      
      const dateStr = estDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      const timeStr = estDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      });

      // Prepare row for Google Sheet
      const row = [
        [
          dateStr,           // Date (EST)
          timeStr,           // Time (EST)
          fullName,
          email,
          newsletterConsent ? 'Yes' : 'No',
          metaDetails.city || 'N/A',
          metaDetails.region || 'N/A',
          metaDetails.country || 'N/A',
          metaDetails.ip_address || metaDetails.ipAddress || 'N/A',
          metaDetails.browser || 'N/A',
          metaDetails.device_type || metaDetails.deviceType || 'N/A',
          metaDetails.screen_resolution || metaDetails.screenResolution || 'N/A',
          metaDetails.timezone || metaDetails.timeZone || 'N/A'
        ]
      ];

      console.log('Attempting to append row to sheet:', row);

      // Append the row
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:M2`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: row
        }
      });

      console.log('Google Sheets append response:', {
        updatedRange: appendResponse.data.updates?.updatedRange,
        updatedRows: appendResponse.data.updates?.updatedRows,
        updatedColumns: appendResponse.data.updates?.updatedColumns
      });

    } catch (sheetsError) {
      console.error('Google Sheets error details:', {
        message: sheetsError.message,
        stack: sheetsError.stack,
        details: sheetsError.response?.data || 'No additional details'
      });
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