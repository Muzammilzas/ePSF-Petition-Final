require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  console.log('Starting sync-spotting-exit-scams function...');
  
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

    // Get ALL submissions from Supabase (not just unsynced ones)
    console.log('Fetching all submissions from Supabase...');
    const { data: submissions, error: supabaseError } = await supabase
      .from('spotting_exit_scams_submissions')
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
    const SHEET_NAME = 'Spotting Exit Scams';

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // First, get all sheets to verify our target sheet exists
    console.log('Getting list of all sheets...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    const allSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
    console.log('Available sheets:', allSheets);

    if (!allSheets.includes(SHEET_NAME)) {
      throw new Error(`Sheet "${SHEET_NAME}" not found. Available sheets: ${allSheets.join(', ')}`);
    }

    // Get sheet ID
    const sheet = spreadsheet.data.sheets.find(s => s.properties.title === SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found in spreadsheet`);
    }

    // Clear existing data (except header)
    console.log('Clearing existing data...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:M`,
    });

    // Set up headers if sheet is empty
    const headers = [
      'Date',
      'Time',
      'Name',
      'Email',
      'Consent',
      'City',
      'Region',
      'Country',
      'IP Address',
      'Browser',
      'Device',
      'Resolution',
      'Timezone'
    ];

    // Check if headers exist
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:M1`,
    });

    if (!headerResponse.data.values) {
      // Add headers if they don't exist
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:M1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers]
        }
      });
    }

    // Prepare rows for sync
    console.log('Preparing rows for sync...');
    const rows = submissions.map(submission => {
      return [
        submission.created_date || 'N/A',
        submission.created_time || 'N/A',
        submission.full_name,
        submission.email,
        submission.newsletter_consent ? 'Yes' : 'No',
        submission.meta_details?.location?.city || 'N/A',
        submission.meta_details?.location?.region || 'N/A',
        submission.meta_details?.location?.country || 'N/A',
        submission.meta_details?.location?.ip_address || 'N/A',
        submission.meta_details?.device?.browser || 'N/A',
        submission.meta_details?.device?.device_type || 'N/A',
        submission.meta_details?.device?.screen_resolution || 'N/A',
        submission.meta_details?.device?.timezone || 'N/A'
      ];
    });

    if (rows.length > 0) {
      // Write all rows
      console.log('Writing rows to sheet...');
      await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:M${rows.length + 1}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows
      }
    });

      // Apply formatting
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            // Header formatting
            {
              repeatCell: {
                range: {
                  sheetId: sheet.properties.sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 13
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                    textFormat: { bold: true },
                    horizontalAlignment: 'CENTER',
                    verticalAlignment: 'MIDDLE'
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
              }
            },
            // Data cell formatting
            {
              repeatCell: {
                range: {
                  sheetId: sheet.properties.sheetId,
                  startRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 13
                },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: 'LEFT',
                    verticalAlignment: 'MIDDLE',
                    padding: { top: 2, right: 3, bottom: 2, left: 3 }
                  }
                },
                fields: 'userEnteredFormat(horizontalAlignment,verticalAlignment,padding)'
              }
            }
          ]
        }
      });
    }

    // Mark all submissions as synced
    console.log('Marking all submissions as synced...');
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('spotting_exit_scams_submissions')
      .update({ synced_at: now })
      .is('synced_at', null);

    if (updateError) {
      console.error('Error marking submissions as synced:', updateError);
      // Don't throw error here as the sync was successful
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Sync completed successfully',
        details: {
          totalSubmissions: submissions.length,
          syncedRows: rows.length
        }
      })
    };

  } catch (error) {
    console.error('Sync error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Sync failed',
        details: error.message,
        stack: error.stack
      })
    };
  }
}; 