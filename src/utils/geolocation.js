/**
 * Geolocation utilities for detecting user's state and managing state-specific content
 */

import { recordStateInteraction } from './stateTrackingAPI';

// Complete list of US states - will be used for the dropdown selector
export const ALL_US_STATES = {
  AL: { name: "Alabama", abbr: "AL" },
  AK: { name: "Alaska", abbr: "AK" },
  AZ: { name: "Arizona", abbr: "AZ" },
  AR: { name: "Arkansas", abbr: "AR" },
  CA: { name: "California", abbr: "CA" },
  CO: { name: "Colorado", abbr: "CO" },
  CT: { name: "Connecticut", abbr: "CT" },
  DE: { name: "Delaware", abbr: "DE" },
  FL: { name: "Florida", abbr: "FL" },
  GA: { name: "Georgia", abbr: "GA" },
  HI: { name: "Hawaii", abbr: "HI" },
  ID: { name: "Idaho", abbr: "ID" },
  IL: { name: "Illinois", abbr: "IL" },
  IN: { name: "Indiana", abbr: "IN" },
  IA: { name: "Iowa", abbr: "IA" },
  KS: { name: "Kansas", abbr: "KS" },
  KY: { name: "Kentucky", abbr: "KY" },
  LA: { name: "Louisiana", abbr: "LA" },
  ME: { name: "Maine", abbr: "ME" },
  MD: { name: "Maryland", abbr: "MD" },
  MA: { name: "Massachusetts", abbr: "MA" },
  MI: { name: "Michigan", abbr: "MI" },
  MN: { name: "Minnesota", abbr: "MN" },
  MS: { name: "Mississippi", abbr: "MS" },
  MO: { name: "Missouri", abbr: "MO" },
  MT: { name: "Montana", abbr: "MT" },
  NE: { name: "Nebraska", abbr: "NE" },
  NV: { name: "Nevada", abbr: "NV" },
  NH: { name: "New Hampshire", abbr: "NH" },
  NJ: { name: "New Jersey", abbr: "NJ" },
  NM: { name: "New Mexico", abbr: "NM" },
  NY: { name: "New York", abbr: "NY" },
  NC: { name: "North Carolina", abbr: "NC" },
  ND: { name: "North Dakota", abbr: "ND" },
  OH: { name: "Ohio", abbr: "OH" },
  OK: { name: "Oklahoma", abbr: "OK" },
  OR: { name: "Oregon", abbr: "OR" },
  PA: { name: "Pennsylvania", abbr: "PA" },
  RI: { name: "Rhode Island", abbr: "RI" },
  SC: { name: "South Carolina", abbr: "SC" },
  SD: { name: "South Dakota", abbr: "SD" },
  TN: { name: "Tennessee", abbr: "TN" },
  TX: { name: "Texas", abbr: "TX" },
  UT: { name: "Utah", abbr: "UT" },
  VT: { name: "Vermont", abbr: "VT" },
  VA: { name: "Virginia", abbr: "VA" },
  WA: { name: "Washington", abbr: "WA" },
  WV: { name: "West Virginia", abbr: "WV" },
  WI: { name: "Wisconsin", abbr: "WI" },
  WY: { name: "Wyoming", abbr: "WY" },
  DC: { name: "District of Columbia", abbr: "DC" }
};

