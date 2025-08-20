import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Projects | Matt Enarle',
  description: 'Selected software projects with brief summaries, tech, and links.',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
