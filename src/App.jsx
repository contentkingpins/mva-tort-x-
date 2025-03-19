import React from 'react';
import QualificationForm from './components/QualificationForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Injured in a Car Accident?
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-6">
            Find Out If You Qualify for Maximum Compensation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our experienced attorneys fight for your rights. Get a free case evaluation today.
          </p>
        </div>
        
        <QualificationForm />
        
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>© 2023 Your Law Firm Name, PLLC. All rights reserved.</p>
          <p className="mt-2">
            <a href="/privacy-policy" className="text-blue-600 hover:underline mx-2">Privacy Policy</a>
            <a href="/terms-of-service" className="text-blue-600 hover:underline mx-2">Terms of Service</a>
            <a href="/contact" className="text-blue-600 hover:underline mx-2">Contact Us</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App; 