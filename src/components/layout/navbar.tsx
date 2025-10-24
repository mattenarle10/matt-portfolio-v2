'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/context/ThemeContext';
import ThemeToggle from '@/components/utils/ThemeToggle';
import MobileNav from './mobile-nav';

const Navbar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ];
  
  return (
    <>
      {/* Mobile Navigation - Hidden on desktop */}
      <div className="md:hidden">
        <MobileNav />
      </div>
      
      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden md:block w-full z-50 bg-transparent transition-colors duration-300 pt-3 pb-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 w-full">
            {/* Logo - different image based on theme */}
            <div className="flex items-center flex-none">
              <Link href="/" className="flex items-center h-8 w-24" aria-label="Home">
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
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;