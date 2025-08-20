import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Projects | Matt Enarle',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
