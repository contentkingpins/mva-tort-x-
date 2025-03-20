import React, { createContext, useState, useContext, useEffect } from 'react';
import { useGeoLocation } from './GeoLocationContext';
import { getStateFromZip, trackStateEngagement } from '../utils/geolocation';

// Create the context
const FormDataContext = createContext();

// Custom hook to use the context
export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};

// Provider component
export const FormDataProvider = ({ children }) => {
  // Get geolocation data
  const { stateCode } = useGeoLocation();
  
  const [formData, setFormData] = useState({
    // Form data
    accidentDate: null,
    medicalTreatment: null,
    medicalTreatmentDate: null,
    atFault: null,
    hasAttorney: null,
    movingViolation: null,
    priorSettlement: null,
    insuranceCoverage: {
      liability: false,
      uninsured: false,
      underinsured: false
    },
    
    // Contact info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zip: '',
    
    // Lead tracking info
    sourceId: `tortx_lead_${Date.now()}`,
    incidentState: stateCode || '', // Initialize with detected state
    detectedState: stateCode || '', // Store the originally detected state separately
    
    // Derived from form data
    callerid: '',
    claimantName: '',
    claimantEmail: '',
    
    // Partner tracking data
    partnerId: 'B40i8',
    geoTargeted: stateCode ? true : false // Flag if user was geo-targeted
  });

  // Update form data when geolocation state changes
  useEffect(() => {
    if (stateCode) {
      setFormData(prevData => ({
        ...prevData,
        incidentState: stateCode,
        detectedState: stateCode,
        geoTargeted: true
      }));
    }
  }, [stateCode]);

  const updateFormData = (newData) => {
    setFormData(prevData => {
      // Create updated data
      const updatedData = { ...prevData, ...newData };
      
      // Update derived fields if component data is present
      if (newData.firstName || newData.lastName) {
        const firstName = newData.firstName || prevData.firstName || '';
        const lastName = newData.lastName || prevData.lastName || '';
        updatedData.claimantName = `${firstName} ${lastName}`.trim();
      }
      
      if (newData.email) {
        updatedData.claimantEmail = newData.email;
      }
      
      if (newData.phone) {
        updatedData.callerid = newData.phone.replace(/\D/g, '');
      }
      
      // Extract state from ZIP code if possible
      if (newData.zip) {
        const zipState = getStateFromZip(newData.zip);
        if (zipState) {
          // If ZIP state is different from detected state, track this for analytics
          if (prevData.detectedState && zipState !== prevData.detectedState) {
            trackStateEngagement(zipState, 'zip_different_from_geo');
          }
          
          updatedData.incidentState = zipState;
        }
      }
      
      return updatedData;
    });
  };

  // Track form submissions with state info
  const submitFormWithStateData = async (endpoint, callback) => {
    try {
      // Track the submission event with state info
      trackStateEngagement(formData.incidentState, 'form_submit');
      
      // Add timestamp
      const submissionData = {
        ...formData,
        submissionTime: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      // Make the API call
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      
      const data = await response.json();
      
      if (callback && typeof callback === 'function') {
        callback(data);
      }
      
      return data;
    } catch (error) {
      console.error('Form submission error:', error);
      if (callback && typeof callback === 'function') {
        callback({ error: true, message: error.message });
      }
      throw error;
    }
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData, submitFormWithStateData }}>
      {children}
    </FormDataContext.Provider>
  );
}; 