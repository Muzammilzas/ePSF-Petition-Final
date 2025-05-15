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
    console.log('Fetching submissions from Supabase...');
    const { data: submissions, error: supabaseError } = await supabase
      .from('where_scams_thrive_submissions')
      .select('*')
      .order('created_at', { ascending: true });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    console.log(`Found ${submissions?.length || 0} submissions in Supabase`);

    // Initialize Google Sheets
    console.log('Initializing Google Sheets client...');
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const SHEET_NAME = 'Where Scam Thrive';

    console.log('Service account email:', serviceAccount.client_email);
    console.log('Spreadsheet ID:', SPREADSHEET_ID);
    console.log('Sheet name:', SHEET_NAME);

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Verify spreadsheet access
    console.log('Verifying spreadsheet access...');
    try {
      const sheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
      });
      console.log('Spreadsheet title:', sheetInfo.data.properties.title);
      console.log('Available sheets:', sheetInfo.data.sheets.map(sheet => sheet.properties.title));

      // Check if our sheet exists
      const sheetExists = sheetInfo.data.sheets.some(sheet => sheet.properties.title === SHEET_NAME);
      if (!sheetExists) {
        throw new Error(`Sheet "${SHEET_NAME}" not found in spreadsheet`);
      }
    } catch (sheetError) {
      console.error('Failed to access spreadsheet:', sheetError);
      throw new Error(`Google Sheets access error: ${sheetError.message}`);
    }

    // Clear existing data (except headers)
    console.log('Clearing existing data...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:M`,
    });

    // Prepare rows for Google Sheet
    console.log('Preparing rows for sync...');
    const rows = submissions.map(submission => {
      const estDate = new Date(submission.created_at);
      
      const dateStr = estDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'America/New_York'
      });
      
      const timeStr = estDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      });

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

    if (rows.length > 0) {
      // Append all rows
      console.log('Appending rows to sheet...');
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:M2`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: rows
        }
      });

      console.log('Append response:', appendResponse.data);
    }

    console.log('Sync completed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Sync completed successfully',
        details: {
          totalSubmissions: submissions.length,
          syncedRows: rows.length,
          spreadsheetId: SPREADSHEET_ID,
          sheetName: SHEET_NAME
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