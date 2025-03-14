import axios from 'axios';

// API Configuration
const config = {
  apiKey: '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',
  listId: 5,
  apiUrl: 'https://api.brevo.com/v3'
};

// Debug configuration
console.log('Brevo Configuration Check:', {
  hasApiKey: !!config.apiKey,
  listId: config.listId,
  environment: import.meta.env.MODE // This will show if we're in development or production
});

export const addContactToBrevoList = async (
  email: string,
  firstName: string,
  lastName: string,
  timeshareName: string
): Promise<any> => {
  try {
    // Debug request
    console.log('Initiating Brevo API request:', {
      email,
      firstName,
      lastName,
      timeshareName,
      listId: config.listId,
      environment: import.meta.env.MODE
    });

    // Common headers
    const headers = {
      'api-key': config.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, PUT',
      'Access-Control-Allow-Headers': 'Content-Type, api-key'
    };

    // Step 1: Create or update contact
    const contactPayload = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        TIMESHARE_NAME: timeshareName
      },
      listIds: [config.listId],
      updateEnabled: true
    };

    // Try to create the contact
    const createResponse = await axios.post(
      `${config.apiUrl}/contacts`,
      contactPayload,
      { headers }
    );

    console.log('Contact creation response:', {
      status: createResponse.status,
      data: createResponse.data
    });

    // Step 2: Ensure contact is in the list
    const addToListResponse = await axios.post(
      `${config.apiUrl}/contacts/lists/${config.listId}/contacts/add`,
      { emails: [email] },
      { headers }
    );

    console.log('Add to list response:', {
      status: addToListResponse.status,
      data: addToListResponse.data
    });

    return { success: true, data: createResponse.data };

  } catch (error: any) {
    // If contact exists, try updating
    if (error.response?.status === 409) {
      try {
        console.log('Contact exists, updating...');
        const updateResponse = await axios.put(
          `${config.apiUrl}/contacts/${encodeURIComponent(email)}`,
          {
            attributes: {
              FIRSTNAME: firstName,
              LASTNAME: lastName,
              TIMESHARE_NAME: timeshareName
            },
            listIds: [config.listId]
          },
          {
            headers: {
              'api-key': config.apiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Update response:', {
          status: updateResponse.status,
          data: updateResponse.data
        });

        // Add to list after update
        await axios.post(
          `${config.apiUrl}/contacts/lists/${config.listId}/contacts/add`,
          { emails: [email] },
          {
            headers: {
              'api-key': config.apiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        return { success: true, data: updateResponse.data };
      } catch (updateError: any) {
        console.error('Update failed:', {
          status: updateError.response?.status,
          data: updateError.response?.data
        });
      }
    }

    // Log detailed error information
    console.error('Brevo API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });

    return {
      success: false,
      error: {
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      }
    };
  }
}; 