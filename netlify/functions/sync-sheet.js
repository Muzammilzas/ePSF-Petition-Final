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

  try {
    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get all submissions from Supabase
    const { data: submissions, error } = await supabase
      .from('where_scams_thrive_submissions')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Initialize Google Sheets
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const SHEET_NAME = 'Where Scam Thrive';

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Clear existing data (except headers)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:M`,
    });

    // Prepare rows for Google Sheet
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

    if (rows.length > 0) {
      // Append all rows
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:M2`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: rows
        }
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Sync completed successfully',
        rowsSynced: rows.length
      })
    };

  } catch (error) {
    console.error('Sync error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Sync failed',
        details: error.message
      })
    };
  }
}; 