/**
 * TrustedForm integration utility functions
 */

let trustedFormCertificateUrl = null;

/**
 * Initialize TrustedForm script and tracking
 * Should be called during application initialization
 */
export const initTrustedForm = () => {
  try {
    // Skip if running in an environment without a document (SSR)
    if (typeof document === 'undefined') return;
    
    // We don't need to add the script as it's already in index.html
    // Just set up the event listeners and polling for the certificate URL
    
    // Check for existing hidden field first
    const checkForCertificateUrl = () => {
      const certField = document.querySelector('input[name="xxTrustedFormCertUrl"]');
      if (certField && certField.value) {
        trustedFormCertificateUrl = certField.value;
        console.log('TrustedForm certificate URL found:', trustedFormCertificateUrl);
        return true;
      }
      return false;
    };
    
    // If we already have a certificate value, use it
    if (checkForCertificateUrl()) {
      return;
    }
    
    // Otherwise, set up polling to check for it
    const intervalId = setInterval(() => {
      if (checkForCertificateUrl()) {
        clearInterval(intervalId);
      }
    }, 1000); // Check every second
    
    // Clean up interval after 30 seconds
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
  // If we already have a cached URL, return it
  if (trustedFormCertificateUrl) {
    return trustedFormCertificateUrl;
  }
  
  // Try to get from the hidden input field the official script creates
  if (typeof document !== 'undefined') {
    const certField = document.querySelector('input[name="xxTrustedFormCertUrl"]');
    if (certField && certField.value) {
      trustedFormCertificateUrl = certField.value;
      return trustedFormCertificateUrl;
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
    if (typeof document === 'undefined') {
      resolve(null);
      return;
    }
    
    try {
      // Get the latest certificate URL from the hidden field
      const certField = document.querySelector('input[name="xxTrustedFormCertUrl"]');
      if (certField && certField.value) {
        trustedFormCertificateUrl = certField.value;
        resolve(trustedFormCertificateUrl);
      } else {
        // If no field found, try again after a short delay
        setTimeout(() => {
          const retryField = document.querySelector('input[name="xxTrustedFormCertUrl"]');
          if (retryField && retryField.value) {
            trustedFormCertificateUrl = retryField.value;
          }
          resolve(trustedFormCertificateUrl);
        }, 500);
      }
    } catch (error) {
      console.error('Error refreshing TrustedForm certificate:', error);
      resolve(null);
    }
  });
}; 