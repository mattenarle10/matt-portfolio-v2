'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StravaAuth() {
  const [authUrl, setAuthUrl] = useState('');
  const [tokens, setTokens] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        const response = await fetch('/api/strava-auth');
        const data = await response.json();
        setAuthUrl(data.authUrl);
      } catch (err) {
        setError('Failed to get authorization URL');
      } finally {
        setLoading(false);
      }
    };

    // Check if we have a code in the URL (after redirect)
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    
    if (code) {
      // Exchange code for token
      const exchangeCode = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/strava-auth?code=${code}`);
          const data = await response.json();
          setTokens(data);
        } catch (err) {
          setError('Failed to exchange code for token');
        } finally {
          setLoading(false);
        }
      };
      
      exchangeCode();
    } else {
      fetchAuthUrl();
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light mb-6">Strava Authorization</h1>
      
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300 font-light">Loading...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 font-light">{error}</p>
      ) : tokens ? (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h2 className="text-xl font-light text-green-800 dark:text-green-400 mb-2">Authorization Successful!</h2>
            <p className="text-gray-600 dark:text-gray-300 font-light mb-4">
              Your Strava account has been successfully authorized with the required permissions (read, activity:read, activity:read_all).
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-light">Your Tokens (Add these to your .env.local file)</h3>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
              <pre className="text-sm font-light">
{`NEXT_PUBLIC_STRAVA_CLIENT_ID=170392
STRAVA_CLIENT_SECRET=90bdd88f90783413f627fc6255976a8e8e8c0761
STRAVA_REFRESH_TOKEN=${tokens.refresh_token}`}
              </pre>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 font-light">
              <p>Access Token: {tokens.access_token}</p>
              <p>Refresh Token: {tokens.refresh_token}</p>
              <p>Expires At: {tokens.expires_at}</p>
              <p>Scope: {tokens.scope}</p>
            </div>
          </div>
          
          <div className="pt-4">
            <Link 
              href="/"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-light"
            >
              Return to homepage
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300 font-light mb-6">
            Click the button below to authorize your Strava account with the required permissions (read, activity:read, activity:read_all).
          </p>
          
          <a 
            href={authUrl}
            className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-light transition-colors"
          >
            Authorize with Strava
          </a>
        </div>
      )}
    </div>
  );
}
