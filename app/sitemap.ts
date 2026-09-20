import type { MetadataRoute } from 'next';
import { calculatorsData } from '@/data/calculators';
import { guidesData } from '@/data/guides';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.metricores.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/calculators',
    '/guides',
    '/about',
    '/faq',
    '/privacy',
    '/terms',
  ].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : path === '/calculators' || path === '/guides' ? 0.8 : 0.6,
  }));

  const calculatorRoutes = Object.values(calculatorsData).map((calculator) => ({
    url: new URL(`/calculators/${calculator.slug}`, siteUrl).toString(),
    lastModified: new Date(calculator.lastReviewed ?? calculator.lastUpdated ?? Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const guideRoutes = guidesData.map((guide) => ({
    url: new URL(`/guides/${guide.slug}`, siteUrl).toString(),
    lastModified: new Date(guide.publishedDate ?? Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...calculatorRoutes, ...guideRoutes];
}
