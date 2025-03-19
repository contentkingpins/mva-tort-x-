import React from 'react';
import { motion } from 'framer-motion';

const ClientStories = () => {
  const stories = [
    {
      name: "Sarah L.",
      location: "Phoenix, AZ",
      image: "/images/driver-stressed-3.jpg",
      story: "After my accident, I wasn't sure what to do. My car was damaged, and I was dealing with injuries. Claim Connectors guided me through every step of the process. Within months, I received a settlement that covered all my medical bills and vehicle repairs.",
      result: "$85,000 Settlement"
    },
    {
      name: "James T.",
      location: "Dallas, TX",
      image: "/images/car-accident-1.jpg",
      story: "I was involved in a multi-vehicle accident that wasn't my fault. The other driver's insurance company tried to deny my claim. Thanks to the expert team at Claim Connectors, I was connected with specialists who fought for me and won my case.",
      result: "$125,000 Settlement"
    },
    {
      name: "Michelle K.",
      location: "Portland, OR",
      image: "/images/car-damage-2.jpg",
      story: "When my car was hit in a parking lot, I thought it would be a simple process to get compensation. But the insurance company offered far less than needed for repairs. Claim Connectors helped me find representation that got me fair compensation.",
      result: "$32,000 Settlement"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Real People, Real Results
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            See how we've helped clients just like you get the compensation they deserve.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/3">
                  <img
                    className="h-60 w-full object-cover md:h-full"
                    src={story.image}
                    alt={`${story.name}'s accident case`}
                  />
                </div>
                <div className="p-8 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">{story.name}</h3>
                      <p className="text-sm text-gray-500">{story.location}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {story.result}
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed">"{story.story}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#qualification-form"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            See If You Qualify
            <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ClientStories; 