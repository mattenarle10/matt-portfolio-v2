import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Contact | Matt Enarle',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
