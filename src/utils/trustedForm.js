/**
 * TrustedForm integration utility functions
 */

import { isFeatureEnabled } from './featureFlags';

let trustedFormCertificateUrl = null;
let trustedFormCheckCount = 0;
const MAX_CHECK_ATTEMPTS = 30; // Limit the number of checks

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
    
    // Security check - only proceed if on HTTPS unless in development
    if (typeof window !== 'undefined' && 
        window.location.protocol !== 'https:' && 
        window.location.hostname !== 'localhost' &&
        !window.location.hostname.includes('127.0.0.1')) {
      console.warn('TrustedForm requires HTTPS for security. Integration disabled on insecure connection.');
      return;
    }
    
    // The script is already in index.html, so we just need to check for the field
    const checkForCertificate = () => {
      trustedFormCheckCount++;
      
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
      
      // Stop checking after max attempts
      if (trustedFormCheckCount >= MAX_CHECK_ATTEMPTS) {
        console.warn(`TrustedForm certificate not found after ${MAX_CHECK_ATTEMPTS} attempts. Giving up.`);
        return true; // Return true to stop the interval
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
      if (intervalId) {
        clearInterval(intervalId);
        if (!trustedFormCertificateUrl) {
          console.warn('TrustedForm certificate not found after timeout. This may be due to browser privacy settings or script blocking.');
        }
      }
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
        // Validate the certificate URL format for security
        const certUrl = field.value.trim();
        if (certUrl.startsWith('https://cert.trustedform.com/')) {
          trustedFormCertificateUrl = certUrl;
          return trustedFormCertificateUrl;
        } else {
          console.warn('Invalid TrustedForm certificate URL format:', certUrl);
        }
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
        const certUrl = field.value.trim();
        if (certUrl.startsWith('https://cert.trustedform.com/')) {
          trustedFormCertificateUrl = certUrl;
          resolve(trustedFormCertificateUrl);
          return;
        } else {
          console.warn('Invalid TrustedForm certificate URL format during refresh:', certUrl);
        }
      }
      
      // If no field found, check again after a brief delay
      setTimeout(() => {
        try {
          const retryField = document.querySelector('input[name="xxTrustedFormCertUrl"]');
          if (retryField && retryField.value) {
            const certUrl = retryField.value.trim();
            if (certUrl.startsWith('https://cert.trustedform.com/')) {
              trustedFormCertificateUrl = certUrl;
            } else {
              console.warn('Invalid TrustedForm certificate URL format during retry:', certUrl);
            }
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