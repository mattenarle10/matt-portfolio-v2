'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  image?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

// Local Storage key for preserving carousel state
const CAROUSEL_STATE_KEY = 'about_carousel_state';

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 5000,
  className = '',
}) => {
  // Get saved index from localStorage or default to 0
  const getSavedIndex = (): number => {
    if (typeof window === 'undefined') return 0;
    
    try {
      const saved = localStorage.getItem(CAROUSEL_STATE_KEY);
      if (saved) {
        const { index, timestamp } = JSON.parse(saved);
        // Only use saved state if it's less than 30 minutes old
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          return index;
        }
      }
    } catch (e) {
      console.error('Error reading carousel state', e);
    }
    return 0;
  };
  
  const [currentIndex, setCurrentIndex] = useState(getSavedIndex);
  const [direction, setDirection] = useState(0); // -1: left, 1: right, 0: initial
  const isLargeScreen = useMediaQuery('(min-width: 768px)');
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Save carousel state to localStorage
  const saveCarouselState = (index: number) => {
    try {
      localStorage.setItem(
        CAROUSEL_STATE_KEY,
        JSON.stringify({
          index,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.error('Error saving carousel state', e);
    }
  };

  // Handle navigation
  const navigate = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    
    // Determine direction for animation
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
    saveCarouselState(newIndex);
  };

  const goNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    navigate(nextIndex);
  };

  const goPrev = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    navigate(prevIndex);
  };

  // Set up autoplay
  useEffect(() => {
    if (autoPlay && items.length > 1) {
      autoPlayRef.current = setInterval(goNext, interval);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, interval, items.length, currentIndex]);

  // Touch handlers for swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Minimum swipe distance threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  // Calculate visible indicators based on screen size
  const getVisibleIndicators = () => {
    if (items.length <= 5) return items.map((_, i) => i);
    
    // On larger screens, show more indicators
    const totalVisible = isLargeScreen ? 7 : 5;
    const halfVisible = Math.floor(totalVisible / 2);
    
    if (currentIndex < halfVisible) {
      // Near the start
      return Array.from({ length: totalVisible }, (_, i) => i);
    } else if (currentIndex > items.length - 1 - halfVisible) {
      // Near the end
      return Array.from({ length: totalVisible }, (_, i) => items.length - totalVisible + i);
    } else {
      // In the middle
      return Array.from({ length: totalVisible }, (_, i) => currentIndex - halfVisible + i);
    }
  };

  const visibleIndicators = getVisibleIndicators();

  return (
    <div 
      className={`w-full relative ${className}`}
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main carousel area */}
      <div className="overflow-hidden rounded-md relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <div className="w-full rounded-md bg-white dark:bg-gray-800 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              {/* Image if provided */}
              {items[currentIndex].image && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={items[currentIndex].image} 
                    alt={items[currentIndex].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Content area */}
              <div className="p-5">
                <h3 className="text-lg font-light mb-1">{items[currentIndex].title}</h3>
                {items[currentIndex].subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {items[currentIndex].subtitle}
                  </p>
                )}
                <div className="text-sm">{items[currentIndex].content}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 w-full px-2 z-10">
        <button 
          onClick={goPrev}
          className="bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Previous"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={goNext}
          className="bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Next"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-1">
        {visibleIndicators.map(i => (
          <button
            key={`indicator-${i}`}
            onClick={() => navigate(i)}
            className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 dark:bg-gray-600'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;