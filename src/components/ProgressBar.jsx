import React from 'react';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-between mb-2 text-sm text-gray-600">
        <span>
          Step <span className="font-medium">{currentStep + 1}</span> of {totalSteps}
        </span>
        <span aria-hidden="true">{Math.round(progress)}% Complete</span>
      </div>
      <div 
        className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`Form completion: ${Math.round(progress)}%`}
      >
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        >
          <span className="sr-only">{Math.round(progress)}% Complete</span>
        </div>
      </div>
      {/* Mobile-friendly step indicator */}
      <div className="mt-4 hidden sm:flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`w-8 h-1 rounded-full ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar; 