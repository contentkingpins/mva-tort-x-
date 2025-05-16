/**
 * Utility functions for PingTree API integration
 */

// Pingtree API endpoint configuration
const PARTNER_ID = 'B40i8';
const API_ENDPOINT = `https://api.pingtree.com/api/lead/add/${PARTNER_ID}`;
const SUBSCRIPTION_KEY = 'development_key';
const CREATIVE_ID = 'test_creative';
const BEARER_TOKEN = 'development_token';

// Always simulate API in development
const SIMULATE_API = process.env.NODE_ENV === 'development';

/**
 * Validates that all required environment variables are present
 * @returns {boolean} - Whether all required variables exist
 */
const validateEnvironmentVariables = () => {
  const required = [PARTNER_ID, SUBSCRIPTION_KEY, CREATIVE_ID, BEARER_TOKEN];
  return required.every(variable => variable !== undefined && variable !== null && variable !== '');
};

/**
 * Submit lead data to Pingtree API
 * @param {Object} formData - Form data to submit
 * @param {boolean} isTest - Whether this is a test submission
 * @returns {Promise<Object>} - The API response
 */
export const submitLeadToPingtree = async (formData, isTest = false) => {
  try {
    console.log("Submitting to Pingtree API with data:", formData);
    
    // Create form data object
    const formUrlData = new URLSearchParams();
    
    // Required fields
    formUrlData.append("first_name", formData.firstName || "");
    formUrlData.append("last_name", formData.lastName || "");
    formUrlData.append("mobile", (formData.mobile || formData.phone || "").replace(/\D/g, ""));
    formUrlData.append("email", formData.email || "");
    formUrlData.append("incident_state", formData.incidentState || "TX");
    formUrlData.append("crid", CREATIVE_ID);
    formUrlData.append("channel", formData.channel || "Website");
    formUrlData.append("subscription_key", SUBSCRIPTION_KEY);
    formUrlData.append("source_id", formData.sourceId || `tortx_lead_${Date.now()}`);
    formUrlData.append("is_test", isTest ? "1" : "0");
    
    // Optional fields
    if (formData.pubID) formUrlData.append("pubID", formData.pubID);
    if (formData.trustedFormCertURL) formUrlData.append("trustedFormCertURL", formData.trustedFormCertURL);
    
    console.log("Pingtree API request payload:", Object.fromEntries(formUrlData));
    
    // In development mode, simulate success
    if (SIMULATE_API) {
      console.log('Development mode: Simulating successful Pingtree API response');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        status: "success",
        data: {
          leadId: `LEAD-${Date.now()}`,
          message: "Lead successfully submitted (simulated)"
        }
      };
    }
    
    // Make the actual API request
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: formUrlData,
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Pingtree API returned ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Pingtree API response:', result);
    
    return {
      status: "success",
      data: result
    };
  } catch (error) {
    console.error('Error submitting to Pingtree API:', error);
    
    // In development, return success despite error
    if (SIMULATE_API) {
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
    const combinedData = {
      ...qualificationFormData,
      ...contactFormData,
      sourceId: `tortx_lead_${Date.now()}`,
      incidentState: contactFormData.incidentState || qualificationFormData.incidentState || "TX",
      trustedFormCertURL: contactFormData.trustedFormCertURL || qualificationFormData.trustedFormCertURL || null
    };
    
    if (combinedData.accidentDate) {
      const date = new Date(combinedData.accidentDate);
      if (!isNaN(date.getTime())) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        combinedData.incidentDate = `${month}/${day}/${year}`;
      }
    }
    
    return await submitLeadToPingtree(combinedData, isTest);
  } catch (error) {
    console.error('Error in submitQualifiedLead:', error);
    return {
      status: "error",
      message: error.message
    };
  }
}; 