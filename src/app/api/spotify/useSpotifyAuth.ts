import { useState, useEffect } from 'react';

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export const useSpotifyAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(true);
      getAccessToken()
        .then((data) => {
          setToken(data.access_token);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching Spotify access token:', err);
          setError('Failed to authenticate with Spotify');
          setIsLoading(false);
        });
    }
  }, [token]);

  const getAccessToken = async (): Promise<TokenResponse> => {
    try {
      // For client-side usage, we'll need a server endpoint
      // to keep secrets secure
      const response = await fetch('/api/spotify/token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }
      
      return response.json();
    } catch (err) {
      console.error('Error in getAccessToken:', err);
      throw err;
    }
  };
  
  return { token, isLoading, error };
};