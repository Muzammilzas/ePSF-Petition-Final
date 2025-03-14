import axios from 'axios';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_LIST_ID = 5; // Sign Petition list ID

export const addContactToBrevoList = async (email: string, firstName: string, lastName: string) => {
  console.log('Starting Brevo contact addition...');

  if (!BREVO_API_KEY) {
    console.error('Brevo API key is not configured');
    return null;
  }

  const apiInstance = axios.create({
    baseURL: 'https://api.brevo.com/v3',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY.trim()
    }
  });

  try {
    // First, create or update the contact
    const contactResponse = await apiInstance.post('/contacts', {
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName
      },
      listIds: [BREVO_LIST_ID],
      updateEnabled: true
    });

    if (contactResponse.data) {
      console.log('Contact added/updated successfully in Brevo');
      
      // Optionally, verify the contact was added to the list
      const contactData = await apiInstance.get(`/contacts/${email}`);
      console.log('Contact details:', contactData.data);
      
      return contactResponse.data;
    }
    return null;
  } catch (error: any) {
    console.error('Brevo API error:', {
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      code: error?.response?.data?.code
    });
    return null;
  }
}; 