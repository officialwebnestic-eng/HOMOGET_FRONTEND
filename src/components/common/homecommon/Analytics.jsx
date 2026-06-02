// Example: Analytics Component
import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';

const Analytics = () => {
  useEffect(() => {
    // Function to initialize analytics only if accepted
    const initAnalytics = () => {
      const preferences = localStorage.getItem('cookiePreferences');
      if (preferences) {
        const { analytics } = JSON.parse(preferences);
        if (analytics) {
          // Initialize Google Analytics or other analytics
          ReactGA.initialize('YOUR-GA-ID');
          console.log('Analytics initialized');
        }
      }
    };

    // Check on mount
    initAnalytics();

    // Listen for cookie acceptance event
    window.addEventListener('cookiesAccepted', initAnalytics);
    
    return () => {
      window.removeEventListener('cookiesAccepted', initAnalytics);
    };
  }, []);

  return null;
};

export default Analytics;