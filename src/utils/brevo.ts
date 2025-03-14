import axios from 'axios';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_LIST_ID = 5; // "Sign Petition" list ID

console.log('Brevo Environment Check:', {
  hasApiKey: !!BREVO_API_KEY,
  apiKeyPrefix: BREVO_API_KEY ? BREVO_API_KEY.substring(0, 10) + '...' : 'missing',
  listId: BREVO_LIST_ID
});

export const addContactToBrevoList = async (
  email: string,
  firstName: string,
  lastName: string
): Promise<any> => {
  if (!BREVO_API_KEY) {
    console.error('Brevo API key is not configured');
    return null;
  }

  try {
    console.log('Sending request to Brevo API:', {
      email,
      firstName,
      lastName,
      listId: BREVO_LIST_ID
    });

    const response = await axios.post(
      'https://api.brevo.com/v3/contacts',
      {
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('Brevo API response:', {
      status: response.status,
      data: response.data
    });

    return response.data;
  } catch (error: any) {
    console.error('Brevo API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      endpoint: 'https://api.brevo.com/v3/contacts'
    });

    // Don't throw the error - return null to indicate failure
    return null;
  }
}; 