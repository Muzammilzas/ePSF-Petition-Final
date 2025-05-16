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

    // Get unsynced submissions from Supabase
    console.log('Fetching unsynced submissions from Supabase...');
    const { data: submissions, error: supabaseError } = await supabase
      .from('before_you_sign_submissions')
      .select('*')
      .is('synced_at', null)
      .order('created_at', { ascending: true });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    if (!submissions || submissions.length === 0) {
      console.log('No new submissions to sync');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'No new submissions to sync',
          details: {
            totalSubmissions: 0,
            syncedRows: 0
          }
        })
      };
    }

    console.log(`Found ${submissions.length} unsynced submissions`);

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

    // Prepare all rows
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

    // Append all rows
    console.log('Appending rows to sheet...');
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:M`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: rows
      }
    });

    console.log('Append response:', appendResponse.data);

    // Mark submissions as synced
    console.log('Marking submissions as synced...');
    const now = new Date().toISOString();
    const submissionIds = submissions.map(s => s.id);
    
    const { error: updateError } = await supabase
      .from('before_you_sign_submissions')
      .update({ synced_at: now })
      .in('id', submissionIds);

    if (updateError) {
      console.error('Error marking submissions as synced:', updateError);
      throw new Error(`Failed to mark submissions as synced: ${updateError.message}`);
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