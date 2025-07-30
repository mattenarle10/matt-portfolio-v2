'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to check if the current viewport matches a media query
 * @param query The media query string to check
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with a default value to prevent hydration mismatch
  // Start with `false` to avoid layout shifts on mobile
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Set initial value once mounted on client
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    // Update the state when the media query changes
    const listener = () => setMatches(media.matches);
    
    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } 
    // Legacy support
    else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);
  
  return matches;
}
