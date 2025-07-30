'use client';

import Link from 'next/link';
import { GithubIcon, LinkedInIcon } from '@/styles/icons';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          {/* Social Links */}
          <div className="flex space-x-6 mb-4">
            <Link 
              href="https://github.com/mattenarle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-6 h-6" />
            </Link>
            <Link 
              href="https://linkedin.com/in/mattenarle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="w-6 h-6" />
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Matt Enarle. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;