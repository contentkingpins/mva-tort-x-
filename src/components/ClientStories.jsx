import React from 'react';
import { motion } from 'framer-motion';

const ClientStories = () => {
  const stories = [
    {
      name: "Sarah L.",
      location: "Phoenix, AZ",
      image: "/images/testimonials/sarah.jpg",
      story: "After my accident, I wasn't sure what to do. My car was damaged, and I was dealing with injuries. Claim Connectors guided me through every step of the process. Within months, I received a settlement that covered all my medical bills and vehicle repairs.",
      result: "$85,000 Settlement"
    },
    {
      name: "James T.",
      location: "Dallas, TX",
      image: "/images/testimonials/james.jpg",
      story: "I was involved in a multi-vehicle accident that wasn't my fault. The other driver's insurance company tried to deny my claim. Thanks to the expert team at Claim Connectors, I was connected with specialists who fought for me and won my case.",
      result: "$125,000 Settlement"
    },
    {
      name: "Michelle K.",
      location: "Portland, OR",
      image: "/images/testimonials/michelle.jpg",
      story: "When my car was hit in a parking lot, I thought it would be a simple process to get compensation. But the insurance company offered far less than needed for repairs. Claim Connectors helped me find representation that got me fair compensation.",
      result: "$32,000 Settlement"
    }
  ];

  return (
    <div className="py-16" style={{ backgroundColor: 'var(--background-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
              Real People, Real Results
            </h2>
            <div className="absolute bottom-0 left-0 right-0 mx-auto h-1 w-32" style={{ backgroundColor: 'var(--gold-accent)' }}></div>
          </div>
          <p className="mt-3 max-w-2xl mx-auto text-xl" style={{ color: 'var(--text-secondary)' }}>
            See how we've helped clients just like you get the compensation they deserve.
          </p>
        </div>

        <div className="mt-12 space-y-6 sm:space-y-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-5 sm:p-6 rounded-xl overflow-hidden shadow-lg"
              style={{ 
                backgroundColor: 'var(--background)',
                boxShadow: '0 4px 12px var(--shadow)',
                transition: `all var(--transition-speed)`,
                borderLeft: '4px solid var(--gold-accent)'
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 mx-auto md:mx-0 mb-4 md:mb-0 md:mr-6">
                  <div className="relative">
                    <img
                      className="h-24 w-24 rounded-full object-cover border-4"
                      style={{ borderColor: 'var(--accent-secondary)' }}
                      src={story.image}
                      alt={`${story.name}`}
                      loading="lazy"
                    />
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--gold-accent)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold" style={{ color: 'var(--accent-primary)' }}>{story.name}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{story.location}</p>
                    </div>
                    <div className="mt-2 md:mt-0 inline-block px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: 'var(--accent-secondary)',
                        color: 'var(--accent-primary)'
                      }}>
                      {story.result}
                    </div>
                  </div>
                  <p className="leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>"{story.story}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#qualification-form"
            className="premium-button inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-md"
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