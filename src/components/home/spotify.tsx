'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Spotify } from 'react-spotify-embed';
import { useSpotify } from '@/app/api/spotify/useSpotify';
import FadeIn from '../utils/FadeIn';
import { theme } from '../utils/theme';



const SpotifyRecentlyPlayed = () => {
  const { recentTracks, topTracks, isLoading, error } = useSpotify();
  const [activeList, setActiveList] = useState<'recent' | 'top'>('recent');
  const [displayTrack, setDisplayTrack] = useState<any>(null);
  const [tracksList, setTracksList] = useState<any[]>([]);
  const tracksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeList === 'top' && topTracks && topTracks.length > 0) {
      setDisplayTrack(topTracks[0]);
      setTracksList(topTracks.slice(1, 5)); // Show 4 additional tracks
    } else if (recentTracks && recentTracks.length > 0) {
      setDisplayTrack(recentTracks[0]);
      setTracksList(recentTracks.slice(1, 5)); // Show 4 additional tracks
    }
  }, [activeList, recentTracks, topTracks]);

  const handleTabClick = (tab: 'recent' | 'top') => {
    if (activeList !== tab) {
      setActiveList(tab);
    }
    // Simple scroll if needed on mobile
    if (window.innerWidth < 768 && tracksRef.current) {
      tracksRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  return (
    <section className="mt-12">
      {/* Improved header with better tab spacing */}
      <div className="mb-4 flex flex-col">
        <div className="flex justify-between items-center pb-1">
          <h2 className="text-base font-normal">
            {activeList === 'top' ? 'Top Tracks' : 'Recently Played'}
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabClick('recent')}
              className="text-xs py-0.5 px-1 transition-all relative"
            >
              <span className={activeList === 'recent' ? '' : 'text-gray-400'}>Recent</span>
              {activeList === 'recent' && (
                <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => handleTabClick('top')}
              className="text-xs py-0.5 px-1 transition-all relative ml-2"
            >
              <span className={activeList === 'top' ? '' : 'text-gray-400'}>Top</span>
              {activeList === 'top' && (
                <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading State - Minimal */}
      {isLoading && (
        <div className="flex justify-start py-2">
          <div className="animate-pulse flex space-x-3 w-full">
            <div className="rounded bg-gray-100 h-12 w-12"></div>
            <div className="flex-1 space-y-1.5 py-1">
              <div className="h-1.5 bg-gray-100 rounded w-3/4"></div>
              <div className="h-1.5 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      
      {/* Main Content */}
      {!isLoading && !error && (
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Featured Track Card - Left Side */}
          {displayTrack && (
            <div className="w-full md:w-2/5 mb-4 md:mb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayTrack.externalUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col h-full">
                    <Spotify 
                      link={displayTrack.externalUrl}
                      width="100%"
                      height="352"
                      className="w-full rounded-md overflow-hidden mb-1"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Track List - Right Side */}
          <div ref={tracksRef} className="w-full md:w-3/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeList}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                <div className="grid grid-cols-1 gap-3 pt-1">
                  {tracksList.map((track, index) => (
                    <FadeIn key={`${track.id}-${index}`} delay={0.03 * index}>
                      <Spotify 
                        link={track.externalUrl}
                        width="100%"
                        height="80"
                        className="w-full rounded-md overflow-hidden"
                      />
                    </FadeIn>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* Empty State - Minimal */}
      {!isLoading && !displayTrack && !error && (
        <div className="text-left py-6">
          <p className="text-gray-400 text-xs font-light">No tracks found</p>
        </div>
      )}

    </section>
  );
};

export default SpotifyRecentlyPlayed;