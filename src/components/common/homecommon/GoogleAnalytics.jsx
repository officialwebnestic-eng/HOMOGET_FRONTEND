// components/GoogleAnalytics.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const initAnalytics = () => {
      const preferences = localStorage.getItem('cookiePreferences');
      if (preferences) {
        const { analytics } = JSON.parse(preferences);
        if (analytics && !window.gtag) {
          // Load Google Analytics
          const script = document.createElement('script');
          script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
          script.async = true;
          document.head.appendChild(script);
          
          window.dataLayer = window.dataLayer || [];
          window.gtag = function() { window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          window.gtag('config', 'G-XXXXXXXXXX');
        }
      }
    };

    initAnalytics();
    window.addEventListener('cookiesAccepted', initAnalytics);
    
    return () => {
      window.removeEventListener('cookiesAccepted', initAnalytics);
    };
  }, []);

  useEffect(() => {
    const preferences = localStorage.getItem('cookiePreferences');
    if (preferences) {
      const { analytics } = JSON.parse(preferences);
      if (analytics && window.gtag) {
        window.gtag('config', 'G-XXXXXXXXXX', {
          page_path: location.pathname + location.search,
        });
      }
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;