// src/utils/tracking.js

/**
 * Fire a Google Ads conversion event.
 * Conversion ID: AW-18439695400
 * Conversion Label: o4sJCMSbo5sdEKjY3dhE
 */
export function trackLeadConversion() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: 'AW-18439695400/o4sJCMSbo5sdEKjY3dhE',
    });
  } else {
    console.warn('[tracking] gtag not available — conversion not sent');
  }
}
