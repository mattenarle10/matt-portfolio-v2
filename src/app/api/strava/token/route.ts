import { NextResponse } from 'next/server';

// Define environment variable types
const CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;
const TOKEN_ENDPOINT = 'https://www.strava.com/oauth/token';

export async function GET() {
  try {
    // Validate environment variables
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json(
        { error: 'Missing Strava API credentials' },
        { status: 500 }
      );
    }
    
    // Use URLSearchParams for form data
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('refresh_token', REFRESH_TOKEN);
    params.append('grant_type', 'refresh_token');
    
    // Make request to Strava for access token
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to get Strava token: ${response.status}`);
    }

    const data = await response.json();
    
    // Return only what's needed to the client
    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
    });
  } catch (error) {
    console.error('Error in Strava token API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Strava authentication token' },
      { status: 500 }
    );
  }
}
