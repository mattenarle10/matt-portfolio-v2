import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'things I\'ve built — cloud infrastructure, web apps, and software engineering projects by Matt Enarle. AWS, React, Next.js, Python, and more.',
  alternates: { canonical: 'https://mattenarle.com/projects' },
  openGraph: {
    title: 'Projects | Matt Enarle',
    description: 'things I\'ve built — cloud infrastructure, web apps, and software engineering projects by Matt Enarle.',
    url: 'https://mattenarle.com/projects',
    images: [
      { url: 'https://mattenarle.com/twitter-img.png', alt: 'Matt Enarle projects' },
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
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mattenarle.com/' },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://mattenarle.com/projects' },
          ],
        }),
      }}
    />
  </>;
}
