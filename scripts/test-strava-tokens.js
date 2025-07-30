// Script to test Strava tokens
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// Get current file and directory paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(dirname(__dirname), '.env.local') });

// Strava credentials
const CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.STRAVA_ACCESS_TOKEN;

// Token endpoint
const TOKEN_ENDPOINT = 'https://www.strava.com/oauth/token';

async function testStravaTokens() {
  console.log('Testing Strava tokens...');
  
  // First, try to make a request with the existing access token
  try {
    console.log('Testing current access token...');
    const activityResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=1', {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });
    
    if (activityResponse.ok) {
      const data = await activityResponse.json();
      console.log('✅ Success! Current access token works.');
      console.log(`Found ${data.length} activities. Most recent activity: ${data[0]?.name || 'Unknown'}`);
      return;
    } else {
      console.log('❌ Current access token expired. Refreshing...');
    }
  } catch (error) {
    console.error('Error testing access token:', error.message);
    console.log('Attempting to refresh token...');
  }
  
  // If we reach here, we need to refresh the token
  try {
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
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Token refreshed successfully!');
    console.log('New access token:', data.access_token);
    console.log('Expires in:', data.expires_in, 'seconds');
    
    // Test the new access token
    const activityResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=1', {
      headers: {
        'Authorization': `Bearer ${data.access_token}`
      }
    });
    
    if (activityResponse.ok) {
      const activities = await activityResponse.json();
      console.log('✅ Verified new access token works!');
      console.log(`Found ${activities.length} activities. Most recent activity: ${activities[0]?.name || 'Unknown'}`);
      
      // Update .env.local with the new access token
      const envPath = path.join(dirname(__dirname), '.env.local');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Replace the STRAVA_ACCESS_TOKEN
      if (envContent.includes('STRAVA_ACCESS_TOKEN=')) {
        envContent = envContent.replace(
          /STRAVA_ACCESS_TOKEN=.*/,
          `STRAVA_ACCESS_TOKEN=${data.access_token}`
        );
      } else {
        envContent += `\nSTRAVA_ACCESS_TOKEN=${data.access_token}\n`;
      }
      
      // Update refresh token too if we got a new one
      if (data.refresh_token) {
        console.log('Got new refresh token:', data.refresh_token);
        if (envContent.includes('STRAVA_REFRESH_TOKEN=')) {
          envContent = envContent.replace(
            /STRAVA_REFRESH_TOKEN=.*/,
            `STRAVA_REFRESH_TOKEN=${data.refresh_token}`
          );
        } else {
          envContent += `\nSTRAVA_REFRESH_TOKEN=${data.refresh_token}\n`;
        }
      }
      
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ Tokens have been updated in your .env.local file');
      
    } else {
      console.error('❌ New access token failed:', await activityResponse.text());
    }
    
  } catch (error) {
    console.error('Failed to refresh tokens:', error);
  }
}

testStravaTokens();
