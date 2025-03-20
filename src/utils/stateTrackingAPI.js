/**
 * Utility functions for state tracking and analytics
 */

// Config values
const PARTNER_ID = process.env.REACT_APP_PARTNER_ID || "B40i8"; // Your Partner ID 
const API_ENDPOINT = process.env.REACT_APP_ANALYTICS_ENDPOINT || "https://api.claimconnectors.com/api/analytics";

/**
 * Record state engagement data for analytics
 * @param {Object} trackingData - State engagement data to record
 * @returns {Promise<Object>} - The API response
 */
export const recordStateEngagement = async (trackingData) => {
  try {
    // Ensure we have the required fields
    if (!trackingData.stateCode) {
      console.warn("State code is required for tracking");
      return {
        status: "error",
        message: "State code is required"
      };
    }

    // Add basic analytics info
    const enrichedData = {
      ...trackingData,
      partnerId: PARTNER_ID,
      timestamp: trackingData.timestamp || new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      referrer: document.referrer || '',
      pathname: window.location.pathname,
      hostname: window.location.hostname
    };
    
    // For development mode, just log the data
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Simulating state tracking API', enrichedData);
      return {
        status: "success",
        message: "State engagement tracked (simulated)"
      };
    }

    // Send data to analytics endpoint
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enrichedData),
      // Don't wait for response or handle errors - fire and forget
      keepalive: true
    });

    // Only process response in debug mode
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      const result = await response.json();
      console.log('State tracking API response:', result);
      return {
        status: "success",
        data: result
      };
    }

    return {
      status: "success",
      message: "State engagement tracked"
    };
  } catch (error) {
    // Log error but don't affect user experience
    console.error('Error in state tracking API:', error);
    return {
      status: "error",
      message: error.message
    };
  }
};

/**
 * Record state content view event
 * @param {string} stateCode - Two-letter state code
 * @param {string} contentType - Type of content viewed (generic, legal, medical, etc.)
 * @returns {Promise<Object>} - The API response
 */
export const recordStateView = async (stateCode, contentType = 'generic') => {
  return await recordStateEngagement({
    stateCode,
    action: 'view',
    contentType
  });
};

/**
 * Record state content interaction
 * @param {string} stateCode - Two-letter state code
 * @param {string} action - The action taken (click, call, form_submit, etc.)
 * @param {Object} additionalData - Any additional data to include
 * @returns {Promise<Object>} - The API response
 */
export const recordStateInteraction = async (stateCode, action, additionalData = {}) => {
  return await recordStateEngagement({
    stateCode,
    action,
    ...additionalData
  });
};

/**
 * Get state engagement analytics (for admin dashboard use)
 * @param {string} apiKey - Admin API key for authentication
 * @param {Object} filters - Filters for the analytics data
 * @returns {Promise<Object>} - The analytics data
 */
export const getStateEngagementAnalytics = async (apiKey, filters = {}) => {
  try {
    // This endpoint would be protected and only accessible to admins
    const response = await fetch(`${API_ENDPOINT}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        partnerId: PARTNER_ID,
        ...filters
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return {
      status: "success",
      data
    };
  } catch (error) {
    console.error('Error fetching state engagement analytics:', error);
    return {
      status: "error",
      message: error.message
    };
  }
}; 