// FacebookPixel.jsx
import { useEffect } from 'react';

const FacebookPixel = () => {
  useEffect(() => {
    const initFacebookPixel = () => {
      const preferences = localStorage.getItem('cookiePreferences');
      if (preferences) {
        const { marketing } = JSON.parse(preferences);
        if (marketing && !window.fbq) {
          // Load Facebook Pixel
          !function(f,b,e,v,n,t,s) {
            if(f.fbq)return;
            n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
          
          fbq('init', 'YOUR-PIXEL-ID');
          fbq('track', 'PageView');
        }
      }
    };

    initFacebookPixel();
    window.addEventListener('cookiesAccepted', initFacebookPixel);
    
    return () => {
      window.removeEventListener('cookiesAccepted', initFacebookPixel);
    };
  }, []);

  return null;
};

export default FacebookPixel;