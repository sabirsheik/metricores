import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.metricores.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile', '/auth', '/forgot-password', '/reset-password', '/verify-email', '/workspace'],
    },
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
