import { config } from 'dotenv';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

async function testGoogleSheets() {
  try {
    console.log('Testing Google Sheets connection...');
    
    // Verify environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is missing');
    }
    if (!process.env.GOOGLE_SPREADSHEET_ID) {
      throw new Error('GOOGLE_SPREADSHEET_ID is missing');
    }

    console.log('Environment variables present');

    // Parse service account credentials
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    console.log('Service account email:', serviceAccount.client_email);

    // Initialize auth
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Get spreadsheet info
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    console.log('Spreadsheet ID:', spreadsheetId);

    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId
    });

    console.log('Spreadsheet title:', sheetInfo.data.properties.title);
    console.log('Available sheets:', sheetInfo.data.sheets.map(sheet => sheet.properties.title));

    // First, check if headers exist
    const SHEET_NAME = 'Where Scam Thrive';
    const headers = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:L1`
    });

    // If no headers, add them
    if (!headers.data.values || headers.data.values.length === 0) {
      console.log('Adding headers to the sheet...');
      const headerRow = [
        [
          'Timestamp',
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
        ]
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A1:L1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: headerRow
        }
      });

      // Format headers (make them bold and freeze the row)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheetInfo.data.sheets[0].properties.sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 12
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
              updateSheetProperties: {
                properties: {
                  sheetId: sheetInfo.data.sheets[0].properties.sheetId,
                  gridProperties: {
                    frozenRowCount: 1
                  }
                },
                fields: 'gridProperties.frozenRowCount'
              }
            }
          ]
        }
      });

      console.log('Headers added and formatted successfully');
    }

    // Try to append a test row
    const now = new Date();
    const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    
    const dateStr = estDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const timeStr = estDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    });

    const testRow = [
      [
        dateStr,           // Date (EST)
        timeStr,           // Time (EST)
        'Test User',
        'test@example.com',
        'Yes',
        'Test City',
        'Test Region',
        'Test Country',
        '127.0.0.1',
        'Test Browser',
        'Desktop',
        '1920x1080',
        'UTC'
      ]
    ];

    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A2:M2`,  // Updated to include the new time column and start from A2
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: testRow
      }
    });

    console.log('Success! Row added:', {
      updatedRange: appendResponse.data.updates?.updatedRange,
      updatedRows: appendResponse.data.updates?.updatedRows,
      updatedColumns: appendResponse.data.updates?.updatedColumns
    });

  } catch (error) {
    console.error('Error:', {
      message: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
}

testGoogleSheets(); 