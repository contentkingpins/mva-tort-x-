import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFormData } from '../context/FormDataContext';

const ContactForm = ({ onSubmit, simplified = false, formError = null, csrfToken = '' }) => {
  const { updateFormData } = useFormData();
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    preferredContact: 'phone'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showFormError, setShowFormError] = useState(!!formError);

  // Update the form error display when props change
  useEffect(() => {
    setShowFormError(!!formError);
  }, [formError]);

  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = phoneNumberString.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const formatted = [
        match[1] ? `(${match[1]}` : '',
        match[2] ? `) ${match[2]}` : '',
        match[3] ? `-${match[3]}` : ''
      ].join('');
      return formatted.trim();
    }
    return phoneNumberString;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear form error when user starts typing
    if (showFormError) {
      setShowFormError(false);
    }
    
    if (name === 'phone') {
      // Only format if we're not deleting characters
      const isDeleting = value.length < contactInfo.phone.length;
      const newValue = isDeleting ? value : formatPhoneNumber(value);
      setContactInfo(prev => ({ ...prev, [name]: newValue }));
    } else {
      setContactInfo(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Update form data context when contact info changes
  useEffect(() => {
    // Only update if we have some data filled in
    if (contactInfo.firstName || contactInfo.email || contactInfo.phone) {
      // Map to the context structure
      const contactData = {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone.replace(/\D/g, ''), // Clean phone number for API
        zip: contactInfo.zipCode,
        // Add additional fields required by Pingtree API
        mobile: contactInfo.phone.replace(/\D/g, ''), // Ensure mobile field is set
        channel: "Website", // Default channel for Pingtree
      };
      
      updateFormData(contactData);
    }
  }, [contactInfo, updateFormData]);

  const validateForm = () => {
    const newErrors = {};
    
    // First name validation - required for Pingtree
    if (!contactInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Last name validation - required for Pingtree
    if (!contactInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Email validation - required for Pingtree
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(contactInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation - required for Pingtree as "mobile"
    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const digitsOnly = contactInfo.phone.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
    }
    
    // ZIP code validation - important for determining incident_state
    if (!contactInfo.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(contactInfo.zipCode)) {
      newErrors.zipCode = 'ZIP code is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't try to submit again if already submitting
    if (isSubmitting || formSubmitted) return;
    
    if (validateForm()) {
      setIsSubmitting(true); // Now we start the loading/submitting state
      
      try {
        // Extract clean phone number for mobile field
        const mobileNumber = contactInfo.phone.replace(/\D/g, '');
        
        // Pass all required Pingtree fields
        await onSubmit({
          ...contactInfo,
          mobile: mobileNumber, // Ensure mobile field is set for Pingtree
          channel: "Website", // Default channel
        });
        
        setFormSubmitted(true);
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ submit: 'Failed to submit form. Please try again.' });
        setShowFormError(true);
        setFormSubmitted(false);
      } finally {
        // Keep isSubmitting true if successfully submitted
        // This prevents repeated submissions and keeps spinner visible
        if (!formSubmitted) {
          setIsSubmitting(false);
        }
      }
    }
  };

  // For screen readers to announce validation errors
  useEffect(() => {
    const errorsList = Object.values(errors).filter(Boolean);
    if (errorsList.length > 0) {
      // This would be announced by screen readers
      document.title = `Form has ${errorsList.length} error${errorsList.length > 1 ? 's' : ''}`;
    }
  }, [errors]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      {!simplified && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
            Get Your Free Case Evaluation
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Please provide your contact information so our attorneys can review your case.
          </p>
        </>
      )}
      
      {/* Display form error if present */}
      {showFormError && formError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm" role="alert">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {formError}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowFormError(false)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Contact information form">
        {errors.submit && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg" role="alert">
            {errors.submit}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name<span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={contactInfo.firstName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600" id="firstName-error">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name<span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={contactInfo.lastName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600" id="lastName-error">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address<span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={contactInfo.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" id="email-error">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number<span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={contactInfo.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600" id="phone-error">{errors.phone}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code<span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={contactInfo.zipCode}
            onChange={handleChange}
            placeholder="12345"
            aria-required="true"
            aria-invalid={!!errors.zipCode}
            aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
            maxLength="10"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.zipCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600" id="zipCode-error">{errors.zipCode}</p>
          )}
        </div>
        
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Method
          </legend>
          <div className="flex flex-wrap space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value="phone"
                checked={contactInfo.preferredContact === 'phone'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Phone</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value="email"
                checked={contactInfo.preferredContact === 'email'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Email</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value="text"
                checked={contactInfo.preferredContact === 'text'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Text</span>
            </label>
          </div>
        </fieldset>
        
        <div className="text-sm text-gray-600 mt-4">
          <p>
            By submitting this form, you agree to our{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/terms-of-service" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || formSubmitted}
          aria-busy={isSubmitting}
          className={`w-full py-3 px-4 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md`}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center">
              Processing...
            </span>
          ) : (
            'Submit My Case for Review'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ContactForm; 