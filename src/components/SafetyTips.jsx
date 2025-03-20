import React from 'react';

const SafetyTips = () => {
  const tips = [
    {
      title: "Drive Defensively",
      description: "Always be aware of other drivers and be prepared for unexpected actions."
    },
    {
      title: "Avoid Distractions",
      description: "Never text and drive. Keep your phone away and focus on the road."
    },
    {
      title: "Weather Precautions",
      description: "Slow down in rain, snow, or fog. Leave extra distance between vehicles in bad weather."
    },
    {
      title: "Regular Maintenance",
      description: "Keep your vehicle in good condition with regular checks of brakes, tires, and lights."
    },
    {
      title: "Follow Traffic Laws",
      description: "Obey speed limits, traffic signals, and right-of-way rules."
    },
    {
      title: "Stay Alert",
      description: "Never drive when tired, under the influence, or taking medication that causes drowsiness."
    }
  ];

  return (
    <div className="py-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
              Preventing Accidents
            </h2>
            <p className="mt-3 text-xl" style={{ color: 'var(--text-secondary)' }}>
              While we're here to help when accidents happen, we also care about your safety. Follow these tips to reduce your risk on the road.
            </p>
            <div className="mt-6 relative rounded-xl overflow-hidden h-80 md:h-96 shadow-xl">
              <img 
                src="/images/shutterstock_40377937.jpg" 
                alt="Driving in rainy weather" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <p className="text-white p-6 text-lg font-medium">
                  Adjust your driving for weather conditions
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-7">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {tips.map((tip, index) => (
                <div 
                  key={index}
                  className="p-5 sm:p-6 rounded-lg border-l-4 hover:shadow-md transition-all touch-friendly-stack"
                  style={{ 
                    backgroundColor: 'var(--card-bg)', 
                    borderLeftColor: 'var(--accent-primary)',
                    boxShadow: '0 2px 8px var(--shadow)',
                    transition: `all var(--transition-speed)` 
                  }}
                >
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{tip.title}</h3>
                  <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>{tip.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 italic text-center sm:text-left" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Remember: The best claim is the one you never have to make. Drive safely!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyTips; 