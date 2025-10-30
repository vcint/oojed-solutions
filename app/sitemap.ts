import type { MetadataRoute } from 'next';
import site from '@/data/site.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://oojed.com';

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
    { url: `${base}/services`, lastModified: new Date() },
  ];

  const productUrls: MetadataRoute.Sitemap = (Array.isArray((site as any).categories) ? (site as any).categories : [])
    .map((c: any) => {
      const slug = String(c?.slug || c?.name || '').trim().toLowerCase().replace(/\s+/g, '-');
      return { url: `${base}/products/${encodeURIComponent(slug)}`, lastModified: new Date() };
    });

  const serviceUrls: MetadataRoute.Sitemap = (Array.isArray((site as any).services) ? (site as any).services : [])
    .map((s: any) => ({ url: `${base}/services/${encodeURIComponent(String(s?.slug || '').trim())}`, lastModified: new Date() }));

  const cityUrls: MetadataRoute.Sitemap = (Array.isArray((site as any).cities) ? (site as any).cities : [])
    .map((c: string) => {
      const slug = String(c).trim().toLowerCase().replace(/\s+/g, '-');
      return { url: `${base}/locations/${encodeURIComponent(slug)}`, lastModified: new Date() };
    });

  const categories: any[] = Array.isArray((site as any).categories) ? (site as any).categories : [];
  const cityCategoryUrls: MetadataRoute.Sitemap = (Array.isArray((site as any).cities) ? (site as any).cities : [])
    .flatMap((c: string) => {
      const cslug = String(c).trim().toLowerCase().replace(/\s+/g, '-');
      return categories.map((k: any) => {
        const kslug = String(k?.slug || k?.name || '').trim().toLowerCase().replace(/\s+/g, '-');
        return { url: `${base}/locations/${encodeURIComponent(cslug)}/${encodeURIComponent(kslug)}`, lastModified: new Date() };
      });
    });

  return [...staticUrls, ...productUrls, ...serviceUrls, ...cityUrls, ...cityCategoryUrls];
}
