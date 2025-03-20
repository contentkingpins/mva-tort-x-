# Geolocation & State-Specific Content System

This document provides an overview of the geolocation and state-specific content system implemented in the TortX legal lead generation website.

## Overview

The geolocation system detects a visitor's state based on their IP address and displays personalized content relevant to their location. This improves user engagement by showing state-specific legal information about personal injury cases in their jurisdiction.

## Features

- **IP-based Geolocation**: Automatically detects user's state
- **State-Specific Content**: Displays personalized legal information for each state
- **Manual State Selection**: Allows users to manually change their state
- **Form Integration**: Captures state information in lead forms
- **Analytics Tracking**: Records state engagement metrics for analysis

## Supported States

The system currently supports 18 states with tailored content:
AL, AZ, CA, CO, CT, FL, GA, IL, IA, KY, MA, MI, MS, NH, NY, OH, TN, TX

## Implementation Components

### 1. GeoLocationContext

The `GeoLocationContext` provides state location data throughout the application. It handles:
- IP-based state detection
- State storage in localStorage for returning visitors
- State switching functionality

```jsx
// Usage example
import { useGeoLocation } from '../context/GeoLocationContext';

function MyComponent() {
  const { stateCode, stateName, content, isLoading } = useGeoLocation();
  
  // Use the state data
}
```

### 2. StateContent Component

The `StateContent` component displays state-specific information including:
- State name with legal headline
- Statute of limitations information
- Negligence laws applicable to the state
- Damage caps information
- State selection dropdown

```jsx
// Usage example
import StateContent from '../components/StateContent';

function MyPage() {
  return (
    <div>
      {/* Other content */}
      <StateContent />
      {/* Other content */}
    </div>
  );
}
```

### 3. Form Data Integration

The `FormDataContext` integrates with the geolocation system to:
- Include state data in lead submissions
- Match ZIP code with states
- Track state-specific conversions

```jsx
// Usage example
import { useFormData } from '../context/FormDataContext';

function MyForm() {
  const { formData, updateFormData, submitFormWithStateData } = useFormData();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use submitFormWithStateData for API submissions
    await submitFormWithStateData('/api/endpoint', (result) => {
      // Handle response
    });
  };
}
```

### 4. Analytics & Tracking

The system includes analytics integration to track:
- State views
- User interactions with state content
- Form submissions by state
- Click-to-call actions by state

## Configuration

### Environment Variables

The following environment variables can be set to configure the system:

```
REACT_APP_ANALYTICS_ENDPOINT=https://api.yoursite.com/analytics
REACT_APP_PARTNER_ID=YourPartnerID
```

### Default State

If geolocation fails or the user is in an unsupported state, the system defaults to Texas (TX).

## Adding New States

To add support for a new state:

1. Update the `SUPPORTED_STATES` object in `src/utils/geolocation.js`:

```javascript
export const SUPPORTED_STATES = {
  // Existing states...
  
  // Add new state
  NJ: { 
    name: "New Jersey", 
    abbr: "NJ",
    content: {
      headline: "New Jersey Personal Injury Claims",
      subheadline: "New Jersey comparative negligence laws",
      statistic: "New Jersey has a 2-year statute of limitations for personal injury claims",
      legalInfo: "New Jersey follows a modified comparative negligence system with a 51% bar...",
      maxDamages: "New Jersey does not cap compensatory damages in most personal injury cases."
    }
  },
};
```

## Best Practices

1. **Performance**: The geolocation lookup occurs only once per session and is cached in localStorage
2. **Fallbacks**: Always provide a default experience for users with location services disabled
3. **Privacy**: The system doesn't store personally identifiable information, only state codes
4. **Analytics**: Use the tracking data to optimize content for high-performing states

## Troubleshooting

### Geolocation Not Working

Possible issues:
- User has VPN enabled (shows VPN server location)
- IP geolocation service is down (will fall back to default state)
- Browser has location services disabled

### Testing Different States

For testing:
1. Clear localStorage (this removes saved state)
2. Use the state dropdown to manually select different states
3. Use a VPN to test automatic detection

## Changelog

- v1.0: Initial implementation with basic state detection
- v1.1: Added enhanced legal content for each state
- v1.2: Integrated with form submissions
- v1.3: Added analytics tracking 