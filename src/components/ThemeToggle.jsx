import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Get theme from localStorage or data-theme attribute on page load
    const currentTheme = 
      localStorage.getItem('preferredTheme') || 
      document.documentElement.getAttribute('data-theme') || 
      'light';
    
    setTheme(currentTheme);
    
    // Add event listener for theme changes
    const handleThemeChange = () => {
      const newTheme = document.documentElement.getAttribute('data-theme');
      setTheme(newTheme);
    };
    
    window.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);
  
  const changeTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('preferredTheme', newTheme);
    setTheme(newTheme);
    
    // Dispatch custom event to notify other components of theme change
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  };
  
  return (
    <div className="theme-toggle flex items-center">
      {/* Light Theme Button */}
      <button
        onClick={() => changeTheme('light')}
        className={`flex items-center justify-center p-2 text-sm rounded-l-lg border md:px-4 ${
          theme === 'light'
            ? 'bg-blue-500 text-white border-blue-600'
            : 'bg-transparent border-gray-300 dark:border-gray-600'
        }`}
        aria-label="Light theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
        </svg>
        <span className="hidden md:inline">Light</span>
      </button>
      
      {/* Dark Theme Button */}
      <button
        onClick={() => changeTheme('dark')}
        className={`flex items-center justify-center p-2 text-sm border-t border-b md:px-4 ${
          theme === 'dark'
            ? 'bg-blue-500 text-white border-blue-600'
            : 'bg-transparent border-gray-300 dark:border-gray-600'
        }`}
        aria-label="Dark theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
          <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
        </svg>
        <span className="hidden md:inline">Dark</span>
      </button>
      
      {/* Premium Theme Button */}
      <button
        onClick={() => changeTheme('premium')}
        className={`flex items-center justify-center p-2 text-sm rounded-r-lg border md:px-4 ${
          theme === 'premium'
            ? 'bg-blue-500 text-white border-blue-600'
            : 'bg-transparent border-gray-300 dark:border-gray-600'
        }`}
        aria-label="Premium theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
        </svg>
        <span className="hidden md:inline">Premium</span>
      </button>
    </div>
  );
};

export default ThemeToggle; 