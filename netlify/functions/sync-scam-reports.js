require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  console.log('Starting sync-scam-reports function...');
  
  if (event.httpMethod !== 'POST') {
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

    // Get all scam reports with their related data
    console.log('Fetching scam reports from Supabase...');
    const { data: reports, error: reportsError } = await supabase
      .from('scam_reports')
      .select(`
        *,
        scam_types (*),
        contact_methods (*),
        scam_report_metadata (*)
      `)
      .order('created_at', { ascending: true });

    if (reportsError) {
      console.error('Supabase error:', reportsError);
      throw new Error(`Supabase error: ${reportsError.message}`);
    }

    console.log(`Found ${reports?.length || 0} scam reports in Supabase`);

    // Initialize Google Sheets
    console.log('Initializing Google Sheets client...');
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const SHEET_NAME = 'Timeshare Scam Reports';

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Verify spreadsheet access and get sheet ID
    console.log('Verifying spreadsheet access...');
    let sheetId;
    try {
      const sheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
      });

      // Check if our sheet exists and get its ID
      const sheet = sheetInfo.data.sheets.find(s => s.properties.title === SHEET_NAME);
      if (!sheet) {
        throw new Error(`Sheet "${SHEET_NAME}" not found in spreadsheet`);
      }
      sheetId = sheet.properties.sheetId;
    } catch (sheetError) {
      console.error('Failed to access spreadsheet:', sheetError);
      throw new Error(`Google Sheets access error: ${sheetError.message}`);
    }

    // Clear existing data (except headers)
    console.log('Clearing existing data...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:Z`,
    });

    // Prepare rows for Google Sheet
    console.log('Preparing rows for sync...');
    const rows = reports.map(report => {
      const metadata = report.scam_report_metadata?.[0] || {};
      const scamTypes = report.scam_types || [];
      const contactMethods = report.contact_methods || [];

      const estDate = new Date(report.created_at);
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

      // Get scam types
      const hasScamType = (type) => scamTypes.some(st => st.scam_type === type);
      const getScamTypeDetails = (type) => scamTypes.find(st => st.scam_type === type);

      return [
        dateStr, // Date Reported
        timeStr, // Time Reported
        report.reporter_name || 'N/A',
        report.reporter_email || 'N/A',
        report.reporter_phone || 'N/A',
        `${report.reporter_city}, ${report.reporter_state}`,
        report.reporter_age_range || 'N/A',
        report.preferred_contact || 'N/A',
        report.speak_with_team ? 'Yes' : 'No',
        report.share_anonymously ? 'Yes' : 'No',
        report.scammer_name || 'N/A',
        report.company_name || 'N/A',
        report.scammer_phone || 'N/A',
        report.scammer_email || 'N/A',
        report.scammer_website || 'N/A',
        report.money_lost ? 'Yes' : 'No',
        report.amount_lost ? `$${report.amount_lost.toFixed(2)}` : 'N/A',
        new Date(report.date_occurred).toLocaleDateString('en-US', {
          timeZone: 'America/New_York'
        }),
        report.reported_elsewhere ? 'Yes' : 'No',
        report.reported_to || 'N/A',
        // Scam Types
        hasScamType('fake_resale') ? 'Yes' : 'No',
        getScamTypeDetails('fake_resale')?.claimed_sale_amount ? `$${getScamTypeDetails('fake_resale').claimed_sale_amount.toFixed(2)}` : 'N/A',
        hasScamType('upfront_fees') ? 'Yes' : 'No',
        getScamTypeDetails('upfront_fees')?.amount ? `$${getScamTypeDetails('upfront_fees').amount.toFixed(2)}` : 'N/A',
        getScamTypeDetails('upfront_fees')?.promised_services || 'N/A',
        hasScamType('high_pressure_sales') ? 'Yes' : 'No',
        getScamTypeDetails('high_pressure_sales')?.tactics || 'N/A',
        getScamTypeDetails('high_pressure_sales')?.limited_time_or_threat ? 'Yes' : 'No',
        hasScamType('refund_exit') ? 'Yes' : 'No',
        getScamTypeDetails('refund_exit')?.promised_refund || 'N/A',
        getScamTypeDetails('refund_exit')?.contacted_after_other_company ? 'Yes' : 'No',
        hasScamType('other') ? 'Yes' : 'No',
        getScamTypeDetails('other')?.description || 'N/A',
        // Meta Details
        metadata.browser || 'N/A',
        metadata.device_type || 'N/A',
        metadata.screen_resolution || 'N/A',
        metadata.timezone || 'N/A',
        metadata.language || 'N/A',
        metadata.ip_address || 'N/A',
        metadata.city ? `${metadata.city}, ${metadata.region}, ${metadata.country}` : 'N/A',
        metadata.latitude && metadata.longitude ? `${metadata.latitude}, ${metadata.longitude}` : 'N/A'
      ];
    });

    if (rows.length > 0) {
      // Format date and time columns
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 1
                },
                cell: {
                  userEnteredFormat: {
                    numberFormat: {
                      type: 'DATE',
                      pattern: 'MM/dd/yyyy'
                    }
                  }
                },
                fields: 'userEnteredFormat.numberFormat'
              }
            },
            {
              repeatCell: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 1,
                  startColumnIndex: 1,
                  endColumnIndex: 2
                },
                cell: {
                  userEnteredFormat: {
                    numberFormat: {
                      type: 'TIME',
                      pattern: 'hh:mm:ss AM/PM'
                    }
                  }
                },
                fields: 'userEnteredFormat.numberFormat'
              }
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: sheetId,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: 40
                }
              }
            }
          ]
        }
      });

      // Append all rows
      console.log('Appending rows to sheet...');
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:AN`,
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
          totalReports: reports.length,
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
        details: error.message
      })
    };
  }
}; 