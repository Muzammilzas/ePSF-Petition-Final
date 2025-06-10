const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  console.log('Starting sync-scam-report-form function...');
  
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

    // Get all scam reports with their related data
    console.log('Fetching scam reports from Supabase...');
    const { data: reports, error: reportsError } = await supabase
      .from('scam_reports')
      .select(`
        *,
        scam_types (*),
        contact_methods (*)
      `)
      .order('created_at', { ascending: false });

    if (reportsError) {
      console.error('Supabase error:', reportsError);
      throw new Error(`Failed to fetch scam reports: ${reportsError.message}`);
    }

    console.log(`Found ${reports?.length || 0} total reports`);

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

    // Clear the entire sheet including headers
    console.log('Clearing existing data...');
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:Z`,
      });
    } catch (clearError) {
      console.error('Error clearing sheet:', clearError);
      throw new Error(`Failed to clear sheet: ${clearError.message}`);
    }

    // Define headers
    const headers = [
      'Date',
      'Time',
      'Reporter Name',
      'Email',
      'City',
      'State',
      'Age Range',
      'Speak with Team',
      'Share Anonymously',
      'Money Lost',
      'Amount Lost',
      'Date Occurred',
      'Scammer Name',
      'Company Name',
      'Scammer Phone',
      'Scammer Email',
      'Scammer Website',
      'Reported Elsewhere',
      'Reported To',
      'Want Updates',
      'Evidence URL',
      'Scam Types',
      'Contact Methods',
      'Meta Details'
    ];

    // Function to format time
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
      } catch (error) {
        console.error('Error formatting time:', error);
        return '';
      }
    };

    // Function to format date
    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };

    // Prepare the data rows
    const dataRows = reports ? reports.map(report => {
      // Format scam types
      const scamTypes = report.scam_types?.map(type => {
        let details = `${type.scam_type}`;
        if (type.claimed_sale_amount) details += ` (claimed: $${type.claimed_sale_amount})`;
        if (type.amount) details += ` (amount: $${type.amount})`;
        if (type.promised_services) details += ` (services: ${type.promised_services})`;
        if (type.tactics) details += ` (tactics: ${type.tactics})`;
        if (type.promised_refund) details += ` (refund: ${type.promised_refund})`;
        if (type.description) details += ` (desc: ${type.description})`;
        return details;
      }).join('; ') || '';

      // Format contact methods
      const contactMethods = report.contact_methods?.map(method => {
        let details = `${method.method}`;
        if (method.phone_number) details += `: ${method.phone_number}`;
        if (method.email_address) details += `: ${method.email_address}`;
        if (method.social_media_platform) details += `: ${method.social_media_platform}`;
        if (method.social_media_profile) details += ` (${method.social_media_profile})`;
        if (method.location) details += `: ${method.location}`;
        if (method.event_type) details += ` (${method.event_type})`;
        return details;
      }).join('; ') || '';
      
      return [
        formatDate(report.created_at),
        formatTime(report.created_at),
        report.reporter_name || '',
        report.reporter_email || '',
        report.reporter_city || '',
        report.reporter_state || '',
        report.reporter_age_range || '',
        report.speak_with_team ? 'Yes' : 'No',
        report.share_anonymously ? 'Yes' : 'No',
        report.money_lost ? 'Yes' : 'No',
        report.amount_lost ? `$${report.amount_lost}` : '',
        report.date_occurred || '',
        report.scammer_name || '',
        report.company_name || '',
        report.scammer_phone || '',
        report.scammer_email || '',
        report.scammer_website || '',
        report.reported_elsewhere ? 'Yes' : 'No',
        report.reported_to || '',
        report.want_updates ? 'Yes' : 'No',
        report.evidence_file_url || '',
        scamTypes,
        contactMethods,
        JSON.stringify(report.meta_details || {})
      ];
    }) : [];

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

    // Format headers and auto-resize columns
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: headers.length
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
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: headers.length
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