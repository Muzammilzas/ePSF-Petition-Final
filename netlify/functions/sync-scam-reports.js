require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  console.log('Starting sync-scam-reports function...');
  
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
      .from('scam_reports')
      .select(`
        *,
        scam_types (
          id,
          scam_type,
          claimed_sale_amount,
          amount,
          promised_services,
          tactics,
          limited_time_or_threat,
          promised_refund,
          contacted_after_other_company,
          description
        ),
        contact_methods (
          id,
          method,
          phone_number,
          email_address,
          social_media_platform,
          social_media_profile,
          location,
          event_type
        ),
        meta_details:scam_report_metadata (
          browser,
          device_type,
          timezone,
          language,
          city,
          region,
          country,
          ip_address,
          latitude,
          longitude
        )
      `)
      .order('created_date', { ascending: false })
      .order('created_time', { ascending: false });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    // Initialize Google Sheets
    console.log('Initializing Google Sheets client...');
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const SHEET_NAME = 'Timeshare Scam Reports';

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

    // Clear the entire sheet
    console.log('Clearing existing data...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:AH`,
    });

    // Define headers
    const headers = [
      'Date',
      'Time',
      'Reporter Name',
      'Reporter Email',
      'Reporter City',
      'Reporter State',
      'Reporter Age Range',
      'Willing to Speak',
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
      'Browser',
      'Device Type',
      'Timezone',
      'Language',
      'City',
      'Region',
      'Country',
      'IP Address',
      'Latitude',
      'Longitude',
      'Scam Types',
      'Contact Methods'
    ];

    // Always write headers
    console.log('Writing headers...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers]
      }
    });

    // Apply header formatting
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          // Header formatting
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
                  backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                  textFormat: { bold: true },
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
            }
          },
          // Auto-resize columns
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

    // If there are no submissions, return after writing headers
    if (!submissions || submissions.length === 0) {
      console.log('No submissions found, leaving sheet with headers only');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Sync completed successfully - no data to sync',
          details: {
            totalSubmissions: 0,
            syncedRows: 0,
            spreadsheetId: SPREADSHEET_ID,
            sheetName: SHEET_NAME
          }
        })
      };
    }

    // Function to format time
    const formatTime = (time) => {
      if (!time) return '';
      try {
        // Convert 24-hour time to 12-hour format with AM/PM
        const [hours, minutes, seconds] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm} EST`;
      } catch (error) {
        console.error('Error formatting time:', error);
        return '';
      }
    };

    // Function to format date
    const formatDate = (date) => {
      if (!date) return '';
      try {
        // Date is already in MM/DD/YYYY format
        return date;
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };

    // Format data for Google Sheets
    const formattedData = submissions.map(report => {
      const scamTypes = report.scam_types || [];
      const contactMethods = report.contact_methods || [];
      const metadata = report.meta_details?.[0] || {};
      
      const scamTypesList = scamTypes.map(st => st.scam_type).join(', ');
      const contactMethodsList = contactMethods.map(cm => cm.method).join(', ');

      return [
        formatDate(report.created_date),
        formatTime(report.created_time),
        report.reporter_name || 'N/A',
        report.reporter_email || 'N/A',
        report.reporter_city || 'N/A',
        report.reporter_state || 'N/A',
        report.reporter_age_range || 'N/A',
        report.speak_with_team ? 'Yes' : 'No',
        report.share_anonymously ? 'Yes' : 'No',
        report.money_lost ? 'Yes' : 'No',
        report.amount_lost ? `$${report.amount_lost}` : 'N/A',
        report.date_occurred || 'N/A',
        report.scammer_name || 'N/A',
        report.company_name || 'N/A',
        report.scammer_phone || 'N/A',
        report.scammer_email || 'N/A',
        report.scammer_website || 'N/A',
        report.reported_elsewhere ? 'Yes' : 'No',
        report.reported_to || 'N/A',
        report.want_updates ? 'Yes' : 'No',
        report.evidence_file_url || 'N/A',
        metadata.browser || 'N/A',
        metadata.device_type || 'N/A',
        metadata.timezone || 'N/A',
        metadata.language || 'N/A',
        metadata.city || 'N/A',
        metadata.region || 'N/A',
        metadata.country || 'N/A',
        metadata.ip_address || 'N/A',
        metadata.latitude || 'N/A',
        metadata.longitude || 'N/A',
        scamTypesList || 'N/A',
        contactMethodsList || 'N/A'
      ];
    });

    // Write data if we have submissions
    if (formattedData.length > 0) {
      console.log('Writing data...');
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: formattedData
        }
      });

      // Apply data formatting
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            // Data cell formatting
            {
              repeatCell: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: headers.length
                },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: 'LEFT',
                    verticalAlignment: 'MIDDLE',
                    padding: { top: 2, right: 3, bottom: 2, left: 3 },
                    wrapStrategy: 'WRAP'
                  }
                },
                fields: 'userEnteredFormat(horizontalAlignment,verticalAlignment,padding,wrapStrategy)'
              }
            }
          ]
        }
      });
    }

    console.log('Sync completed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Sync completed successfully',
        details: {
          totalSubmissions: submissions.length,
          syncedRows: formattedData.length,
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