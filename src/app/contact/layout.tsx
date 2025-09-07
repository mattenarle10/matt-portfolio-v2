import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Matt Enarle — email, socials, or book time.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact',
    description: 'Email, socials, or book time via Cal.com.',
    url: 'https://mattenarle.vercel.app/contact',
    images: [
      { url: 'https://mattenarle.vercel.app/twitter-img.png', alt: 'Matt Enarle' },
    ],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
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
            { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://mattenarle.vercel.app/contact' },
          ],
        }),
      }}
    />
  </>;
}
