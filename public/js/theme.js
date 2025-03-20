(function() {
  // Configuration
  var storageKey = 'preferredTheme';
  var themes = ['light', 'dark', 'premium'];
  
  function setTheme(theme) {
    // Set the theme on the document element
    document.documentElement.setAttribute('data-theme', theme);
    // Store the preference in localStorage
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      // Handle localStorage errors
      console.warn('Unable to save theme preference:', e);
    }
  }
  
  // Theme selection logic
  function selectTheme() {
    // Check localStorage first
    var savedTheme;
    try {
      savedTheme = localStorage.getItem(storageKey);
    } catch (e) {
      // Handle localStorage errors
      console.warn('Unable to access theme preference:', e);
    }
    
    if (savedTheme && themes.includes(savedTheme)) {
      return savedTheme;
    } 
    
    // Check for system dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Check for reduced motion preference for accessibility
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Store this preference for our animations
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    }
    
    // Default to light
    return 'light';
  }
  
  // Check for mobile devices to adjust UI accordingly
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    document.documentElement.setAttribute('data-mobile', 'true');
  }
  
  // Set the theme immediately to prevent flash
  setTheme(selectTheme());
  
  // Listen for system preference changes
  if (window.matchMedia) {
    // Listen for dark mode preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Only change theme if the user hasn't explicitly set a preference
      if (!localStorage.getItem(storageKey)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
    
    // Listen for reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
      document.documentElement.setAttribute('data-reduced-motion', e.matches ? 'true' : 'false');
    });
  }
})(); 