// Type definitions for components

// ContactForm component
interface ContactFormProps {
  onSubmit: (contactInfo: ContactInfo) => Promise<void> | void;
  simplified?: boolean;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  preferredContact: 'phone' | 'email' | 'text';
}

// ProgressBar component
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

// QualificationForm component
interface FormData {
  accidentDate: string | null;
  medicalTreatment: boolean | null;
  medicalTreatmentDate: string | null;
  atFault: boolean | null;
  hasAttorney: string | null;
  movingViolation: boolean | null;
  priorSettlement: boolean | null;
  insuranceCoverage: {
    liability: boolean;
    uninsured: boolean;
    underinsured: boolean;
  };
}

interface QuestionOption {
  value: string | boolean;
  label: string;
  isQualifying?: boolean;
}

interface CheckboxOption {
  id: string;
  label: string;
}

interface Question {
  id: string;
  question: string;
  helpText?: string;
  type: 'boolean' | 'date' | 'select' | 'checkbox';
  options?: QuestionOption[] | CheckboxOption[];
  validation?: (value: any, formData?: FormData) => boolean;
  reverseLogic?: boolean;
  followUp?: {
    condition: (value: any) => boolean;
    question: Question;
  };
}

// ErrorBoundary component
interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif'; 