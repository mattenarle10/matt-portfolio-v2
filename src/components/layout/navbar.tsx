'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/context/ThemeContext';
import { SunIcon, MoonIcon } from '@/styles/icons';
import MobileNav from './mobile-nav';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Return mobile nav on smaller screens
  if (isMobile) {
    return <MobileNav />;
  }
  
  // Desktop navigation
  return (
    <nav className="w-full z-50 bg-transparent transition-colors duration-300 pt-3 pb-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 w-full">
          {/* Logo - different image based on theme */}
          <div className="flex items-center flex-none">
            <Link href="/" className="flex items-center h-8" aria-label="Home">
              {theme === 'dark' ? (
                <Image src="/2.png" alt="Matt Enarle Logo" height={32} width={96} style={{height:32, width:'auto'}} priority />
              ) : (
                <Image src="/1.png" alt="Matt Enarle Logo" height={32} width={96} style={{height:32, width:'auto'}} priority />
              )}
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
                    className="px-3 py-1.5 text-black dark:text-white hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 font-light inline-block"
                  >
                    {label}
                  </Link>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute h-[1px] bg-blue-500 dark:bg-blue-400 left-0 right-0 bottom-0"
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
                <SunIcon className="h-5 w-5 text-gray-300" />
              ) : (
                <MoonIcon className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;