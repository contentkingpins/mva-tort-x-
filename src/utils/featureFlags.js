/**
 * Feature flag utility for controlling feature availability
 */

// Feature flag definitions with default values
const featureFlags = {
  // Enable TrustedForm certificate integration
  enableTrustedForm: true,
  
  // Enable Ringba enhancements
  enableRingbaEnhancements: true
};

/**
 * Check if a feature is enabled
 * @param {string} featureName - The name of the feature to check
 * @returns {boolean} Whether the feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  // Check URL parameters first (for testing)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get(`enable_${featureName}`);
    
    if (paramValue !== null) {
      return paramValue === 'true' || paramValue === '1';
    }
  }
  
  // Fall back to default configuration
  return featureFlags[featureName] === true;
};

/**
 * Get all feature flags (for debugging)
 * @returns {object} All feature flags
 */
export const getAllFeatureFlags = () => {
  return { ...featureFlags };
}; 