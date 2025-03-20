import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    {
      src: '/images/shutterstock_2310978881.jpg',
      alt: 'Car accident involving multiple vehicles',
      caption: 'Even in complex multi-vehicle accidents, we help you navigate the claims process',
      description: 'Don\'t face insurance companies alone. Our experts connect you with the right help.'
    },
    {
      src: '/images/shutterstock_2465073405.jpg',
      alt: 'Person checking damage to their vehicle',
      caption: 'Dealing with vehicle damage after an accident?',
      description: 'We help you get fair compensation for repairs or replacement of your damaged property.'
    },
    {
      src: '/images/shutterstock_2386561053.jpg',
      alt: 'Person on phone next to damaged car',
      caption: 'Feeling overwhelmed after your accident?',
      description: 'Our claim specialists guide you through every step of the process with compassion and expertise.'
    },
    {
      src: '/images/rainy-driving.jpg',
      alt: 'Traffic in rainy weather seen from inside car',
      caption: 'Accidents happen in challenging conditions',
      description: 'Whether it\'s bad weather or poor visibility, we understand the complexities of your claim.'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-12 rounded-xl overflow-hidden shadow-2xl">
      <div className="relative h-96 md:h-[500px] bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img 
              src={images[currentIndex].src} 
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-2xl font-bold mb-2">{images[currentIndex].caption}</h3>
              <p className="text-lg">{images[currentIndex].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <button 
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-30"
          aria-label="Previous image"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-30"
          aria-label="Next image"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-3 w-3 rounded-full transition-colors ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel; 