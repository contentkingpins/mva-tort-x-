/**
 * TrustedForm integration utilities
 */

import { isFeatureEnabled } from './featureFlags';

let trustedFormCertificate = null;
let checkInterval = null;
const MAX_ATTEMPTS = 30;
let attempts = 0;

/**
 * Initialize TrustedForm certificate monitoring
 */
export const initializeTrustedForm = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Using simulated TrustedForm certificate');
    trustedFormCertificate = 'https://cert.trustedform.com/development/test123';
    return;
  }

  // Clear any existing interval
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }

  attempts = 0;
  checkForCertificate();
};

/**
 * Check for TrustedForm certificate
 */
const checkForCertificate = () => {
  if (process.env.NODE_ENV === 'development') return;

  console.log('Checking for TrustedForm certificate...');
  
  if (window.TrustedForm && window.TrustedForm.certificates && window.TrustedForm.certificates.length > 0) {
    trustedFormCertificate = window.TrustedForm.certificates[0];
    console.log('TrustedForm certificate found:', trustedFormCertificate);
    return;
  }

  attempts++;
  
  if (attempts >= MAX_ATTEMPTS) {
    console.warn('TrustedForm certificate not found after maximum attempts');
    return;
  }

  if (!checkInterval) {
    checkInterval = setInterval(checkForCertificate, 1000);
  }
};

/**
 * Get the current TrustedForm certificate URL
 */
export const getTrustedFormCertificateUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'https://cert.trustedform.com/development/test123';
  }
  return trustedFormCertificate;
};

/**
 * Refresh the TrustedForm certificate
 */
export const refreshTrustedFormCertificate = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Simulating TrustedForm certificate refresh');
    await new Promise(resolve => setTimeout(resolve, 500));
    trustedFormCertificate = 'https://cert.trustedform.com/development/test123';
    return trustedFormCertificate;
  }

  return new Promise((resolve) => {
    attempts = 0;
    checkForCertificate();
    
    const checkComplete = setInterval(() => {
      if (trustedFormCertificate || attempts >= MAX_ATTEMPTS) {
        clearInterval(checkComplete);
        resolve(trustedFormCertificate);
      }
    }, 1000);
  });
};

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
      attempts++;
      
      try {
        // Check for the hidden input field that TrustedForm creates
        const field = document.querySelector('input[name="xxTrustedFormCertUrl"]');
        if (field && field.value) {
          trustedFormCertificate = field.value;
          console.log('TrustedForm certificate found:', trustedFormCertificate);
          return true;
        }
      } catch (err) {
        console.error('Error checking for TrustedForm certificate:', err);
      }
      
      // Stop checking after max attempts
      if (attempts >= MAX_ATTEMPTS) {
        console.warn(`TrustedForm certificate not found after ${MAX_ATTEMPTS} attempts. Giving up.`);
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
        if (!trustedFormCertificate) {
          console.warn('TrustedForm certificate not found after timeout. This may be due to browser privacy settings or script blocking.');
        }
      }
    }, 30000);
  } catch (error) {
    console.error('Error initializing TrustedForm:', error);
  }
}; 