import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected projects by Matt Enarle — summaries, tech, and links.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects',
    description: 'Selected projects by Matt Enarle — summaries, tech, and links.',
    url: 'https://mattenarle.vercel.app/projects',
    images: [
      { url: 'https://mattenarle.vercel.app/twitter-img.png', alt: 'Matt Enarle projects' },
    ],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>
    {children}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mattenarle.vercel.app/' },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://mattenarle.vercel.app/projects' },
          ],
        }),
      }}
    />
  </>;
}
