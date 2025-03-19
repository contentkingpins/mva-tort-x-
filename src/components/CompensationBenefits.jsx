import React from 'react';

const CompensationBenefits = () => {
  const benefits = [
    {
      title: "Medical Expenses",
      description: "Coverage for hospital bills, surgeries, medication, rehabilitation, and any ongoing medical care related to your injuries.",
      icon: "medical-symbol"
    },
    {
      title: "Lost Wages",
      description: "Compensation for income lost during recovery, as well as loss of future earning capacity if your injuries impact your ability to work.",
      icon: "dollar-sign"
    },
    {
      title: "Pain & Suffering",
      description: "Monetary relief for the physical pain, emotional distress, and mental anguish you've endured due to the accident.",
      icon: "heart"
    },
    {
      title: "Property Damage",
      description: "Reimbursement for repair or replacement of your vehicle and any other personal property damaged in the crash.",
      icon: "car"
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Compensation You Could Receive
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            If you qualify, our legal team will pursue maximum compensation for all of your losses.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{benefit.title}</h3>
                    <p className="mt-5 text-base text-gray-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompensationBenefits; 