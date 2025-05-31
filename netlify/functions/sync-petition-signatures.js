require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  console.log('Starting sync-petition-signatures function...');
  
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

    // Get all signatures with metadata
    console.log('Fetching all signatures from Supabase...');
    const { data: signatures, error: supabaseError } = await supabase
      .from('signatures')
      .select('*')
      .order('created_date', { ascending: false })
      .order('created_time', { ascending: false });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    console.log(`Found ${signatures?.length || 0} total signatures`);
    console.log('First signature data:', JSON.stringify(signatures?.[0], null, 2));

    // Initialize Google Sheets
    console.log('Initializing Google Sheets client...');
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const SHEET_NAME = 'Petition Signatures';

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
      'Timeshare Name',
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

    // Function to format time
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      try {
        // Split time into components
        const [hours24, minutes, secondsWithMS] = timeStr.split(':');
        const seconds = secondsWithMS.split('.')[0];  // Remove milliseconds
        
        // Convert to 12-hour format with AM/PM
        let hours = parseInt(hours24);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        // Format with leading zeros and AM/PM
        return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
      } catch (error) {
        console.error('Error formatting time:', error);
        return timeStr; // Return original if parsing fails
      }
    };

    // Prepare the data rows
    const dataRows = signatures ? signatures.map(signature => {
      // Get metadata directly from meta_details column
      const metadata = signature.meta_details || {};
      
      console.log('Processing signature:', {
        id: signature.id,
        hasMetadata: !!metadata,
        metadata: JSON.stringify(metadata, null, 2)
      });

      // Extract location and device info
      const location = metadata.location || {};
      const device = metadata.device || {};
      
      return [
        signature.created_date || '',  // Date
        formatTime(signature.created_time) || '',  // Time (12-hour format with AM/PM)
        `${signature.first_name} ${signature.last_name}` || '',  // name
        signature.email || '',         // Email
        signature.timeshare_name || '', // Timeshare Name
        'Yes',                        // Consent (always Yes for petition signatures)
        location.city || 'Unknown',    // City
        location.region || 'Unknown',  // Region
        location.country || 'Unknown', // Country
        location.ip_address || 'Unknown', // Ip Address
        device.browser || 'Unknown',   // Browser
        device.device_type || 'Unknown', // Device
        device.screen_resolution || 'Unknown', // Resolution
        device.timezone || 'Unknown'   // Timezone
      ];
    }) : [];

    // Debug log the first few rows
    console.log('First few rows to be written:', JSON.stringify(dataRows.slice(0, 3), null, 2));

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