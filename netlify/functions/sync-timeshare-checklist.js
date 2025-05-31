require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  console.log('Starting sync-timeshare-checklist function...');
  
  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: 'Method Not Allowed',
        details: 'Only POST requests are allowed'
      })
    };
  }

  try {
    // Verify environment variables
    console.log('Verifying environment variables...');
    if (!process.env.SUPABASE_URL) throw new Error('SUPABASE_URL is missing');
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is missing');
    if (!process.env.GOOGLE_SPREADSHEET_ID) throw new Error('GOOGLE_SPREADSHEET_ID is missing');

    console.log('Environment variables verified');

    // Initialize Supabase
    console.log('Initializing Supabase client...');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get all submissions from Supabase
    console.log('Fetching all submissions from Supabase...');
    const { data: submissions, error: supabaseError } = await supabase
      .from('timeshare_scam_checklist')
      .select('*')
      .order('created_date', { ascending: false })
      .order('created_time', { ascending: false });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    console.log(`Found ${submissions?.length || 0} total submissions`);

    // Initialize Google Sheets
    console.log('Initializing Google Sheets client...');
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const SHEET_NAME = 'Timeshare Scam Checklist';

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Clear the entire sheet including headers
    console.log('Clearing existing data...');
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:M`,
      });
    } catch (clearError) {
      console.error('Error clearing sheet:', clearError);
      throw new Error(`Failed to clear sheet: ${clearError.message}`);
    }

    // Define headers
    const headers = [
      'Date',
      'Time',
      'name',
      'Email',
      'Consent',
      'City',
      'Region',
      'Country',
      'Ip Address',
      'Browser',
      'Device',
      'Resolution',
      'Timezone'
    ];

    // Prepare the data rows
    const dataRows = submissions ? submissions.map(submission => [
      submission.created_date || '',  // Date
      submission.created_time || '',  // Time
      submission.full_name || '',     // name
      submission.email || '',         // Email
      submission.newsletter_consent ? 'Yes' : 'No',  // Consent
      submission.meta_details?.location?.city || '',        // City
      submission.meta_details?.location?.region || '',      // Region
      submission.meta_details?.location?.country || '',     // Country
      submission.meta_details?.location?.ip_address || '',  // Ip Address
      submission.meta_details?.device?.browser || '',       // Browser
      submission.meta_details?.device?.device_type || '',   // Device
      submission.meta_details?.device?.screen_resolution || '', // Resolution
      submission.meta_details?.device?.timezone || ''       // Timezone
    ]) : [];

    // Combine headers and data
    const allRows = [headers, ...dataRows];

    // Update Google Sheet with headers and data
    console.log('Updating Google Sheet with headers and data...');
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      resource: {
        values: allRows
      }
    });

    // Format headers (make them bold)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 13
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true
                  },
                  backgroundColor: {
                    red: 0.9,
                    green: 0.9,
                    blue: 0.9
                  }
                }
              },
              fields: 'userEnteredFormat(textFormat,backgroundColor)'
            }
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 13
              }
            }
          }
        ]
      }
    });

    console.log('Sync completed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Sync completed successfully',
        updatedRows: updateResponse.data.updatedRows
      })
    };

  } catch (error) {
    console.error('Error in sync function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
}; 