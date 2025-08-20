import type { MetadataRoute } from 'next';

const base = (() => {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    return env ? new URL(env).origin : 'https://mattenarle.vercel.app';
  } catch {
    return 'https://mattenarle.vercel.app';
  }
})();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
