import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'HOMOGET';
const SITE_URL = 'https://www.homoget.ae/';

function SEO({ 
  title, 
  keywords, 
  description, 
  url,
  ogTitle,
  ogDescription 
}) {
  // Use passed props or fallback to global defaults
  const fullTitle = title 
    ? `${title} | ${SITE_NAME}` 
    : `Luxury Property for Sale in Dubai | Villas, Apartments & Investments - ${SITE_NAME}`;

  const safeDescription = description?.slice(0, 160) || 
    'Explore exclusive luxury properties in Dubai. From Palm Jumeirah villas to Downtown apartments, find your ideal home or investment with HOMOGET.';

  const keywordsString = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords || 'Dubai real estate, luxury property Dubai, buy property in Dubai, Dubai apartments for sale, Dubai villas, property investment Dubai';

  const cleanUrl = typeof window !== 'undefined' 
    ? window.location.origin + window.location.pathname 
    : SITE_URL;

  const ogUrl = url 
    ? `${SITE_URL.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}` 
    : cleanUrl;

  return (
    <Helmet prioritizeSeoTags>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="keywords" content={keywordsString} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large" />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || safeDescription} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  keywords: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  description: PropTypes.string,
  url: PropTypes.string,
  ogTitle: PropTypes.string,
  ogDescription: PropTypes.string,
};

export default memo(SEO);