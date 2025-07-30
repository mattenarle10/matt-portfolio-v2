import { NextResponse } from 'next/server';
import { GET as getToken } from '../token/route';

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

type SpotifyTrack = {
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
  track: SpotifyTrack;
  played_at: string;
};

type SpotifyRecentlyPlayedResponse = {
  items: SpotifyRecentlyPlayedItem[];
};

export async function GET() {
  try {
    // Get the access token using our token endpoint
    const tokenResponse = await getToken();
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to obtain Spotify access token');
    }
    
    // Fetch recently played tracks from Spotify API
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recently played tracks: ${response.status}`);
    }

    const data = await response.json() as SpotifyRecentlyPlayedResponse;
    
    // Transform the data to match our component's expectations
    const tracks = data.items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((artist) => artist.name),
      albumName: item.track.album.name,
      albumArt: item.track.album.images[0]?.url || '',
      playedAt: item.played_at,
      previewUrl: item.track.preview_url,
      externalUrl: item.track.external_urls.spotify,
    }));

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error in Spotify Recently Played API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recently played tracks' },
      { status: 500 }
    );
  }
}
