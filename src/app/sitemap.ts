import type { MetadataRoute } from 'next';

const base = (() => {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    return env ? new URL(env).origin : 'https://mattenarle.com';
  } catch {
    return 'https://mattenarle.com';
  }
})();

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { 
      url: `${base}/`, 
      lastModified, 
      changeFrequency: 'weekly' as const,
      priority: 1.0 
    },
    { 
      url: `${base}/about`, 
      lastModified, 
      changeFrequency: 'monthly' as const,
      priority: 0.8 
    },
    { 
      url: `${base}/projects`, 
      lastModified, 
      changeFrequency: 'weekly' as const,
      priority: 0.9 
    },
    { 
      url: `${base}/contact`, 
      lastModified, 
      changeFrequency: 'monthly' as const,
      priority: 0.7 
    },
  ];
}
