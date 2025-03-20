/**
 * Utility functions for Ringba API integration
 */

// Ringba enrichment API endpoint
const RINGBA_ENDPOINT = "https://display.ringba.com/enrich/2633440120270751643";

/**
 * Makes a call to the Ringba enrichment API with form data
 * @param {Object} data - The data to send to Ringba
 * @returns {Promise<Object>} - The API response
 */
export const enrichRingbaCall = async (data) => {
  try {
    // Format the data for Ringba API
    const queryParams = new URLSearchParams();
    
    // Required parameters
    queryParams.append("isTest", process.env.NODE_ENV === "development" ? "1" : "0");
    queryParams.append("callerid", data.callerid || "");
    queryParams.append("sourceId", data.sourceId || "tortx_lead");
    
    // Required form data
    queryParams.append("incidentState", data.incidentState || "");
    queryParams.append("incidentDate", formatDate(data.incidentDate) || "");
    queryParams.append("atFault", data.atFault === true ? "Yes" : "No");
    queryParams.append("attorney", data.hasAttorney === "yes" ? "Yes" : "No");
    queryParams.append("settlement", data.priorSettlement === true ? "Yes" : "No");
    
    // Optional parameters
    if (data.claimantName) queryParams.append("claimantName", data.claimantName);
    if (data.claimantEmail) queryParams.append("claimantEmail", data.claimantEmail);
    
    // Make the API request
    const response = await fetch(`${RINGBA_ENDPOINT}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    const result = await response.json();
    console.log('Ringba API response:', result);
    
    return result;
  } catch (error) {
    console.error('Error calling Ringba API:', error);
    return { status: "error", message: error.message };
  }
};

/**
 * Format date from YYYY-MM-DD to MM/DD/YYYY
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Date in MM/DD/YYYY format
 */
const formatDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return "";
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return "";
  }
};

/**
 * Handle click-to-call with Ringba enrichment
 * @param {Object} formData - Form data to send to Ringba
 * @param {string} phoneNumber - Phone number to call
 * @param {function} callback - Optional callback after API call
 */
export const handleEnrichedCall = async (formData, phoneNumber, callback) => {
  try {
    // Call the Ringba API
    const result = await enrichRingbaCall(formData);
    
    // Call the callback if provided
    if (callback && typeof callback === 'function') {
      callback(result);
    }
    
    // Return the result
    return result;
  } catch (error) {
    console.error('Error in handleEnrichedCall:', error);
    return { status: "error", message: error.message };
  }
}; 