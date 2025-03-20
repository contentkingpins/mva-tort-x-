import React, { useState } from 'react';
import { useFormData } from '../context/FormDataContext';
import { handleEnrichedCall } from '../utils/ringbaAPI';

const EnhancedClickToCall = ({ 
  phoneNumber, 
  formattedPhoneNumber, 
  className, 
  style, 
  iconClassName,
  children,
  buttonText,
  showIcon = true 
}) => {
  const { formData } = useFormData();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle click event
  const handleClick = async (e) => {
    try {
      // Prevent the default link behavior to handle our API call first
      e.preventDefault();
      setIsProcessing(true);
      
      // If we have form data, call the Ringba API
      if (formData.accidentDate && formData.incidentState) {
        try {
          // Call the Ringba API with our form data
          await handleEnrichedCall(formData, phoneNumber, (result) => {
            if (result.status === "ok") {
              console.log("Ringba enrichment successful");
            } else {
              console.warn("Ringba enrichment failed:", result);
            }
          });
        } catch (error) {
          console.error("Error in click-to-call enrichment:", error);
        }
      }
      
      // Always proceed with the call, even if enrichment fails
      window.location.href = `tel:${phoneNumber}`;
    } catch (error) {
      console.error("Error in click-to-call:", error);
      
      // Fallback: proceed with the call anyway
      window.location.href = `tel:${phoneNumber}`;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <a
      href={`tel:${phoneNumber}`}
      onClick={handleClick}
      className={className || "inline-flex items-center px-4 py-2 rounded-md text-white"}
      style={style || { backgroundColor: 'var(--gold-accent)' }}
      aria-label={`Call us at ${formattedPhoneNumber}`}
      data-partner-id="B40i8"
      role="button"
      aria-disabled={isProcessing}
    >
      {showIcon && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className={iconClassName || "w-5 h-5 mr-2"}
          width="18"
          height="18"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      )}
      {children || buttonText || formattedPhoneNumber}
      {isProcessing && (
        <span className="ml-2">
          Processing...
        </span>
      )}
    </a>
  );
};

export default EnhancedClickToCall; 