import React, { createContext, useState, useContext } from 'react';

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
    incidentState: '',
    
    // Derived from form data
    callerid: '',
    claimantName: '',
    claimantEmail: '',
  });

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
      
      // Extract state from ZIP code if possible and incidentState is not set
      if (newData.zip && !updatedData.incidentState) {
        // This is a simplified mapping - a real implementation would use
        // a geocoding service or ZIP code database
        // Just mapping some example states
        const zipPrefixToState = {
          '01': 'MA', '02': 'MA', '03': 'NH', '04': 'NH',
          '75': 'TX', '76': 'TX', '77': 'TX',
          '80': 'CO', '81': 'CO',
          '30': 'GA', '31': 'GA',
          '35': 'AL', '36': 'AL'
        };
        
        const zipPrefix = newData.zip.substring(0, 2);
        updatedData.incidentState = zipPrefixToState[zipPrefix] || '';
      }
      
      return updatedData;
    });
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
}; 