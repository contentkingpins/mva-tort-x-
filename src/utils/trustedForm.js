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
    
    // Skip if the script is already loaded
    if (document.getElementById('trusted-form-script')) return;
    
    // Create and append TrustedForm script
    const script = document.createElement('script');
    script.id = 'trusted-form-script';
    script.type = 'text/javascript';
    script.async = true;
    script.src = '//monitoring-scripts.s3.amazonaws.com/sdk/v1/trusted-form.min.js';
    
    // Add script to document
    document.head.appendChild(script);
    
    // Add event listener for when TrustedForm is loaded and certificate is available
    window.addEventListener('TrustedFormReady', () => {
      if (window.TrustedForm && window.TrustedForm.certificate) {
        trustedFormCertificateUrl = window.TrustedForm.certificate.url;
        console.log('TrustedForm certificate URL:', trustedFormCertificateUrl);
      }
    });
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
  
  // Try to get from window object (in case initTrustedForm wasn't called)
  if (typeof window !== 'undefined' && window.TrustedForm && window.TrustedForm.certificate) {
    trustedFormCertificateUrl = window.TrustedForm.certificate.url;
    return trustedFormCertificateUrl;
  }
  
  return null;
};

/**
 * Refresh the TrustedForm certificate (useful before submitting a form)
 * @returns {Promise<string|null>} Promise resolving to certificate URL or null
 */
export const refreshTrustedFormCertificate = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.TrustedForm) {
      resolve(null);
      return;
    }
    
    try {
      // Try to refresh the certificate
      if (window.TrustedForm.refresh) {
        window.TrustedForm.refresh();
        
        // Wait a short time for the refresh to complete
        setTimeout(() => {
          if (window.TrustedForm && window.TrustedForm.certificate) {
            trustedFormCertificateUrl = window.TrustedForm.certificate.url;
            resolve(trustedFormCertificateUrl);
          } else {
            resolve(null);
          }
        }, 100);
      } else {
        // If no refresh method, just try to get the current certificate
        if (window.TrustedForm && window.TrustedForm.certificate) {
          trustedFormCertificateUrl = window.TrustedForm.certificate.url;
        }
        resolve(trustedFormCertificateUrl);
      }
    } catch (error) {
      console.error('Error refreshing TrustedForm certificate:', error);
      resolve(null);
    }
  });
}; 