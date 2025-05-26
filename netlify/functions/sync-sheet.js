require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  console.log('Starting sync-sheet function...');
  
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
    const requiredEnvVars = {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      GOOGLE_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
      GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID
    };

    // Check each environment variable
    Object.entries(requiredEnvVars).forEach(([key, value]) => {
      if (!value) {
        throw new Error(`${key} is missing`);
      }
      // Log first few characters of each env var to verify they're not empty
      console.log(`${key} exists and starts with: ${value.substring(0, 10)}...`);
    });

    // Validate Google service account JSON
    try {
      const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      if (!serviceAccount.client_email || !serviceAccount.private_key) {
        throw new Error('Invalid Google service account credentials - missing required fields');
      }
      console.log('Google service account JSON is valid');
    } catch (parseError) {
      throw new Error(`Invalid Google service account JSON: ${parseError.message}`);
    }

    console.log('Environment variables verified');

    // Initialize Supabase with additional options
    console.log('Initializing Supabase client...');
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Test Supabase connection
    console.log('Testing Supabase connection...');
    try {
      const { data: testData, error: testError } = await supabase
        .from('where_scams_thrive_submissions')
        .select('count');

      if (testError) {
        throw new Error(`Supabase connection test failed: ${testError.message}`);
      }
      console.log('Supabase connection test successful');
    } catch (testError) {
      console.error('Supabase connection test error:', testError);
      throw new Error(`Failed to connect to Supabase: ${testError.message}`);
    }

    // Get all submissions from Supabase (not just unsynced ones)
    console.log('Fetching all submissions from Supabase...');
    const { data: submissions, error: supabaseError } = await supabase
      .from('where_scams_thrive_submissions')
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
    const SHEET_NAME = 'Where Scam Thrive';

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // First, clear existing data (except header)
    console.log('Clearing existing data...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:M`,
    });

    // Get sheet ID for formatting
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    const sheet = spreadsheet.data.sheets.find(s => s.properties.title === SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found in spreadsheet`);
    }

    // Prepare all rows
    console.log('Preparing rows for sync...');
    const rows = submissions.map(submission => {
      // Use created_date directly
      const dateStr = submission.created_date || 'N/A';

      // Use created_time directly (it's already in HH:MM:SS format)
      const timeStr = submission.created_time || 'N/A';

      return [
        dateStr,
        timeStr,
        submission.full_name,
        submission.email,
        submission.newsletter_consent ? 'Yes' : 'No',
        submission.meta_details?.city || 'N/A',
        submission.meta_details?.region || 'N/A',
        submission.meta_details?.country || 'N/A',
        submission.meta_details?.ip_address || 'N/A',
        submission.meta_details?.browser || 'N/A',
        submission.meta_details?.device_type || 'N/A',
        submission.meta_details?.screen_resolution || 'N/A',
        submission.meta_details?.timezone || 'N/A'
      ];
    });

    console.log(`Prepared ${rows.length} rows for sync`);

    // Update with all rows
    console.log('Updating sheet with all data...');
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:M`,
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

    console.log('Sync completed successfully');
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
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}; 