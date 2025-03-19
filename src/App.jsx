import React from 'react';
import QualificationForm from './components/QualificationForm';
import TrustIndicators from './components/TrustIndicators';
import CompensationBenefits from './components/CompensationBenefits';
import FAQSection from './components/FAQSection';
import ImageCarousel from './components/ImageCarousel';
import ClientStories from './components/ClientStories';
import SafetyTips from './components/SafetyTips';
import HeroBanner from './components/HeroBanner';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Banner */}
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Qualification Form */}
        <div id="qualification-form" className="mb-20">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            Free Claim Evaluation
          </h2>
          <QualificationForm />
        </div>
        
        {/* Image Carousel */}
        <ImageCarousel />
      </div>
      
      {/* Client Stories */}
      <ClientStories />
      
      {/* Trust Indicators */}
      <TrustIndicators />
      
      {/* Compensation Benefits */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <CompensationBenefits />
        </div>
      </div>
      
      {/* Safety Tips */}
      <div id="safety-tips">
        <SafetyTips />
      </div>
      
      {/* FAQ Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <FAQSection />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Claim Connectors</h3>
              <p className="text-gray-300">
                Connecting accident victims with the right help to get the compensation they deserve.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#qualification-form" className="text-gray-300 hover:text-white transition-colors">Check Eligibility</a></li>
                <li><a href="#safety-tips" className="text-gray-300 hover:text-white transition-colors">Safety Resources</a></li>
                <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-300 mb-2">Have questions? Our team is here to help.</p>
              <a 
                href="tel:+18001234567"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Call 1-800-123-4567
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 Claim Connectors. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 