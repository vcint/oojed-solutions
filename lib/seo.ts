import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

const pageSeoFilePath = path.join(process.cwd(), 'page-seo-settings.json');
const globalSeoFilePath = path.join(process.cwd(), 'seo-settings.json');

interface PageSeoData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

interface GlobalSeoData {
  defaultTitle?: string;
  defaultDescription?: string;
  defaultImage?: string;
  siteName?: string;
  twitterHandle?: string;
  [key: string]: any;
}

function readPageSeoSettings(): Record<string, PageSeoData> {
  try {
    if (fs.existsSync(pageSeoFilePath)) {
      const data = fs.readFileSync(pageSeoFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading page SEO settings:', error);
  }
  return {};
}

function readGlobalSeoSettings(): GlobalSeoData {
  try {
    if (fs.existsSync(globalSeoFilePath)) {
      const data = fs.readFileSync(globalSeoFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading global SEO settings:', error);
  }
  return {};
}

/**
 * Get SEO data for a specific page route
 * @param route - The page route (e.g., '/', '/about', '/contact')
 * @returns PageSeoData or null if not found
 */
export function getPageSeoData(route: string): PageSeoData | null {
  const settings = readPageSeoSettings();
  return settings[route] || null;
}

/**
 * Generate Next.js Metadata object for a page
 * @param route - The page route
 * @param fallbackTitle - Fallback title if no SEO data exists
 * @param fallbackDescription - Fallback description if no SEO data exists
 * @returns Metadata object for Next.js
 */
export function generatePageMetadata(
  route: string,
  fallbackTitle?: string,
  fallbackDescription?: string
): Metadata {
  const pageSeo = getPageSeoData(route);
  const globalSeo = readGlobalSeoSettings();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oojed.com';
  const canonicalUrl = pageSeo?.canonical || `${siteUrl}${route}`;

  // Build title
  const title = pageSeo?.title ||
    (fallbackTitle ? `${fallbackTitle} | ${globalSeo.siteName || 'OOJED'}` : globalSeo.siteName || 'OOJED');

  // Build description
  const description = pageSeo?.description || fallbackDescription || globalSeo.defaultDescription || '';

  // Build keywords
  const keywords = pageSeo?.keywords || '';

  // Open Graph data
  const ogTitle = pageSeo?.ogTitle || title;
  const ogDescription = pageSeo?.ogDescription || description;
  const ogImage = pageSeo?.ogImage || globalSeo.defaultImage || `${siteUrl}/og-image.jpg`;

  // Twitter data
  const twitterTitle = pageSeo?.twitterTitle || ogTitle;
  const twitterDescription = pageSeo?.twitterDescription || ogDescription;
  const twitterImage = pageSeo?.twitterImage || ogImage;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !pageSeo?.noindex,
      follow: !pageSeo?.nofollow,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: globalSeo.siteName || 'OOJED',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage],
      creator: globalSeo.twitterHandle ? `@${globalSeo.twitterHandle}` : undefined,
    },
  };

  return metadata;
}

/**
 * Get all page SEO settings (admin use only)
 */
export function getAllPageSeoSettings(): Record<string, PageSeoData> {
  return readPageSeoSettings();
}