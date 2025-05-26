require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  console.log('Starting sync-before-you-sign function...');
  
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

    // Get all submissions from Supabase (not just unsynced ones)
    console.log('Fetching all submissions from Supabase...');
    const { data: submissions, error: supabaseError } = await supabase
      .from('before_you_sign_submissions')
      .select('*')
      .order('created_date', { ascending: false })
      .order('created_time', { ascending: false });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    console.log('Raw submissions from database:', JSON.stringify(submissions, null, 2));

    if (!submissions || submissions.length === 0) {
      console.log('No submissions to sync');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'No submissions to sync',
          details: {
            totalSubmissions: 0,
            syncedRows: 0
          }
        })
      };
    }

    console.log(`Found ${submissions.length} total submissions`);

    // Initialize Google Sheets
    console.log('Initializing Google Sheets client...');
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const SHEET_NAME = 'Before You Sign';

    console.log('Service account email:', serviceAccount.client_email);
    console.log('Spreadsheet ID:', SPREADSHEET_ID);
    console.log('Sheet name:', SHEET_NAME);

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
    const sheetId = sheet.properties.sheetId;

    // Clear entire sheet including headers
    console.log('Clearing sheet...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:M`,
    });

    // Define headers
    const headers = [
      'Date',
      'Time',
      'Full Name',
      'Email',
      'Newsletter Consent',
      'City',
      'Region',
      'Country',
      'IP Address',
      'Browser',
      'Device Type',
      'Screen Resolution',
      'Timezone'
    ];

    // Prepare all rows starting with headers
    console.log('Preparing rows for sync...');
    const rows = [
      headers,
      ...submissions.map(submission => {
        console.log('Processing submission:', submission);
        
        // Use created_date directly
        const dateStr = submission.created_date || new Date(submission.created_at).toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        // Use created_time directly or format from created_at
        const timeStr = submission.created_time || new Date(submission.created_at).toLocaleString('en-US', {
          timeZone: 'America/New_York',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });

        const row = [
          dateStr,
          timeStr,
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

        console.log('Generated row:', row);
        return row;
      })
    ];

    console.log(`Prepared ${rows.length} rows for sync (including headers)`);
    console.log('All rows:', JSON.stringify(rows, null, 2));

    // Update with all rows including headers
    console.log('Updating sheet with all data...');
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:M`,
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
          syncedRows: rows.length - 1 // Subtract 1 to not count headers
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