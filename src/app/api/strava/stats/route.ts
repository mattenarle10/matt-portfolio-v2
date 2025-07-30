import { NextResponse } from 'next/server';

// Load environment variables
const CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

// Function to get a new access token
async function refreshAccessToken() {
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN!,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

// Route handler for GET /api/strava/stats
export async function GET() {
  try {
    // Get new access token
    const accessToken = await refreshAccessToken();

    // First, get the athlete info to get the athlete ID
    const athleteResponse = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!athleteResponse.ok) {
      throw new Error(`Failed to fetch athlete info: ${athleteResponse.status}`);
    }

    const athlete = await athleteResponse.json();
    const athleteId = athlete.id;

    if (!athleteId) {
      throw new Error('Could not determine athlete ID');
    }

    // Now fetch stats using the athlete ID
    const statsResponse = await fetch(
      `https://www.strava.com/api/v3/athletes/${athleteId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!statsResponse.ok) {
      throw new Error(`Failed to fetch athlete stats: ${statsResponse.status}`);
    }

    const stats = await statsResponse.json();
    
    // Return the stats as JSON
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error in stats endpoint:', error);
    return NextResponse.json(
      { error: `Failed to fetch athlete stats: ${error.message}` },
      { status: 500 }
    );
  }
}
