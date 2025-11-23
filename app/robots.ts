import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://oojed.com';
  return {
    rules: [
      {
        userAgent: ['*', 'GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'OAI-SearchBot', 'anthropic-ai', 'Claude-Web'],
        allow: '/',
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

