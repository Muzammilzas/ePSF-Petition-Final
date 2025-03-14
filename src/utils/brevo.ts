import axios from 'axios';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_LIST_ID = 5; // Sign Petition list ID

export const addContactToBrevoList = async (email: string, firstName: string, lastName: string) => {
  console.log('Starting Brevo contact addition...', { hasApiKey: !!BREVO_API_KEY });

  if (!BREVO_API_KEY) {
    console.error('Brevo API key is not configured');
    return;
  }

  const payload = {
    email,
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
    },
    listIds: [BREVO_LIST_ID],
    updateEnabled: true,
  };

  console.log('Sending request to Brevo:', { email, listId: BREVO_LIST_ID });

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/contacts',
      payload,
      {
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
      }
    );
    
    console.log('Brevo API response:', response.status, response.statusText);
    console.log('Contact added successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Brevo API error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    // Don't throw the error, just log it to prevent form submission from failing
    return null;
  }
}; 