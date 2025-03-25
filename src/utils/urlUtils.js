/**
 * URL parameter utility functions
 */

/**
 * Get a URL parameter by name
 * @param {string} name - Name of the parameter to get
 * @returns {string|null} The parameter value or null if not found
 */
export const getUrlParameter = (name) => {
  // Use URLSearchParams API if available
  if (typeof URLSearchParams !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
  
  // Fallback for older browsers
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(window.location.search);
  
  if (!results) return null;
  if (!results[2]) return '';
  
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * Get the Publisher ID from the URL
 * Returns the pubID query parameter value
 * @returns {string|null} The Publisher ID or null if not found
 */
export const getPublisherId = () => {
  return getUrlParameter('pubID');
};

/**
 * Check if the current session has a pubID
 * @returns {boolean} True if a pubID is present in the URL
 */
export const hasPublisherId = () => {
  return getPublisherId() !== null;
}; 