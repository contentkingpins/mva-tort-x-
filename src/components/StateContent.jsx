import React, { useEffect, useState } from 'react';
import { useGeoLocation } from '../context/GeoLocationContext';
import { trackStateEngagement, isStateSupported } from '../utils/geolocation';
import EnhancedClickToCall from './EnhancedClickToCall';

/**
 * Component to display state-specific content based on the user's location
 */
const StateContent = () => {
  const { stateCode, stateName, content, isLoading, isSupported, allStates, updateUserState } = useGeoLocation();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Track state view on component mount
  useEffect(() => {
    if (!isLoading && stateCode) {
      trackStateEngagement(stateCode, 'view');
      // Mark initial load as complete so we don't show the loading indicator again
      setInitialLoadComplete(true);
    }
  }, [stateCode, isLoading]);

  // Track state change when user manually selects a state
  const handleStateChange = (newStateCode) => {
    trackStateEngagement(newStateCode, 'manual_select');
    updateUserState(newStateCode);
  };

  // Only show loading indicator on initial load, not during state changes
  if (isLoading && !initialLoadComplete) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Personalizing your experience...</p>
      </div>
    );
  }

  // Group states by region for better organization in the dropdown
  const regions = {
    Northeast: ['CT', 'ME', 'MA', 'NH', 'RI', 'VT', 'NY', 'NJ', 'PA'],
    Midwest: ['IL', 'IN', 'MI', 'OH', 'WI', 'IA', 'KS', 'MN', 'MO', 'NE', 'ND', 'SD'],
    South: ['DE', 'FL', 'GA', 'MD', 'NC', 'SC', 'VA', 'DC', 'WV', 'AL', 'KY', 'MS', 'TN', 'AR', 'LA', 'OK', 'TX'],
    West: ['AZ', 'CO', 'ID', 'MT', 'NV', 'NM', 'UT', 'WY', 'AK', 'CA', 'HI', 'OR', 'WA']
  };

  // Format phone number for display
  const phoneNumber = "8337156010";
  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
  };
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  return (
    <div className="bg-white rounded-lg p-5 mb-6 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        {/* Local message with subtle state indicator */}
        <div className="flex-grow">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-medium text-gray-800">{stateName} Personal Injury Resources</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
              <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Local
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{content.subheadline}</p>
          
          {/* Key legal information in a subtle, collapsible section */}
          <details className="mb-3 text-sm">
            <summary className="font-medium text-blue-600 cursor-pointer hover:text-blue-700">
              Important {stateName} Legal Information
            </summary>
            <div className="mt-2 pl-4 border-l-2 border-blue-100 space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Time Limits:</span> {content.statistic}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Fault Laws:</span> {content.legalInfo}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Damage Considerations:</span> {content.maxDamages}
              </p>
            </div>
          </details>
          
          {!isSupported && (
            <div className="text-xs text-blue-600 mb-3">
              While {stateName} is outside our primary focus areas, our network may still be able to assist you.
            </div>
          )}
        </div>
        
        {/* Quick Call Section - Using EnhancedClickToCall for Ringba integration */}
        <div className="ml-4 flex-shrink-0">
          <EnhancedClickToCall
            phoneNumber={phoneNumber}
            formattedPhoneNumber={formattedPhoneNumber}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            showIcon={true}
            iconClassName="h-4 w-4 mr-1"
            buttonText="Free Consult"
          />
        </div>
      </div>
      
      {/* Subtle state selector */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <span className="mr-2">Not in {stateName}?</span>
          <select 
            className="text-xs py-1 pl-1 pr-7 border-0 focus:ring-0 focus:outline-none bg-gray-50 rounded"
            value={stateCode}
            onChange={(e) => handleStateChange(e.target.value)}
            aria-label="Select your state"
          >
            {/* Group states by region */}
            {Object.entries(regions).map(([region, stateCodes]) => (
              <optgroup key={region} label={region}>
                {stateCodes.map(code => {
                  const state = allStates[code];
                  const supported = isStateSupported(code);
                  return (
                    <option 
                      key={code} 
                      value={code}
                    >
                      {state.name}{supported ? " ✓" : ""}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StateContent; 