// List of supported states for targeting
export const SUPPORTED_STATES = {
  AL: { 
    name: "Alabama", 
    abbr: "AL",
    content: {
      headline: "Alabama Personal Injury Claims",
      subheadline: "Get compensation for your Alabama accident",
      statistic: "Alabama has a 2-year statute of limitations for personal injury claims",
      legalInfo: "Alabama uses a contributory negligence model, which means if you're found even 1% at fault, you may be barred from recovery. This makes having an experienced attorney essential.",
      maxDamages: "No cap on economic damages, but Alabama caps non-economic damages in some cases."
    }
  },
  AZ: { 
    name: "Arizona", 
    abbr: "AZ",
    content: {
      headline: "Arizona Personal Injury Claims",
      subheadline: "Arizona accident victims deserve fair compensation",
      statistic: "Arizona has a 2-year statute of limitations for personal injury claims",
      legalInfo: "Arizona follows a pure comparative negligence system, allowing recovery even if you're partially at fault. Your compensation will be reduced by your percentage of fault.",
      maxDamages: "Arizona has no caps on compensatory damages in personal injury cases."
    }
  },
  CA: { 
    name: "California", 
    abbr: "CA",
    content: {
      headline: "California Personal Injury Claims",
      subheadline: "California's pure comparative negligence laws protect your rights",
      statistic: "California has a 2-year statute of limitations for personal injury claims",
      legalInfo: "California uses pure comparative negligence, meaning you can recover damages even if you're 99% at fault, though your award will be reduced by your percentage of fault.",
      maxDamages: "California has no caps on compensatory damages for most personal injury cases."
    }
  },
  CO: { 
    name: "Colorado", 
    abbr: "CO",
    content: {
      headline: "Colorado Personal Injury Claims",
      subheadline: "Colorado's modified comparative negligence laws may affect your claim",
      statistic: "Colorado has a 2-year statute of limitations for most personal injury claims",
      legalInfo: "Colorado uses modified comparative negligence with a 50% bar, meaning you cannot recover if you're 50% or more at fault for the accident.",
      maxDamages: "Colorado caps non-economic damages in most personal injury cases."
    }
  },
  CT: { 
    name: "Connecticut", 
    abbr: "CT",
    content: {
      headline: "Connecticut Personal Injury Claims",
      subheadline: "Connecticut's modified comparative fault system",
      statistic: "Connecticut has a 2-year statute of limitations for personal injury claims",
      legalInfo: "Connecticut follows a modified comparative negligence model with a 51% bar. You can recover damages as long as you're not more than 50% responsible.",
      maxDamages: "Connecticut generally does not cap compensatory damages in personal injury cases."
    }
  },
  FL: { 
    name: "Florida", 
    abbr: "FL",
    content: {
      headline: "Florida Personal Injury Claims",
      subheadline: "Florida's no-fault insurance system requires special handling",
      statistic: "Florida has a 2-year statute of limitations for personal injury claims (changed from 4 years in March 2023)",
      legalInfo: "Florida operates under a pure comparative negligence system. Your recovery will be reduced by your percentage of fault.",
      maxDamages: "Florida has caps on non-economic damages in medical malpractice cases."
    }
  },
  GA: { 
    name: "Georgia", 
    abbr: "GA",
    content: {
      headline: "Georgia Personal Injury Claims",
      subheadline: "Georgia's modified comparative negligence laws may affect your claim",
      statistic: "Georgia has a 2-year statute of limitations for personal injury claims",
      legalInfo: "Georgia follows a modified comparative negligence rule. You can recover damages if you're less than 50% at fault, but your compensation will be reduced by your percentage of fault.",
      maxDamages: "Georgia generally has no caps on compensatory damages in personal injury cases."
    }
  },
  IL: { 
    name: "Illinois", 
    abbr: "IL",
    content: {
      headline: "Illinois Personal Injury Claims",
      subheadline: "Illinois modified comparative fault system",
      statistic: "Illinois has a 2-year statute of limitations for personal injury claims",
      legalInfo: "Illinois follows a modified comparative negligence system with a 51% bar. You can recover damages as long as you're not more than 50% at fault.",
      maxDamages: "Illinois generally does not cap compensatory damages in personal injury cases."
    }
  },
  IA: { 
    name: "Iowa", 
    abbr: "IA",
    content: {
      headline: "Iowa Personal Injury Claims",
      subheadline: "Iowa's modified comparative fault system",
      statistic: "Iowa has a 2-year statute of limitations for personal injury claims",
      legalInfo: "Iowa uses a modified comparative fault system with a 51% bar. You cannot recover if you're found to be more than 50% responsible for your injuries.",
      maxDamages: "Iowa has caps on non-economic damages in medical malpractice cases, but not for most other personal injury claims."
    }
  },
  KY: { 
    name: "Kentucky", 
    abbr: "KY",
    content: {
      headline: "Kentucky Personal Injury Claims",
      subheadline: "Kentucky's pure comparative fault rules",
      statistic: "Kentucky has a 1-year statute of limitations for personal injury claims",
      legalInfo: "Kentucky follows a pure comparative fault rule, allowing recovery even if you're mostly at fault. Your damages will be reduced by your percentage of fault.",
      maxDamages: "Kentucky generally does not cap compensatory damages in personal injury cases."
    }
  },
  MA: { 
    name: "Massachusetts", 
    abbr: "MA",
    content: {
      headline: "Massachusetts Personal Injury Claims",
      subheadline: "Massachusetts modified comparative negligence laws",
      statistic: "Massachusetts has a 3-year statute of limitations for personal injury claims",
      legalInfo: "Massachusetts uses a modified comparative negligence system with a 51% bar. You cannot recover if you're found to be 51% or more at fault.",
      maxDamages: "Massachusetts does not cap compensatory damages in most personal injury cases."
    }
  },
  MI: { 
    name: "Michigan", 
    abbr: "MI",
    content: {
      headline: "Michigan Personal Injury Claims",
      subheadline: "Michigan's no-fault insurance system requires special expertise",
      statistic: "Michigan has a 3-year statute of limitations for personal injury claims",
      legalInfo: "Michigan operates under a modified comparative fault system with a 51% bar. Additionally, Michigan has a no-fault auto insurance system that affects how car accident claims are handled.",
      maxDamages: "Michigan caps non-economic damages in medical malpractice cases."
    }
  },
  MS: { 
    name: "Mississippi", 
    abbr: "MS",
    content: {
      headline: "Mississippi Personal Injury Claims",
      subheadline: "Mississippi pure comparative fault rules",
      statistic: "Mississippi has a 3-year statute of limitations for personal injury claims",
      legalInfo: "Mississippi follows a pure comparative fault rule, which means you can recover damages even if you're 99% at fault, though your award will be reduced accordingly.",
      maxDamages: "Mississippi has caps on non-economic damages in most personal injury cases."
    }
  },
  NH: { 
    name: "New Hampshire", 
    abbr: "NH",
    content: {
      headline: "New Hampshire Personal Injury Claims",
      subheadline: "New Hampshire modified comparative fault laws",
      statistic: "New Hampshire has a 3-year statute of limitations for personal injury claims",
      legalInfo: "New Hampshire uses a modified comparative fault system with a 51% bar. You cannot recover if you're 51% or more at fault for your injuries.",
      maxDamages: "New Hampshire generally does not cap compensatory damages in personal injury cases."
    }
  },
  NY: { 
    name: "New York", 
    abbr: "NY",
    content: {
      headline: "New York Personal Injury Claims",
      subheadline: "New York's pure comparative negligence system",
      statistic: "New York has a 3-year statute of limitations for personal injury claims",
      legalInfo: "New York follows a pure comparative negligence system. Your recovery will be reduced by your percentage of fault, but you can still recover even if you're mostly at fault.",
      maxDamages: "New York does not cap compensatory damages in most personal injury cases."
    }
  },
  OH: { 
    name: "Ohio", 
    abbr: "OH",
    content: {
      headline: "Ohio Personal Injury Claims",
      subheadline: "Ohio's modified comparative fault system",
      statistic: "Ohio has a 2-year statute of limitations for personal injury claims",
      legalInfo: "Ohio uses a modified comparative fault system with a 51% bar. You cannot recover if you're found to be 51% or more at fault for your injuries.",
      maxDamages: "Ohio caps non-economic damages in most personal injury cases."
    }
  },
  TN: { 
    name: "Tennessee", 
    abbr: "TN",
    content: {
      headline: "Tennessee Personal Injury Claims",
      subheadline: "Tennessee's modified comparative fault rules",
      statistic: "Tennessee has a 1-year statute of limitations for personal injury claims",
      legalInfo: "Tennessee follows a modified comparative fault rule. You can recover damages if you're less than 50% responsible, but your award will be reduced by your percentage of fault.",
      maxDamages: "Tennessee has no caps on compensatory damages in most personal injury cases."
    }
  },
  TX: { 
    name: "Texas", 
    abbr: "TX",
    content: {
      headline: "Texas Personal Injury Claims",
      subheadline: "Texas modified comparative fault laws may affect your claim",
      statistic: "Texas has a 2-year statute of limitations for personal injury claims",
      legalInfo: "Texas follows a modified comparative fault rule with a 51% bar. You cannot recover if you're found to be more than 50% responsible for your injuries.",
      maxDamages: "Texas caps non-economic damages in medical malpractice cases but not in most other personal injury claims."
    }
  }
};

