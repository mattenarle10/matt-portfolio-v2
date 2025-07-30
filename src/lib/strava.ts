// Strava API utility functions

// These should be stored in .env.local file
const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '170392';
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || '90bdd88f90783413f627fc6255976a8e8e8c0761';
const STRAVA_REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN || '1eb8a076112205a1e9cf0c31311b297714f287a5';

type StravaTokenResponse = {
  token_type: string;
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  athlete?: any;
  scope?: string;
};

export type StravaActivity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  map: {
    summary_polyline: string;
  };
  average_speed: number;
};

// Store token in memory to avoid unnecessary refreshes
interface TokenCache {
  accessToken: string;
  refreshToken: string; // Store refresh token to handle updates
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

/**
 * Get a fresh access token using the refresh token
 */
export async function getAccessToken(): Promise<string> {
  // Check if we have a cached token that's still valid (with 10 minute buffer)
  const now = Date.now();
  const bufferTime = 10 * 60 * 1000; // 10 minutes in milliseconds
  
  if (tokenCache && tokenCache.accessToken && tokenCache.expiresAt > now + bufferTime) {
    console.log('Using cached token, expires in', Math.round((tokenCache.expiresAt - now) / 1000 / 60), 'minutes');
    return tokenCache.accessToken;
  }

  console.log('Token expired or not found, refreshing...');

  // Refresh the token
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: tokenCache?.refreshToken || STRAVA_REFRESH_TOKEN, // Use cached refresh token if available
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refresh token: ${response.status} ${errorText}`);
    }

    const data = await response.json() as StravaTokenResponse;
    console.log('Token refreshed successfully, expires in', Math.round(data.expires_in / 60), 'minutes');

    // Cache the token and the new refresh token
    tokenCache = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token, // Store the new refresh token
      expiresAt: data.expires_at * 1000 // Convert to milliseconds
    };

    return data.access_token;
  } catch (error) {
    console.error('Error refreshing Strava token:', error);
    throw new Error(`Failed to refresh Strava token: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeAuthCode(code: string): Promise<StravaTokenResponse> {
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to exchange code: ${response.status} ${errorText}`);
    }

    const data = await response.json() as StravaTokenResponse;
    
    // Cache the tokens
    tokenCache = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at * 1000 // Convert to milliseconds
    };
    
    return data;
  } catch (error) {
    console.error('Error exchanging auth code:', error);
    throw new Error(`Failed to exchange auth code: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Fetch recent activities from Strava
 */
export async function getRecentActivities(limit: number = 3): Promise<StravaActivity[]> {
  try {
    console.log('Fetching recent activities...');
    const accessToken = await getAccessToken();
    
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to fetch activities: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const activities: StravaActivity[] = await response.json();
    console.log(`Found ${activities.length} activities`);
    return activities;
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    throw error;
  }
}

/**
 * Generate a Strava authorization URL with proper scopes
 */
export function getAuthorizationUrl(redirectUri: string): string {
  return `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=read,activity:read,activity:read_all`;
}