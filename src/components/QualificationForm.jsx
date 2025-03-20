import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import ContactForm from './ContactForm';
import EnhancedClickToCall from './EnhancedClickToCall';
import { useFormData } from '../context/FormDataContext';
import { submitQualifiedLead } from '../utils/pingtreeAPI';

const QualificationForm = () => {
  const { updateFormData } = useFormData();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
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
    }
  });
  
  const [isQualified, setIsQualified] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Fetch CSRF token on component mount
  useEffect(() => {
    // This would normally fetch from your server
    // Instead, we'll simulate it with a random token
    const generateToken = () => {
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    };
    
    setCsrfToken(generateToken());
  }, []);
  
  // Update context when form data changes
  useEffect(() => {
    updateFormData(formData);
  }, [formData, updateFormData]);
  
  // Clear transition state on component updates
  // This fixes the continuous loading bug
  useEffect(() => {
    let transitionTimer;
    if (isTransitioning) {
      transitionTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }
    return () => {
      if (transitionTimer) clearTimeout(transitionTimer);
    };
  }, [isTransitioning]);

  const [questions] = useState([
    {
      id: 'accidentDate',
      question: 'When did your accident occur?',
      helpText: 'This helps us understand the timeline of your case.',
      type: 'date',
      validation: (value) => {
        if (!value) return false;
        const date = new Date(value);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        // Check if date is valid
        if (isNaN(date.getTime())) return false;
        
        // Check if date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date > today) return false;
        
        // Check if date is too old (more than 1 year)
        return date >= oneYearAgo;
      }
    },
    {
      id: 'medicalTreatment',
      question: 'Did you receive medical treatment after the accident?',
      helpText: 'Medical records are important for documenting your injuries.',
      type: 'boolean',
      followUp: {
        condition: (value) => value === true,
        question: {
          id: 'medicalTreatmentDate',
          question: 'Approximately when did you first receive medical treatment?',
          helpText: 'An approximate date is fine.',
          type: 'date',
          validation: (value, formData) => {
            if (!value || !formData.accidentDate) return false;
            
            const treatmentDate = new Date(value);
            const accidentDate = new Date(formData.accidentDate);
            
            // Check if date is valid
            if (isNaN(treatmentDate.getTime())) return false;
            
            // Check if treatment date is in the future
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (treatmentDate > today) return false;
            
            // Treatment must be after accident date
            if (treatmentDate < accidentDate) return false;
            
            return true;
          }
        }
      }
    },
    {
      id: 'atFault',
      question: 'Were you found at fault for the accident?',
      helpText: 'This helps us understand liability in your case.',
      type: 'boolean',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
        { value: null, label: 'Unsure' }
      ],
      reverseLogic: true // "No" is the qualifying answer
    },
    {
      id: 'hasAttorney',
      question: 'Do you currently have an attorney handling your case?',
      helpText: 'We want to ensure we\'re not interfering with existing representation.',
      type: 'select',
      options: [
        { value: 'no', label: 'No', isQualifying: true },
        { value: 'yes-change', label: 'Yes, but I\'m considering a change', isQualifying: true },
        { value: 'yes', label: 'Yes, and I want to keep them', isQualifying: false }
      ]
    },
    {
      id: 'movingViolation',
      question: 'Did you receive a traffic ticket or moving violation from this accident?',
      helpText: 'This helps us understand the circumstances of the accident.',
      type: 'boolean',
      reverseLogic: true // "No" is the qualifying answer
    },
    {
      id: 'priorSettlement',
      question: 'Have you already received a settlement for this accident?',
      helpText: 'This helps us understand if your case has already been resolved.',
      type: 'boolean',
      reverseLogic: true // "No" is the qualifying answer
    },
    {
      id: 'insuranceCoverage',
      question: 'Which insurance coverage is applicable in your situation?',
      helpText: 'Select all that apply. This helps us understand potential sources of recovery.',
      type: 'checkbox',
      options: [
        { id: 'liability', label: 'The other party\'s insurance' },
        { id: 'uninsured', label: 'Your Uninsured Motorist (UM) coverage' },
        { id: 'underinsured', label: 'Your Underinsured Motorist (UIM) coverage' }
      ],
      validation: (value) => Object.values(value).some(v => v === true)
    }
  ]);

  const handleInputChange = (questionId, value) => {
    setValidationError(null);
    setFormError(null);
    
    setFormData(prev => {
      if (questionId === 'insuranceCoverage') {
        // Handle checkbox changes for insurance coverage
        const updatedCoverage = {
          ...prev.insuranceCoverage,
          [value.id]: value.checked
        };
        
        // Log for debugging
        console.log(`Updated insurance coverage:`, updatedCoverage);
        
        return {
          ...prev,
          insuranceCoverage: updatedCoverage
        };
      }
      
      // For state/location information
      if (questionId === 'location' && value) {
        // Extract state from location (simplified for demo)
        const stateMatch = value.match(/([A-Z]{2})$/);
        if (stateMatch && stateMatch[1]) {
          return { 
            ...prev, 
            [questionId]: value,
            incidentState: stateMatch[1]
          };
        }
      }
      
      return { ...prev, [questionId]: value };
    });
  };

  const handleNext = () => {
    // Validate current question
    const currentQuestion = questions[currentStep];
    const value = formData[currentQuestion.id];
    
    // Special handling for checkbox type questions
    if (currentQuestion.type === 'checkbox') {
      // Check if at least one option is selected
      const isValid = Object.values(formData[currentQuestion.id] || {}).some(v => v === true);
      if (!isValid) {
        setValidationError(`Please select at least one option for ${currentQuestion.id}`);
        return;
      }
    } else if (currentQuestion.validation && !currentQuestion.validation(value)) {
      setValidationError(`Please provide a valid ${currentQuestion.id}`);
      return;
    }
    
    // Start transition animation
    setIsTransitioning(true);
    
    // Delay to allow animation to complete
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // On the last question, move to results and check qualification
        setCurrentStep(questions.length); // Ensure we're beyond questions
        checkQualification();
      }
    }, 200);
  };

  const handleBack = () => {
    // Start transition animation
    setIsTransitioning(true);
    
    // Delay to allow animation to complete
    setTimeout(() => {
      setCurrentStep(prev => Math.max(0, prev - 1));
    }, 200);
  };

  const checkQualification = () => {
    try {
      // Simplified validation for demo purposes
      console.log("Running qualification check");
      
      // Check if any insurance coverage is selected
      const hasInsurance = Object.values(formData.insuranceCoverage).some(v => v === true);
      console.log("Has insurance selected:", hasInsurance);
      
      // In a real app, more logic would be here
      // For now, we'll qualify most users
      setIsQualified(true);
      setIsTransitioning(false);
    } catch (error) {
      console.error("Error during qualification check:", error);
      setFormError("An error occurred while processing your information. Please try again.");
      setIsQualified(false);
      setIsTransitioning(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setFormData({
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
      }
    });
    setIsQualified(null);
    setFormSubmitted(false);
    setFormError(null);
    setValidationError(null);
  };

  const handleSubmitContactInfo = async (contactInfo) => {
    try {
      setIsLoading(true);
      setFormError(null);
      
      // Update context with contact information
      updateFormData({
        ...contactInfo,
        sourceId: `tortx_lead_${Date.now()}` // Generate a unique source ID
      });
      
      // Check if we're in development mode
      const isTestSubmission = process.env.NODE_ENV === 'development';
      
      // Submit to Pingtree API
      const apiResult = await submitQualifiedLead(
        formData,
        contactInfo,
        isTestSubmission
      );
      
      // Check if submission was successful
      if (apiResult.status === "error") {
        console.error("Error submitting to Pingtree:", apiResult.message);
        setFormError("We encountered an issue submitting your information. Please try again or call us directly.");
        return;
      }
      
      // Set form as submitted on success
      setFormSubmitted(true);
      
      // Scroll to top of form to ensure notification is visible
      const formElement = document.getElementById('qualification-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError("We couldn't submit your information. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  // Phone number for click-to-call
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

  // Render the current question
  const renderQuestion = () => {
    const question = questions[currentStep];
    
    // Determine if we're in a loading/transitioning state
    const isInTransition = isLoading || isTransitioning;
    
    if (validationError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
        >
          <p className="text-red-700">{validationError}</p>
        </motion.div>
      );
    }
    
    return (
      <motion.div
        key={`question-${currentStep}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isInTransition ? 0.5 : 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className={`py-6 ${isInTransition ? 'pointer-events-none' : ''}`}
      >
        <h3 className="text-xl font-bold mb-3 text-gray-900">{question.question}</h3>
        
        {question.helpText && (
          <p className="text-gray-600 mb-4">{question.helpText}</p>
        )}
        
        {question.type === 'boolean' && (
          <div className="flex flex-wrap gap-4">
            {(question.options || [
              { value: true, label: 'Yes' },
              { value: false, label: 'No' }
            ]).map(option => (
              <button
                key={String(option.value)}
                onClick={() => handleInputChange(question.id, option.value)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  formData[question.id] === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                aria-pressed={formData[question.id] === option.value}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {question.type === 'date' && (
          <div>
            <input
              type="date"
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              value={formData[question.id] || ''}
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-invalid={question.validation && formData[question.id] && !question.validation(formData[question.id], formData)}
            />
            {formData[question.id] && question.validation && !question.validation(formData[question.id], formData) && (
              <p className="text-red-500 mt-2">
                {question.id === 'accidentDate' 
                  ? 'Your accident must have occurred within the last 12 months and not be in the future.'
                  : question.id === 'medicalTreatmentDate'
                  ? 'Treatment date must be after the accident date and not in the future.'
                  : 'Please enter a valid date.'}
              </p>
            )}
          </div>
        )}

        {question.type === 'select' && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleInputChange(question.id, option.value)}
                className={`w-full text-left px-6 py-3 rounded-lg transition-colors ${
                  formData[question.id] === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                aria-pressed={formData[question.id] === option.value}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {question.type === 'checkbox' && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={formData.insuranceCoverage[option.id] || false}
                  onChange={(e) => {
                    // Log the change for debugging
                    console.log(`Checkbox change: ${option.id} = ${e.target.checked}`);
                    
                    handleInputChange('insuranceCoverage', {
                      id: option.id,
                      checked: e.target.checked
                    });
                  }}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor={option.id} className="ml-3 text-gray-700 cursor-pointer">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  // Render results or contact form after all questions
  const renderResults = () => {
    if (formError) {
      return (
        <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500 my-8">
          <h3 className="text-xl font-bold text-red-700 mb-2">
            Error
          </h3>
          <p className="text-red-700 mb-4">
            {formError}
          </p>
          <button
            onClick={() => setFormError(null)}
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (formSubmitted) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-6 rounded-lg mb-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16">
              <svg className="absolute rotate-45 transform -translate-y-6 -translate-x-6 h-24 w-24 text-blue-200 fill-current" viewBox="0 0 24 24">
                <path d="M12 0L12 24M0 12L24 12"></path>
              </svg>
            </div>
            <div className="flex items-center justify-center mb-4 text-blue-600">
              <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Claim Submitted Successfully!</h3>
            <p className="text-lg">
              Your information has been received and is being processed. A legal specialist will contact you within 24 hours to discuss your case.
            </p>
            <div className="mt-3 text-sm font-medium">
              Reference ID: {`CL-${Date.now().toString().substring(6)}`}
            </div>
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-xl font-semibold mb-4">What Happens Next?</h4>
            <ol className="text-left space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 font-bold">1</span>
                <span>A case specialist will review your information within 24 hours.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 font-bold">2</span>
                <span>We'll contact you via your preferred method to discuss your case in detail.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 font-bold">3</span>
                <span>Our team will explain your options and recommend the best path forward.</span>
              </li>
            </ol>
            <div className="mt-6 text-center">
              <EnhancedClickToCall
                phoneNumber={phoneNumber}
                formattedPhoneNumber={formattedPhoneNumber}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                buttonText={`Questions? Call Us: ${formattedPhoneNumber}`}
              />
            </div>
          </div>
        </motion.div>
      );
    }

    if (isQualified === true) {
      return (
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 my-8">
          <h3 className="text-xl font-bold text-blue-700 mb-2">
            Good news! You may qualify for compensation.
          </h3>
          <p className="text-blue-700 mb-4">
            Based on your responses, you potentially have a valid claim. Please complete the form below so we can connect you with the right help.
          </p>
          {formSubmitted ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-center mb-4 text-blue-600">
                <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-center">Claim Submitted Successfully!</h4>
              <p className="mb-4 text-center text-gray-600">
                Your information has been submitted successfully. One of our specialists will contact you shortly to discuss your case.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
                <EnhancedClickToCall
                  phoneNumber={phoneNumber}
                  formattedPhoneNumber={formattedPhoneNumber}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  buttonText={`Call Us Now: ${formattedPhoneNumber}`}
                />
                <button
                  onClick={resetForm}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Start a New Evaluation
                </button>
              </div>
            </div>
          ) : (
            <div className={isLoading ? 'opacity-60 pointer-events-none' : ''}>
              <ContactForm
                onSubmit={handleSubmitContactInfo}
                formError={formError}
                csrfToken={csrfToken}
              />
              {isLoading && (
                <div className="flex justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    } else if (isQualified === false) {
      return (
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 my-8">
          <h3 className="text-xl font-bold text-blue-700 mb-2">
            Thank you for your interest
          </h3>
          <p className="text-blue-700 mb-4">
            Based on your responses, your case may not qualify for our services at this time. However, each case is unique, and you may want to consult with a legal professional directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <EnhancedClickToCall
              phoneNumber={phoneNumber}
              formattedPhoneNumber={formattedPhoneNumber}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              buttonText={`Call for Consultation: ${formattedPhoneNumber}`}
            />
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Start a New Evaluation
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Added debug function to help diagnose form issues
  const debugFormData = () => {
    console.log("Current form data:", formData);
    console.log("Insurance coverage:", formData.insuranceCoverage);
    
    // Check if any insurance option is selected
    const hasInsurance = Object.values(formData.insuranceCoverage).some(v => v === true);
    console.log("Has insurance selected:", hasInsurance);
    
    return hasInsurance;
  };

  const handleSubmit = () => {
    // Debug log
    debugFormData();
    
    // Validate the last question (insurance coverage)
    const hasInsurance = Object.values(formData.insuranceCoverage).some(v => v === true);
    
    if (!hasInsurance) {
      setValidationError("Please select at least one insurance coverage option");
      return;
    }
    
    // If valid, proceed to qualification
    checkQualification();
    // Explicitly move beyond questions array
    setCurrentStep(questions.length);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Free Claim Evaluation
      </h2>
      
      {currentStep < questions.length && (
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={questions.length} 
        />
      )}
      
      <AnimatePresence mode="wait">
        {currentStep < questions.length ? renderQuestion() : renderResults()}
      </AnimatePresence>
      
      {/* Loading indicator only during active transitions */}
      {isTransitioning && currentStep < questions.length && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {currentStep < questions.length && (
        <div className="flex justify-between mt-8">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              type="button"
              disabled={isTransitioning}
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}
          
          <button
            onClick={currentStep === questions.length - 1 ? handleSubmit : handleNext}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isTransitioning ? 'opacity-70 cursor-not-allowed' : ''}`}
            type="button"
            disabled={isTransitioning}
          >
            {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QualificationForm; 