'use client';

import { useState, useEffect, useRef } from 'react';
import { useSpotifyAuth } from './useSpotifyAuth';

// Define types for Spotify API responses
type SpotifyArtist = {
  name: string;
  id: string;
};

type SpotifyImage = {
  url: string;
  height: number;
  width: number;
};

type SpotifyAlbum = {
  id: string;
  name: string;
  images: SpotifyImage[];
};

type SpotifyApiTrack = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
};

type SpotifyRecentlyPlayedItem = {
  track: SpotifyApiTrack;
  played_at: string;
};

type SpotifyRecentlyPlayedResponse = {
  items: SpotifyRecentlyPlayedItem[];
};

type SpotifyTopTracksResponse = {
  items: SpotifyApiTrack[];
};

// Type for our component to use
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  albumArt: string;
  playedAt: string;
  previewUrl: string | null;
  externalUrl: string;
}

// Cache keys for localStorage
const CACHE_KEY_RECENT = 'spotify_recent_tracks';
const CACHE_KEY_TOP = 'spotify_top_tracks';
const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes

export function useSpotify() {
  // Use refs to prevent unnecessary rerenders during initial load
  const initialLoadRef = useRef<boolean>(true);
  
  // Initialize state from cache if available
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const cached = localStorage.getItem(CACHE_KEY_RECENT);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }
    } catch (e) {
      console.error('Error reading from cache:', e);
    }
    return [];
  });
  
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const cached = localStorage.getItem(CACHE_KEY_TOP);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }
    } catch (e) {
      console.error('Error reading from cache:', e);
    }
    return [];
  });
  
  // Loading state depends on whether we have cached data
  const [isLoading, setIsLoading] = useState(!recentTracks.length && !topTracks.length);
  const [error, setError] = useState<string | null>(null);
  const { token, isLoading: tokenLoading, error: tokenError } = useSpotifyAuth();
  
  // Track whether the component is mounted
  const isMounted = useRef(true);
  
  // Refs to track ongoing fetches to prevent duplicate requests
  const fetchingRecentRef = useRef(false);
  const fetchingTopRef = useRef(false);

  // Get currently playing track - only fetch once during initial mount to reduce API load
  useEffect(() => {
    if (!token || tokenLoading || !initialLoadRef.current) return;

    const fetchCurrentTrack = async () => {
      try {
        // Don't set global loading state - only for initial load
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          // Use cache to reduce network requests
          cache: 'force-cache'
        });

        if (response.status === 204) {
          if (isMounted.current) setCurrentTrack(null);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch currently playing track');
        }

        const data = await response.json();
        const track = data.item;
        
        if (track && isMounted.current) {
          setCurrentTrack({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist: { name: string }) => artist.name),
            albumName: track.album.name,
            albumArt: track.album.images[0]?.url || '',
            playedAt: new Date().toISOString(),
            previewUrl: track.preview_url,
            externalUrl: track.external_urls.spotify,
          });
        }
      } catch (err) {
        console.error('Error fetching current track:', err);
        if (isMounted.current) {
          setError('Could not load currently playing track');
          setCurrentTrack(null);
        }
      }
    };

    fetchCurrentTrack();
    
    // Mark initial load complete so we don't keep fetching
    initialLoadRef.current = false;
  }, [token, tokenLoading]);

  // Get recently played tracks
  useEffect(() => {
    // Skip if no token or already fetching
    if (!token || tokenLoading || fetchingRecentRef.current) return;
    
    // Mark as fetching to prevent duplicate requests
    fetchingRecentRef.current = true;

    const fetchRecentTracks = async () => {
      try {        
        // Don't set loading state if we already have cached data
        if (!recentTracks.length) {
          setIsLoading(true);
        }
        setError(null);
        
        const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          // Use cache control to reduce network traffic
          cache: 'force-cache'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recently played tracks');
        }

        const data = await response.json();
        
        if (data && data.items && isMounted.current) {
          const tracks = data.items.map((item: SpotifyRecentlyPlayedItem) => ({
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists.map((artist) => artist.name),
            albumName: item.track.album.name,
            albumArt: item.track.album.images[0]?.url || '',
            playedAt: item.played_at,
            previewUrl: item.track.preview_url,
            externalUrl: item.track.external_urls.spotify,
          }));
          
          // Only update state if component is still mounted
          if (isMounted.current) {
            setRecentTracks(tracks);
            
            // Cache the results
            try {
              localStorage.setItem(CACHE_KEY_RECENT, JSON.stringify({
                data: tracks,
                timestamp: Date.now()
              }));
            } catch (e) {
              console.error('Error caching recent tracks:', e);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching recent tracks:', err);
        if (isMounted.current) {
          setError('Could not load recently played tracks');
        }
      } finally {
        // Only update loading state if mounted
        if (isMounted.current) {
          setIsLoading(false);
        }
        // Allow fetching again
        fetchingRecentRef.current = false;
      }
    };

    fetchRecentTracks();
  }, [token, tokenLoading, recentTracks.length]);

  // Get top tracks using our API endpoint
  useEffect(() => {
    // Skip if already fetching
    if (fetchingTopRef.current) return;
    
    // Mark as fetching to prevent duplicate requests
    fetchingTopRef.current = true;
    
    const fetchTopTracks = async () => {
      try {
        // Don't set loading if we already have cached data
        if (!topTracks.length) {
          setIsLoading(true);
        }
        
        // Use our API endpoint instead of calling Spotify directly
        // Use stale-while-revalidate caching strategy
        const response = await fetch('/api/spotify/top-tracks', {
          cache: 'force-cache',
          next: { revalidate: 3600 } // Revalidate once per hour
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch top tracks: ${response.status}`);
        }
        
        const tracks = await response.json();
        if (!Array.isArray(tracks)) {
          console.error('Top tracks response is not an array:', tracks);
          return;
        }
        
        // Only update state if component is still mounted
        if (isMounted.current) {
          setTopTracks(tracks);
          
          // Cache the results
          try {
            localStorage.setItem(CACHE_KEY_TOP, JSON.stringify({
              data: tracks,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.error('Error caching top tracks:', e);
          }
        }
      } catch (err) {
        console.error('Error fetching top tracks:', err);
      } finally {
        // Only update loading state if mounted
        if (isMounted.current) {
          setIsLoading(false);
        }
        // Allow fetching again
        fetchingTopRef.current = false;
      }
    };

    fetchTopTracks();
  }, [topTracks.length]);

  // Cleanup effect - prevent memory leaks and state updates after unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    currentTrack,
    recentTracks,
    topTracks,
    isLoading: isLoading || tokenLoading,
    error: error || tokenError
  };
} 