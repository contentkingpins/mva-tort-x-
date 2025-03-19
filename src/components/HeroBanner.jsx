import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative bg-gray-900">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="/images/car-accident-1.jpg"
          alt="Accident scene showing vehicles involved in collision"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl lg:text-6xl">
            Injured in an Accident?
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            You may be entitled to compensation. Our expert team connects you with the right help to ensure you get the settlement you deserve.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#qualification-form"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors shadow-lg"
            >
              Check If You Qualify
            </a>
            <a
              href="#safety-tips"
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
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