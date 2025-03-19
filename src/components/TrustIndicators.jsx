import React from 'react';

const TrustIndicators = () => {
  const testimonials = [
    {
      quote: "After my accident, I was overwhelmed with medical bills and insurance calls. The expert team guided me through every step and secured a settlement that covered all my expenses.",
      author: "J.S., Accident Client",
      rating: 5
    },
    {
      quote: "I was hesitant to pursue a claim, but I'm so glad I did. The specialists were professional, responsive, and truly cared about my recovery.",
      author: "M.R., Personal Injury Client",
      rating: 5
    },
    {
      quote: "The attention to detail and level of communication exceeded my expectations. They fought hard for me and it paid off.",
      author: "T.K., Accident Client",
      rating: 5
    }
  ];

  const badges = [
    { name: "A+ BBB Accreditation", icon: "shield-check" },
    { name: "10.0 Superb Rating", icon: "star" },
    { name: "Top 100 Claim Specialists", icon: "award" },
    { name: "Million Dollar Results", icon: "cash" }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by Accident Victims Nationwide
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Our clients trust us to fight for their rights and secure the compensation they deserve.
          </p>
        </div>

        {/* Badges */}
        <div className="mt-10">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-3 text-sm font-medium text-gray-900">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic mb-4">"{testimonial.quote}"</blockquote>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {testimonial.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators; 