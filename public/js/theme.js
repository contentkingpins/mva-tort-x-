(function() {
  // Set premium theme immediately to prevent flash
  document.documentElement.setAttribute('data-theme', 'premium');
  
  // Store premium theme in localStorage
  try {
    localStorage.setItem('preferredTheme', 'premium');
  } catch (e) {
    // Handle localStorage errors
    console.warn('Unable to save theme preference:', e);
  }
  
  // Check for reduced motion preference for accessibility
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Store this preference for our animations
    document.documentElement.setAttribute('data-reduced-motion', 'true');
  }
  
  // Check for mobile devices to adjust UI accordingly
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    document.documentElement.setAttribute('data-mobile', 'true');
  }
  
  // Listen for reduced motion preference changes for accessibility
  if (window.matchMedia) {
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
      document.documentElement.setAttribute('data-reduced-motion', e.matches ? 'true' : 'false');
    });
  }
})(); 