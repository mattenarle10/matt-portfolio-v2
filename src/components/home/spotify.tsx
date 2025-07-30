'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSpotify } from '@/app/api/spotify/useSpotify';

type SpotifyTrack = {
  id: string;
  name: string;
  artists: string[];
  albumArt: string;
  playedAt: string;
  albumName: string;
  previewUrl: string | null;
  externalUrl: string;
};

const SpotifyRecentlyPlayed = () => {
  const { recentTracks, topTracks, isLoading, error } = useSpotify();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('Recent tracks in component:', recentTracks);
    console.log('Top tracks in component:', topTracks);
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
  }, [recentTracks, topTracks, isLoading, error]);

  // We don't need to fetch data here anymore as useSpotify handles that

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  const playPreview = (track: SpotifyTrack) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsPlaying(false);
      
      if (currentTrackId === track.id) {
        setCurrentTrackId(null);
        return;
      }
    }
    
    if (track.previewUrl) {
      const audio = new Audio(track.previewUrl);
      audio.volume = 0.7;
      audio.play();
      setCurrentAudio(audio);
      setIsPlaying(true);
      setCurrentTrackId(track.id);
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTrackId(null);
      });
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-light mb-4 text-left">Recently Played</h2>
      
      {isLoading && (
        <div className="flex justify-start py-4">
          <div className="animate-pulse flex space-x-4 w-full">
            <div className="rounded-md bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )}
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
      
      <div className="space-y-4">
        {recentTracks.map((track) => (
          <div 
            key={track.id} 
            className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="relative min-w-[50px] h-[50px] mr-4">
              <Image 
                src={track.albumArt} 
                alt={track.albumName}
                fill
                className="object-cover rounded-md"
              />
              <button 
                onClick={() => playPreview(track)} 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-md"
                disabled={!track.previewUrl}
              >
                {currentTrackId === track.id && isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="flex-grow">
              <a 
                href={track.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-normal hover:text-blue-500 transition-colors duration-200"
              >
                {track.name}
              </a>
              <p className="text-gray-600 text-sm">{track.artists.join(', ')}</p>
            </div>
            
            <div className="text-xs text-gray-400">
              {formatDate(track.playedAt)}
            </div>
          </div>
        ))}
      </div>
      
      {!isLoading && recentTracks.length === 0 && !error && (
        <p className="text-gray-500">No recently played tracks found.</p>
      )}

      <div className="mt-4 text-xs text-gray-400 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 168 168">
          <path fill="#1ED760" d="M83.996 0C37.747 0 0 37.747 0 84c0 46.251 37.747 84 83.996 84 46.254 0 84.004-37.749 84.004-84 0-46.253-37.75-84-84.004-84zm38.472 121.203c-1.505 2.467-4.718 3.24-7.177 1.737-19.665-12.019-44.417-14.734-73.567-8.075-2.809.644-5.609-1.117-6.249-3.925-.643-2.809 1.11-5.609 3.926-6.249 31.9-7.293 59.263-4.154 81.336 9.334 2.46 1.51 3.24 4.72 1.731 7.178zm10.27-22.807c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35-1.04-3.453.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z"/>
        </svg>
        Powered by Spotify
      </div>
    </section>
  );
};

export default SpotifyRecentlyPlayed;