import Link from 'next/link';
import type { ReactNode } from 'react';

type SocialItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const InstagramIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.5 8h4V24h-4V8zm7.5 0h3.839v2.177h.056c.535-1.015 1.84-2.088 3.787-2.088 4.05 0 4.801 2.664 4.801 6.131V24h-4v-7.467c0-1.781-.032-4.073-2.487-4.073-2.49 0-2.871 1.943-2.871 3.95V24h-4V8z" />
  </svg>
);

const GithubIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const MailIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16v16H4z"></path>
    <path d="m22 6-8.97 5.73a2 2 0 0 1-2.06 0L2 6"></path>
  </svg>
);

const socials: SocialItem[] = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/mattenarle',
    icon: InstagramIcon
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/matthew-enarle',
    icon: LinkedinIcon
  },
  {
    label: 'GitHub',
    href: 'https://github.com/mattenarle10',
    icon: GithubIcon
  },
  {
    label: 'Email',
    href: 'mailto:matthew.enarle@outlook.com',
    icon: MailIcon
  }
];

export default function Socials() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <p className="text-xs font-light mb-6">connect with me here!</p>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {socials.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-sm border border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-200 dark:hover:border-gray-800 px-4 py-3"
            aria-label={item.label}
            title={item.label}
          >
            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
              {item.icon}
            </span>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}


