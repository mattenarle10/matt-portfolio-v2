import type { MetadataRoute } from 'next';

const base = (() => {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    return env ? new URL(env).origin : 'https://mattenarle.vercel.app';
  } catch {
    return 'https://mattenarle.vercel.app';
  }
})();

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified },
    { url: `${base}/about`, lastModified },
    { url: `${base}/projects`, lastModified },
    { url: `${base}/contact`, lastModified },
  ];
}