// Default state to use if geolocation fails or user is in an unsupported state
export const DEFAULT_STATE = "TX";

/**
 * Get the user's state from their IP address
 * @returns {Promise<{state: string, stateCode: string}>} The user's state name and code
 */
export const getUserStateFromIP = async () => {
  try {
    // Use a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    // Extract the region code (state code)
    const stateCode = data.region_code;
    
    // Check if the state code is valid
    if (stateCode && ALL_US_STATES[stateCode]) {
      // Check if it's in our supported list
      const isSupported = isStateSupported(stateCode);
      
      return {
        stateCode,
        stateName: ALL_US_STATES[stateCode].name,
        isSupported
      };
    }
    
    // Default to TX if not a US state
    return {
      stateCode: DEFAULT_STATE,
      stateName: ALL_US_STATES[DEFAULT_STATE].name,
      isSupported: true
    };
  } catch (error) {
    console.error('Error detecting location:', error);
    
    // Default to TX on error
    return {
      stateCode: DEFAULT_STATE,
      stateName: ALL_US_STATES[DEFAULT_STATE].name,
      isSupported: true
    };
  }
};

/**
 * Get state-specific content based on state code
 * @param {string} stateCode - Two-letter state code
 * @returns {Object} State-specific content
 */
export const getStateContent = (stateCode) => {
  // For supported states, return their specific content
  if (isStateSupported(stateCode)) {
    return SUPPORTED_STATES[stateCode].content;
  }
  
  // For non-supported states, use the DEFAULT_STATE_CONTENT with the state name added
  if (ALL_US_STATES[stateCode]) {
    const stateName = ALL_US_STATES[stateCode].name;
    return {
      ...DEFAULT_STATE_CONTENT,
      headline: `${stateName} Personal Injury Claims`,
      subheadline: `Get expert legal help for your ${stateName} injury case`
    };
  }
  
  // Fallback to the default state content
  return SUPPORTED_STATES[DEFAULT_STATE].content;
};

