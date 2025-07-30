'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/styles/theme';
import { MenuIcon, CloseIcon, SunIcon, MoonIcon } from '@/styles/icons';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Changed from max-w-7xl to max-w-3xl for more centralized layout */}
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Matt Enarle
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Contact
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Added container for consistent width */}
            <div className="py-2 space-y-1">
              <Link 
                href="/" 
                className="block py-2 text-base font-medium text-center text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block py-2 text-base font-medium text-center text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block py-2 text-base font-medium text-center text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;