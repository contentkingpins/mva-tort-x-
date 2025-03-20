import React, { useEffect } from 'react';
import { useGeoLocation } from '../context/GeoLocationContext';
import { trackStateEngagement, isStateSupported } from '../utils/geolocation';

/**
 * Component to display state-specific content based on the user's location
 */
const StateContent = () => {
  const { stateCode, stateName, content, isLoading, isSupported, allStates, updateUserState } = useGeoLocation();

  // Track state view on component mount
  useEffect(() => {
    if (!isLoading && stateCode) {
      trackStateEngagement(stateCode, 'view');
    }
  }, [stateCode, isLoading]);

  // Track state change when user manually selects a state
  const handleStateChange = (newStateCode) => {
    trackStateEngagement(newStateCode, 'manual_select');
    updateUserState(newStateCode);
  };

  // Track calls from state component
  const handleCall = () => {
    trackStateEngagement(stateCode, 'call');
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600 mt-2">Detecting your location...</p>
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

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{content.headline}</h2>
        <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          {stateName}
        </div>
      </div>
      
      <p className="text-lg text-gray-600 mb-4">{content.subheadline}</p>
      
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
        <p className="text-amber-800 font-semibold">{content.statistic}</p>
      </div>

      {/* New sections for enhanced legal information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h3 className="text-blue-800 font-semibold mb-2">Negligence Laws</h3>
          <p className="text-blue-800">{content.legalInfo}</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <h3 className="text-green-800 font-semibold mb-2">Damage Caps</h3>
          <p className="text-green-800">{content.maxDamages}</p>
        </div>
      </div>
      
      {!isSupported && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-800">
            We're expanding our services to fully cover {stateName}. 
            We may still be able to help with your case - call us to learn more.
          </p>
        </div>
      )}
      
      {/* State selector for changing state */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Not in {stateName}? Select your state:
        </label>
        <div className="relative">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={stateCode}
            onChange={(e) => handleStateChange(e.target.value)}
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
                      className={supported ? "font-semibold" : "text-gray-500"}
                    >
                      {state.name}{supported ? " ✓" : ""}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">
            ✓ indicates states with full coverage details
          </div>
        </div>
      </div>

      {/* Call to action section */}
      <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help With Your Case?</h3>
        <p className="text-gray-600 mb-4">
          Our experienced attorneys understand {stateName}'s complex personal injury laws 
          and can help you navigate your claim for maximum compensation.
        </p>
        <a 
          href="tel:833-715-6010" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          onClick={handleCall}
        >
          Call 833-715-6010 Now
        </a>
      </div>
    </div>
  );
};

export default StateContent; 