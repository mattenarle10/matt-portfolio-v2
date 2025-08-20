import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Contact | Matt Enarle',
  description: 'Get in touch — email, socials, or book time via Cal.com.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
