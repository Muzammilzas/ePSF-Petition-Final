import axios from 'axios';

const BREVO_API_KEY = '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';
const BREVO_LIST_ID = 5;

export const addContactToBrevoList = async (email: string, firstName: string, lastName: string) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/contacts',
      {
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true, // This will update the contact if it already exists
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
      }
    );
    
    console.log('Contact added to Brevo list:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding contact to Brevo list:', error);
    throw error;
  }
}; 