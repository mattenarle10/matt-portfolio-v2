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

// Route handler for GET /api/strava/activities
export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const perPage = url.searchParams.get('per_page') || '3';
    
    // Get new access token
    const accessToken = await refreshAccessToken();

    // Fetch activities using the access token
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.status}`);
    }

    const activities = await response.json();
    
    // Return the activities as JSON
    return NextResponse.json(activities);
  } catch (error: unknown) {
    console.error('Error in activities endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to fetch activities: ${errorMessage}` },
      { status: 500 }
    );
  }
}
