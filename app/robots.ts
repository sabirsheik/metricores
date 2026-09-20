import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile', '/auth', '/forgot-password', '/reset-password', '/verify-email', '/workspace'],
    },
    sitemap: 'https://www.metricores.com/sitemap.xml',
  };
}
