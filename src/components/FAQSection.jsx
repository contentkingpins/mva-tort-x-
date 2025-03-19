import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How much is my car accident case worth?',
      answer: 'The value of your case depends on several factors, including the severity of your injuries, medical expenses, lost wages, property damage, and pain and suffering. Every case is unique, and our attorneys will evaluate your specific circumstances to provide a realistic assessment of potential compensation.'
    },
    {
      question: 'How long will it take to resolve my case?',
      answer: 'The timeline varies based on case complexity, injury severity, and whether we can reach a fair settlement or need to go to trial. Simple cases might resolve in months, while complex cases could take 1-2 years. Our team works efficiently to reach the best outcome in a reasonable timeframe.'
    },
    {
      question: 'What if the accident was partially my fault?',
      answer: 'Even if you were partially at fault, you may still be entitled to compensation. Many states follow comparative negligence rules, which allow you to recover damages reduced by your percentage of fault. Our attorneys can help determine how these laws apply to your situation.'
    },
    {
      question: 'Do I have to go to court for my car accident case?',
      answer: 'Most car accident cases settle out of court through negotiations with insurance companies. However, if the other party refuses to offer fair compensation, we are fully prepared to take your case to trial to fight for what you deserve.'
    },
    {
      question: 'How much do your attorneys charge?',
      answer: 'We work on a contingency fee basis, which means you pay nothing upfront. We only get paid if we win your case, and our fee is a percentage of the settlement or verdict. This arrangement allows anyone to access quality legal representation regardless of financial situation.'
    },
    {
      question: 'What should I do after a car accident?',
      answer: 'Seek medical attention immediately, report the accident to police, exchange information with other drivers, document the scene with photos, notify your insurance company, and contact an attorney before giving statements to any insurance companies.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto my-16 px-4">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
            initial={false}
            animate={{ 
              height: openIndex === index ? 'auto' : '60px',
              backgroundColor: openIndex === index ? '#f0f9ff' : 'white' 
            }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="w-full px-6 py-4 text-left font-medium flex justify-between items-center focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-gray-800">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-blue-600 transform transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {openIndex === index && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-4 text-gray-600"
              >
                {faq.answer}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <a 
          href="/contact"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default FAQSection; 