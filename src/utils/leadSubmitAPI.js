/**
 * Lead submission API utilities
 */

// API Gateway endpoint for lead submissions
const API_ENDPOINT = process.env.REACT_APP_LEAD_API_ENDPOINT || 'https://[YOUR-API-ID].execute-api.[REGION].amazonaws.com/prod/leads';

/**
 * Submit lead data to our backend API
 * @param {Object} formData - Complete form data to submit
 * @returns {Promise<Object>} - API response
 */
export const submitLeadToBackend = async (formData) => {
  try {
    console.log('Submitting lead to backend:', formData);
    
    // Make API request
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    // Check for HTTP errors
    if (!response.ok) {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        errorText = await response.text();
      }
      
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    
    // Parse the response
    const result = await response.json();
    console.log('Backend API response:', result);
    
    return {
      status: "success",
      data: result
    };
  } catch (error) {
    console.error('Error submitting to backend API:', error);
    
    // In development mode, return a simulated success for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Simulating successful backend response');
      return {
        status: "success",
        data: {
          lead_id: `LEAD-${Date.now()}`,
          message: "Lead successfully submitted (simulated)"
        }
      };
    }
    
    return {
      status: "error",
      message: error.message
    };
  }
}; 