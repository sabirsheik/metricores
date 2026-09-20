import type { Metadata } from 'next';

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.metricores.com'
);

export function buildMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  noindex = false,
  openGraphTitle,
  openGraphDescription,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
  openGraphTitle?: string;
  openGraphDescription?: string;
}): Metadata {
  const canonical = new URL(path, siteUrl).toString();

  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: {
      canonical,
    },
    keywords,
    robots: noindex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
    openGraph: {
      title: openGraphTitle || title,
      description: openGraphDescription || description,
      url: canonical,
      siteName: 'Metricores',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraphTitle || title,
      description: openGraphDescription || description,
    },
  };
}
