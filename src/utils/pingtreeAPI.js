/**
 * Utility functions for PingTree API integration
 */

// Pingtree API endpoint configuration
const PARTNER_ID = "B40i8"; // Your Partner ID from dashboard
const API_ENDPOINT = `https://api.pingtree.com/api/lead/add/${PARTNER_ID}`;
const SUBSCRIPTION_KEY = "ff55hh66kk77"; // Replace with actual key from TortX
const CREATIVE_ID = "CT1234"; // Replace with actual CRID from dashboard

/**
 * Submit lead data to Pingtree API
 * @param {Object} formData - Form data to submit
 * @param {boolean} isTest - Whether this is a test submission
 * @returns {Promise<Object>} - The API response
 */
export const submitLeadToPingtree = async (formData, isTest = false) => {
  try {
    // Create form data object for the request
    const formUrlData = new URLSearchParams();
    
    // Required fields
    formUrlData.append("first_name", formData.firstName || "");
    formUrlData.append("last_name", formData.lastName || "");
    formUrlData.append("mobile", formData.phone?.replace(/\D/g, "") || "");
    formUrlData.append("email", formData.email || "");
    formUrlData.append("incident_state", formData.incidentState || "");
    formUrlData.append("crid", CREATIVE_ID);
    formUrlData.append("channel", "Website"); // Default channel
    formUrlData.append("subscription_key", SUBSCRIPTION_KEY);
    formUrlData.append("source_id", formData.sourceId || `tortx_lead_${Date.now()}`);
    formUrlData.append("is_test", isTest ? "1" : "0");
    
    // Make the API request
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${formData.bearerToken || process.env.REACT_APP_PINGTREE_TOKEN}`
      },
      body: formUrlData
    });
    
    // Check for successful response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pingtree API returned ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Pingtree API response:', result);
    
    return {
      status: "success",
      data: result
    };
  } catch (error) {
    console.error('Error submitting to Pingtree API:', error);
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
    // Combine form data
    const combinedData = {
      ...qualificationFormData,
      ...contactFormData,
      sourceId: `tortx_lead_${Date.now()}`,
      bearerToken: process.env.REACT_APP_PINGTREE_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvZmZlckNhbXBhaWduSWQiOiI2NmZjOWIxMjFkMDM2MmZhODRkZjhlNDQiLCJfaWQiOiI2NzJhZTRmZmFjNThjMWQ1NDIxMjU2YjUiLCJ0eXBlIjoiZm9ybSIsImlhdCI6MTczMDg2NDM5MH0.ZFikIf37APtQzum7eZmABLtIKG-s2OKnVSa92hBbq74"
    };
    
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