/**
 * Extract state from a ZIP code (first 2 digits)
 * @param {string} zipCode - 5-digit ZIP code
 * @returns {string|null} Two-letter state code or null if not found
 */
export const getStateFromZip = (zipCode) => {
  // Map of ZIP code prefixes to states
  const zipToState = {
    '01': 'MA', '02': 'MA', '03': 'NH', '04': 'NH', 
    '05': 'VT', '06': 'CT', '07': 'NJ', '08': 'NJ',
    '09': 'PR', '10': 'NY', '11': 'NY', '12': 'NY',
    '13': 'NY', '14': 'NY', '15': 'PA', '16': 'PA',
    '17': 'PA', '18': 'PA', '19': 'PA', '20': 'DC',
    '21': 'MD', '22': 'VA', '23': 'VA', '24': 'VA',
    '25': 'WV', '26': 'WV', '27': 'NC', '28': 'NC',
    '29': 'SC', '30': 'GA', '31': 'GA', '32': 'FL',
    '33': 'FL', '34': 'FL', '35': 'AL', '36': 'AL',
    '37': 'TN', '38': 'TN', '39': 'MS', '40': 'KY',
    '41': 'KY', '42': 'KY', '43': 'OH', '44': 'OH',
    '45': 'OH', '46': 'IN', '47': 'IN', '48': 'MI',
    '49': 'MI', '50': 'IA', '51': 'IA', '52': 'IA',
    '53': 'WI', '54': 'WI', '55': 'MN', '56': 'MN',
  };

  if (!zipCode || zipCode.length < 2) {
    return null;
  }

  const prefix = zipCode.substring(0, 2);
  return zipToState[prefix] || null;
};

/**
 * Track user engagement with state content
 * This helps analyze which states are getting the most traffic
 * @param {string} stateCode - Two-letter state code
 * @param {string} action - The action being taken (view, call, form, etc.)
 */
export const trackStateEngagement = (stateCode, action = 'view') => {
  try {
    // Check if analytics is available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'state_engagement', {
        'state_code': stateCode,
        'action_type': action,
        'partner_id': 'B40i8' // Use the tracking ID from previous implementations
      });
    }

    // Send to our backend API
    recordStateInteraction(stateCode, action, {
      timestamp: new Date().toISOString(),
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : ''
    }).catch(() => {
      // Silently fail - tracking should never impact UX
    });
  } catch (error) {
    // Silently fail - tracking errors should never impact user experience
    console.debug('State tracking error:', error);
  }
};

// Helper function to check if a state is supported
export const isStateSupported = (stateCode) => {
  return Object.keys(SUPPORTED_STATES).includes(stateCode);
};

// Default content for states that don't have specific content yet
const DEFAULT_STATE_CONTENT = {
  headline: "Personal Injury Claims",
  subheadline: "Get expert legal help for your injury case",
  statistic: "Personal injury claims have strict deadlines. Don't wait to get help.",
  legalInfo: "Personal injury laws vary by state. Speak with an attorney to understand your rights.",
  maxDamages: "Compensation varies based on the specifics of your case and applicable state laws."
}; 