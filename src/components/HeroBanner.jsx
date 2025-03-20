import React from 'react';

const HeroBanner = ({ phoneNumber, formattedPhoneNumber }) => {
  return (
    <div className="relative bg-blue-700">
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl lg:text-6xl">
            Injured in an Accident?
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            You may be entitled to compensation. Our expert team connects you with the right help to ensure you get the settlement you deserve.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <a
                href="#qualification-form"
                className="w-full inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-md shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Check If You Qualify
              </a>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="#safety-tips"
              className="w-full inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
            >
              Safety Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner; 