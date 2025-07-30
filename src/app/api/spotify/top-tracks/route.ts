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

type SpotifyTopTracksResponse = {
  items: SpotifyTrack[];
};

export async function GET() {
  try {
    // Get the access token using our token endpoint
    const tokenResponse = await getToken();
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to obtain Spotify access token');
    }
    
    // Fetch top tracks from Spotify API
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top tracks: ${response.status}`);
    }

    const data = await response.json() as SpotifyTopTracksResponse;
    
    // Transform the data to match our component's expectations
    const tracks = data.items.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      albumName: track.album.name,
      albumArt: track.album.images[0]?.url || '',
      playedAt: '', // Top tracks don't have played_at timestamp
      previewUrl: track.preview_url,
      externalUrl: track.external_urls.spotify,
    }));

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error in Spotify Top Tracks API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top tracks' },
      { status: 500 }
    );
  }
}
