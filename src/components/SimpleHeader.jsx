import React from 'react';
import EnhancedClickToCall from './EnhancedClickToCall';

// Simple header component with explicit inline styles to ensure visibility
const SimpleHeader = ({ phoneNumber, formattedPhoneNumber }) => {
  return (
    <div style={{
      backgroundColor: '#2563eb',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #1e40af',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Logo/Title - removed */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* CC logo has been removed */}
        </div>
        
        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Call button - using EnhancedClickToCall for Ringba tracking */}
          <EnhancedClickToCall 
            phoneNumber={phoneNumber}
            formattedPhoneNumber={formattedPhoneNumber}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '6px',
              fontWeight: '500',
              fontSize: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none'
            }}
            iconClassName="phone-icon"
            showIcon={true}
          >
            Call
          </EnhancedClickToCall>
          
          {/* Free Evaluation button */}
          <a 
            href="#qualification-form"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              backgroundColor: '#1e3a8a',
              color: 'white',
              borderRadius: '6px',
              fontWeight: '500',
              fontSize: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none'
            }}
          >
            Free Evaluation
          </a>
        </div>
      </div>
      
      {/* Responsive styles - injected into document to ensure they work */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .phone-icon {
            margin-right: 4px;
            width: 16px;
            height: 16px;
          }
        `
      }} />
    </div>
  );
};

export default SimpleHeader; 