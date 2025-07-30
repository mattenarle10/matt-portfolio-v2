'use client';

import { useState, useEffect } from 'react';
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
interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  albumArt: string;
  playedAt: string;
  previewUrl: string | null;
  externalUrl: string;
}

export function useSpotify() {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isLoading: tokenLoading, error: tokenError } = useSpotifyAuth();

  // Get currently playing track
  useEffect(() => {
    if (!token || tokenLoading) return;

    const fetchCurrentTrack = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 204) {
          setCurrentTrack(null);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch currently playing track');
        }

        const data = await response.json();
        const track = data.item;
        
        if (track) {
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
        setError('Could not load currently playing track');
        setCurrentTrack(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentTrack();
  }, [token, tokenLoading]);

  // Get recently played tracks
  useEffect(() => {
    if (!token || tokenLoading) return;

    const fetchRecentTracks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recently played tracks');
        }

        const data = await response.json();
        console.log('Recently played data:', data);
        
        if (data && data.items) {
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
          setRecentTracks(tracks);
        }
      } catch (err) {
        console.error('Error fetching recent tracks:', err);
        setError('Could not load recently played tracks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTracks();
  }, [token, tokenLoading]);

  // Get top tracks
  useEffect(() => {
    if (!token || tokenLoading) return;

    const fetchTopTracks = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch top tracks');
        }
        
        const data = await response.json() as SpotifyTopTracksResponse;
        
        if (data && data.items) {
          const tracks = data.items.map((item) => ({
            id: item.id,
            name: item.name,
            artists: item.artists.map((artist) => artist.name),
            albumName: item.album.name,
            albumArt: item.album.images[0]?.url || '',
            playedAt: '',  // Top tracks don't have played_at timestamp
            previewUrl: item.preview_url,
            externalUrl: item.external_urls.spotify,
          }));
          setTopTracks(tracks);
        }
      } catch (err) {
        console.error('Error fetching top tracks:', err);
        // We don't set the main error for top tracks as it's less critical
      }
    };

    fetchTopTracks();
  }, [token, tokenLoading]);

  return {
    currentTrack,
    recentTracks,
    topTracks,
    isLoading: isLoading || tokenLoading,
    error: error || tokenError
  };
} 