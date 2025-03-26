/**
 * TrustedForm integration utility functions
 */

import { isFeatureEnabled } from './featureFlags';

let trustedFormCertificateUrl = null;

/**
 * Initialize TrustedForm script and tracking
 * Should be called during application initialization
 */
export const initTrustedForm = () => {
  // Skip if the feature is disabled
  if (!isFeatureEnabled('enableTrustedForm')) {
    console.log('TrustedForm integration is disabled by feature flag');
    return;
  }
  
  try {
    // Skip if running in an environment without a document (SSR)
    if (typeof document === 'undefined') return;
    
    // The script is already in index.html, so we just need to check for the field
    const checkForCertificate = () => {
      try {
        // Check for the hidden input field that TrustedForm creates
        const field = document.querySelector('input[name="xxTrustedFormCertUrl"]');
        if (field && field.value) {
          trustedFormCertificateUrl = field.value;
          console.log('TrustedForm certificate found:', trustedFormCertificateUrl);
          return true;
        }
      } catch (err) {
        console.error('Error checking for TrustedForm certificate:', err);
      }
      return false;
    };
    
    // Check once immediately
    if (checkForCertificate()) return;
    
    // If not found, set up a periodic check
    console.log('TrustedForm certificate not found, setting up periodic check');
    const intervalId = setInterval(() => {
      if (checkForCertificate()) {
        clearInterval(intervalId);
      }
    }, 1000); // Check every second
    
    // Clear the interval after 30 seconds to avoid memory leaks
    setTimeout(() => {
      clearInterval(intervalId);
    }, 30000);
  } catch (error) {
    console.error('Error initializing TrustedForm:', error);
  }
};

/**
 * Get the current TrustedForm certificate URL
 * @returns {string|null} The certificate URL or null if not available
 */
export const getTrustedFormCertificateUrl = () => {
  // Skip if the feature is disabled
  if (!isFeatureEnabled('enableTrustedForm')) {
    return null;
  }
  
  // Check if we have a cached URL
  if (trustedFormCertificateUrl) {
    return trustedFormCertificateUrl;
  }
  
  // Try to get from the hidden field
  if (typeof document !== 'undefined') {
    try {
      const field = document.querySelector('input[name="xxTrustedFormCertUrl"]');
      if (field && field.value) {
        trustedFormCertificateUrl = field.value;
        return trustedFormCertificateUrl;
      }
    } catch (err) {
      console.error('Error getting TrustedForm certificate:', err);
    }
  }
  
  return null;
};

/**
 * Refresh the TrustedForm certificate (useful before submitting a form)
 * @returns {Promise<string|null>} Promise resolving to certificate URL or null
 */
export const refreshTrustedFormCertificate = () => {
  return new Promise((resolve) => {
    // Skip if the feature is disabled
    if (!isFeatureEnabled('enableTrustedForm')) {
      resolve(null);
      return;
    }
    
    if (typeof document === 'undefined') {
      resolve(null);
      return;
    }
    
    try {
      // Try to get the latest certificate URL from the hidden field
      const field = document.querySelector('input[name="xxTrustedFormCertUrl"]');
      if (field && field.value) {
        trustedFormCertificateUrl = field.value;
        resolve(trustedFormCertificateUrl);
        return;
      }
      
      // If no field found, check again after a brief delay
      setTimeout(() => {
        try {
          const retryField = document.querySelector('input[name="xxTrustedFormCertUrl"]');
          if (retryField && retryField.value) {
            trustedFormCertificateUrl = retryField.value;
          }
        } catch (err) {
          console.error('Error refreshing TrustedForm certificate:', err);
        }
        
        resolve(trustedFormCertificateUrl);
      }, 500);
    } catch (error) {
      console.error('Error refreshing TrustedForm certificate:', error);
      resolve(null);
    }
  });
}; 