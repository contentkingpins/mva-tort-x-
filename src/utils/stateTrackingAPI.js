/**
 * Utility functions for state tracking and analytics
 */

// Config values
const PARTNER_ID = process.env.REACT_APP_PARTNER_ID || "B40i8"; // Your Partner ID 
const API_ENDPOINT = process.env.REACT_APP_ANALYTICS_ENDPOINT || "https://api.claimconnectors.com/api/analytics";

// Cache to avoid multiple failed requests
let apiFailureDetected = false;

/**
 * Record state engagement data for analytics
 * @param {Object} trackingData - State engagement data to record
 * @returns {Promise<Object>} - The API response
 */
export const recordStateEngagement = async (trackingData) => {
  try {
    // Skip if we already detected API failure
    if (apiFailureDetected) {
      console.log('State tracking API skipped due to previous failure');
      return {
        status: "skipped",
        message: "Previous API failure detected"
      };
    }
    
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

    // Use a timeout to prevent waiting too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      // Send data to analytics endpoint with a timeout
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enrichedData),
        signal: controller.signal,
        // Don't wait for response or handle errors - fire and forget
        keepalive: true
      });

      clearTimeout(timeoutId);

      // Only process response in debug mode
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
        const result = await response.json().catch(() => ({ status: 'error', message: 'Invalid response' }));
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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.warn('State tracking API request failed:', fetchError.message);
      
      // Mark as failed if it's not an abort error (timeout we triggered)
      if (fetchError.name !== 'AbortError') {
        apiFailureDetected = true;
      }
      
      return {
        status: "error",
        message: fetchError.message
      };
    }
  } catch (error) {
    // Mark API as failed to avoid future attempts
    apiFailureDetected = true;
    
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
  }).catch(err => {
    console.warn('Failed to record state view:', err);
    return { status: 'error', message: err.message };
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
  }).catch(err => {
    console.warn('Failed to record state interaction:', err);
    return { status: 'error', message: err.message };
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
    // Skip if we already detected API failure
    if (apiFailureDetected) {
      return {
        status: "skipped",
        message: "Previous API failure detected"
      };
    }

    // Use a timeout to prevent waiting too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

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
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      return {
        status: "success",
        data
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Mark API as failed for non-abort errors
      if (fetchError.name !== 'AbortError') {
        apiFailureDetected = true;
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching state engagement analytics:', error);
    return {
      status: "error",
      message: error.message
    };
  }
}; 