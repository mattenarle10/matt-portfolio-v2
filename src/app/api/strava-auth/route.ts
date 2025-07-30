import { NextResponse } from 'next/server';
import { getAuthorizationUrl, exchangeAuthCode } from '@/lib/strava';

// Strava OAuth credentials
const REDIRECT_URI = 'http://localhost:3000/strava-auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  // If we have a code, exchange it for tokens
  if (code) {
    try {
      const data = await exchangeAuthCode(code);
      
      // Return the tokens
      return NextResponse.json({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: new Date(data.expires_at * 1000).toISOString(),
        scope: data.scope,
      });
    } catch (error: any) {
      console.error('Error exchanging code for token:', error);
      return NextResponse.json({ 
        error: error.message || 'Failed to exchange code for token' 
      }, { status: 500 });
    }
  }
  
  // If no code, return the authorization URL - always force approval to ensure we get proper scopes
  const authUrl = getAuthorizationUrl(REDIRECT_URI);
  
  return NextResponse.json({ authUrl });
}
