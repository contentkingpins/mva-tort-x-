import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import HeroBanner from './components/HeroBanner';

// Lazy load components to improve initial load performance
const QualificationForm = lazy(() => import('./components/QualificationForm'));
const TrustIndicators = lazy(() => import('./components/TrustIndicators'));
const CompensationBenefits = lazy(() => import('./components/CompensationBenefits'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const ImageCarousel = lazy(() => import('./components/ImageCarousel'));
const ClientStories = lazy(() => import('./components/ClientStories'));
const SafetyTips = lazy(() => import('./components/SafetyTips'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-6 bg-red-50 text-red-700 rounded-lg my-4 max-w-lg mx-auto" role="alert">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="mb-4">We encountered an error loading this component.</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status monitoring (React 18 feature: automatic batching in event handlers)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show offline message if user is offline
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-md w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You are currently offline. Some features may not be available.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Banner */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HeroBanner />
      </ErrorBoundary>
      
      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Qualification Form */}
        <div id="qualification-form" className="mb-12 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-6 sm:mb-12">
            Free Claim Evaluation
          </h2>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingFallback />}>
              <QualificationForm />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Image Carousel */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <ImageCarousel />
          </Suspense>
        </ErrorBoundary>
      </div>
      
      {/* Client Stories */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <ClientStories />
        </Suspense>
      </ErrorBoundary>
      
      {/* Trust Indicators */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <TrustIndicators />
        </Suspense>
      </ErrorBoundary>
      
      {/* Compensation Benefits */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingFallback />}>
              <CompensationBenefits />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Safety Tips */}
      <div id="safety-tips">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <SafetyTips />
          </Suspense>
        </ErrorBoundary>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingFallback />}>
              <FAQSection />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
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
                aria-label="Call our support team at 1-800-123-4567"
              >
                Call 1-800-123-4567
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Claim Connectors. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 