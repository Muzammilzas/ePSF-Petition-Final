import axios from 'axios';

// Use the hardcoded API key directly since we're having environment variable issues
const BREVO_API_KEY = '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';
const BREVO_LIST_ID = 5; // "Sign Petition" list ID

console.log('Brevo Environment Check:', {
  hasApiKey: !!BREVO_API_KEY,
  listId: BREVO_LIST_ID
});

export const addContactToBrevoList = async (
  email: string,
  firstName: string,
  lastName: string,
  timeshareName: string
): Promise<any> => {
  try {
    console.log('Sending request to Brevo API:', {
      email,
      firstName,
      lastName,
      timeshareName,
      listId: BREVO_LIST_ID
    });

    // Create the contact first
    const createContactResponse = await axios.post(
      'https://api.brevo.com/v3/contacts',
      {
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          TIMESHARE_NAME: timeshareName
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

    console.log('Brevo API create contact response:', {
      status: createContactResponse.status,
      data: createContactResponse.data
    });

    // If the contact already exists, try to update it
    if (createContactResponse.status === 201 || createContactResponse.status === 204) {
      // Add contact to list explicitly
      const addToListResponse = await axios.post(
        `https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}/contacts/add`,
        {
          emails: [email]
        },
        {
          headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Brevo API add to list response:', {
        status: addToListResponse.status,
        data: addToListResponse.data
      });
    }

    return createContactResponse.data;
  } catch (error: any) {
    console.error('Brevo API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      endpoint: 'https://api.brevo.com/v3/contacts',
      requestData: {
        email,
        firstName,
        lastName,
        timeshareName,
        listId: BREVO_LIST_ID
      }
    });

    // If the contact already exists (409 Conflict), try to update it
    if (error.response?.status === 409) {
      try {
        console.log('Contact already exists, attempting to update...');
        
        // Update existing contact
        const updateResponse = await axios.put(
          `https://api.brevo.com/v3/contacts/${email}`,
          {
            attributes: {
              FIRSTNAME: firstName,
              LASTNAME: lastName,
              TIMESHARE_NAME: timeshareName
            },
            listIds: [BREVO_LIST_ID]
          },
          {
            headers: {
              'api-key': BREVO_API_KEY,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        console.log('Brevo API update response:', {
          status: updateResponse.status,
          data: updateResponse.data
        });

        return updateResponse.data;
      } catch (updateError: any) {
        console.error('Brevo API update error:', {
          message: updateError.message,
          response: updateError.response?.data,
          status: updateError.response?.status
        });
      }
    }

    return null;
  }
}; 