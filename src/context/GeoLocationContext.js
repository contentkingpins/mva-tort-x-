import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getUserStateFromIP, 
  DEFAULT_STATE, 
  SUPPORTED_STATES,
  ALL_US_STATES,
  getStateContent,
  isStateSupported
} from '../utils/geolocation';

// Create the context
const GeoLocationContext = createContext();

// Export the hook for consuming the context
export const useGeoLocation = () => {
  const context = useContext(GeoLocationContext);
  if (!context) {
    throw new Error('useGeoLocation must be used within a GeoLocationProvider');
  }
  return context;
};

// Provider component
export const GeoLocationProvider = ({ children }) => {
  const [geoState, setGeoState] = useState({
    stateCode: DEFAULT_STATE,
    stateName: SUPPORTED_STATES[DEFAULT_STATE].name,
    content: SUPPORTED_STATES[DEFAULT_STATE].content,
    isLoading: true,
    error: null,
    isSupported: true
  });

  // Function to update the state
  const updateUserState = (stateCode) => {
    if (!stateCode || !ALL_US_STATES[stateCode]) {
      return;
    }

    // Use all content fields from the state data
    setGeoState({
      stateCode,
      stateName: ALL_US_STATES[stateCode].name,
      content: SUPPORTED_STATES[stateCode]?.content || getStateContent(DEFAULT_STATE),
      isLoading: false,
      error: null,
      isSupported: isStateSupported(stateCode)
    });

    // Store in localStorage for future visits
    try {
      localStorage.setItem('userState', stateCode);
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  };

  // Reset to default state
  const resetState = () => {
    setGeoState({
      stateCode: DEFAULT_STATE,
      stateName: SUPPORTED_STATES[DEFAULT_STATE].name,
      content: SUPPORTED_STATES[DEFAULT_STATE].content,
      isLoading: false,
      error: null,
      isSupported: true
    });

    // Clear from localStorage
    try {
      localStorage.removeItem('userState');
    } catch (error) {
      console.error('Error removing state from localStorage:', error);
    }
  };

  // Effect to detect user's state on component mount
  useEffect(() => {
    const detectUserState = async () => {
      try {
        // First check localStorage for previously saved state
        const savedState = localStorage.getItem('userState');
        if (savedState && ALL_US_STATES[savedState]) {
          updateUserState(savedState);
          return;
        }

        // If no saved state, detect from IP
        const { stateCode, isSupported } = await getUserStateFromIP();
        
        setGeoState({
          stateCode,
          stateName: ALL_US_STATES[stateCode].name,
          content: SUPPORTED_STATES[stateCode]?.content || getStateContent(DEFAULT_STATE),
          isLoading: false,
          error: null,
          isSupported
        });

        // Save to localStorage for future visits
        try {
          localStorage.setItem('userState', stateCode);
        } catch (error) {
          console.error('Error saving state to localStorage:', error);
        }
      } catch (error) {
        console.error('Error in geolocation detection:', error);
        setGeoState({
          stateCode: DEFAULT_STATE,
          stateName: SUPPORTED_STATES[DEFAULT_STATE].name,
          content: SUPPORTED_STATES[DEFAULT_STATE].content,
          isLoading: false,
          error: 'Failed to detect location',
          isSupported: false
        });
      }
    };

    detectUserState();
  }, []);

  const value = {
    ...geoState,
    updateUserState,
    resetState,
    supportedStates: SUPPORTED_STATES,
    allStates: ALL_US_STATES
  };

  return (
    <GeoLocationContext.Provider value={value}>
      {children}
    </GeoLocationContext.Provider>
  );
}; 