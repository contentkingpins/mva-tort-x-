/**
 * Utility functions for PingTree API integration
 */

// Pingtree API endpoint configuration
const PARTNER_ID = process.env.REACT_APP_PARTNER_ID || "B40i8"; // Your Partner ID from dashboard
const API_ENDPOINT = `https://api.pingtree.com/api/lead/add/${PARTNER_ID}`;
const SUBSCRIPTION_KEY = process.env.REACT_APP_SUBSCRIPTION_KEY || "ff55hh66kk77"; // From TortX
const CREATIVE_ID = process.env.REACT_APP_CREATIVE_ID || "CT1234"; // From dashboard
const BEARER_TOKEN = process.env.REACT_APP_PINGTREE_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvZmZlckNhbXBhaWduSWQiOiI2NmZjOWIxMjFkMDM2MmZhODRkZjhlNDQiLCJfaWQiOiI2NzJhZTRmZmFjNThjMWQ1NDIxMjU2YjUiLCJ0eXBlIjoiZm9ybSIsImlhdCI6MTczMDg2NDM5MH0.ZFikIf37APtQzum7eZmABLtIKG-s2OKnVSa92hBbq74";

// Check if we should simulate API responses (dev mode or explicit setting)
const SIMULATE_API = process.env.REACT_APP_SIMULATE_API === 'true' || process.env.NODE_ENV === 'development';

/**
 * Submit lead data to Pingtree API
 * @param {Object} formData - Form data to submit
 * @param {boolean} isTest - Whether this is a test submission
 * @returns {Promise<Object>} - The API response
 */
export const submitLeadToPingtree = async (formData, isTest = false) => {
  try {
    console.log("Submitting to Pingtree API with data:", formData);
    
    // Create a more reliable form data object
    const formUrlData = new URLSearchParams();
    
    // Required fields - ensure all required fields are present
    formUrlData.append("first_name", formData.firstName || "");
    formUrlData.append("last_name", formData.lastName || "");
    formUrlData.append("mobile", (formData.mobile || formData.phone || "").replace(/\D/g, ""));
    formUrlData.append("email", formData.email || "");
    formUrlData.append("incident_state", formData.incidentState || "TX"); // Default to TX if missing
    formUrlData.append("crid", CREATIVE_ID);
    formUrlData.append("channel", formData.channel || "Website");
    formUrlData.append("subscription_key", SUBSCRIPTION_KEY);
    formUrlData.append("source_id", formData.sourceId || `tortx_lead_${Date.now()}`);
    formUrlData.append("is_test", isTest ? "1" : "0");
    
    // For debugging - log the request body
    console.log("Pingtree API request payload:", Object.fromEntries(formUrlData));
    
    // If in simulation mode (development or explicit setting), return a successful response
    if (SIMULATE_API) {
      console.log('Simulation mode: Generating successful Pingtree API response');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        status: "success",
        data: {
          leadId: `LEAD-${Date.now()}`,
          message: "Lead successfully submitted (simulated)"
        }
      };
    }
    
    // For production, make the actual API request
    // The API expects application/x-www-form-urlencoded content
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Accept': 'application/json'
      },
      body: formUrlData
    });
    
    // Check for HTTP errors
    if (!response.ok) {
      let errorText;
      try {
        // Try to parse error as JSON
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        // If not JSON, get as text
        errorText = await response.text();
      }
      
      throw new Error(`Pingtree API returned ${response.status}: ${errorText}`);
    }
    
    // Parse the response
    let result;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      // If not JSON, handle as text
      const text = await response.text();
      try {
        // Try to parse as JSON anyway (some APIs send JSON with wrong content-type)
        result = JSON.parse(text);
      } catch (e) {
        // If parsing fails, use the text response
        result = { message: text };
      }
    }
    
    console.log('Pingtree API response:', result);
    
    return {
      status: "success",
      data: result
    };
  } catch (error) {
    console.error('Error submitting to Pingtree API:', error);
    
    // In development mode, still return success for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Converting error to success response');
      return {
        status: "success",
        data: {
          leadId: `LEAD-${Date.now()}`,
          message: "Lead successfully submitted (simulated despite error)"
        }
      };
    }
    
    return {
      status: "error",
      message: error.message
    };
  }
};

/**
 * Submit a qualified lead to Pingtree
 * @param {Object} qualificationFormData - Data from qualification form
 * @param {Object} contactFormData - Data from contact form
 * @param {boolean} isTest - Whether this is a test submission
 * @returns {Promise<Object>} - The API response
 */
export const submitQualifiedLead = async (qualificationFormData, contactFormData, isTest = false) => {
  try {
    // Combine and format data
    const combinedData = {
      ...qualificationFormData,
      ...contactFormData,
      sourceId: `tortx_lead_${Date.now()}`,
      incidentState: contactFormData.incidentState || qualificationFormData.incidentState || "TX",
      bearerToken: BEARER_TOKEN
    };
    
    // Format the date properly if it exists (MM/DD/YYYY format for Pingtree)
    if (combinedData.accidentDate) {
      const date = new Date(combinedData.accidentDate);
      if (!isNaN(date.getTime())) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        combinedData.incidentDate = `${month}/${day}/${year}`;
      }
    }
    
    // Submit to Pingtree API
    return await submitLeadToPingtree(combinedData, isTest);
  } catch (error) {
    console.error('Error in submitQualifiedLead:', error);
    return {
      status: "error",
      message: error.message
    };
  }
}; 