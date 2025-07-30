'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/styles/theme';
import { SunIcon, MoonIcon } from '@/styles/icons';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-white dark:bg-[#0a0a0a] shadow-sm transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 w-full">
          {/* Logo */}
          <div className="flex items-center flex-none">
            <Link href="/" className="flex items-center h-8" aria-label="Home">
              <Image src="/2.png" alt="Matt Enarle Logo" height={32} width={96} style={{height:32, width:'auto'}} priority />
            </Link>
          </div>

          {/* Centered Nav Links with animated underline */}
          <div className="flex-1 flex justify-center items-center space-x-8">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <div key={href} className="relative">
                  <Link
                    href={href}
                    className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 font-light inline-block"
                  >
                    {label}
                  </Link>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute h-0.5 bg-blue-500 dark:bg-blue-400 left-0 right-0 bottom-0"
                      transition={{ 
                        type: 'spring', 
                        stiffness: 380, 
                        damping: 30
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center flex-none">
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
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;