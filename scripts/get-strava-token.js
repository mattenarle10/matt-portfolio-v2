// Script to get Strava tokens with proper scopes
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

// Authorization code from the query parameter
// Code obtained from the redirect URL after authorization
const AUTH_CODE = '1af6d8d298ae7eefdea1ad8a1d8c8cc4e6d81fe2';

// The redirect URI - must match your Strava app settings
const REDIRECT_URI = 'https://mattenarle.vercel.app';

async function getStravaTokens() {
  // First, provide instructions if no auth code
  if (!AUTH_CODE) {
    console.log('=== STRAVA AUTHORIZATION INSTRUCTIONS ===');
    console.log('1. Visit the following URL in your browser:');
    console.log(`https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=read,activity:read,activity:read_all`);
    console.log('\n2. Authorize the app');
    console.log('3. You will be redirected to your redirect URI with a code parameter');
    console.log('4. Copy the "code" parameter from the URL');
    console.log('5. Update the AUTH_CODE constant in this script');
    console.log('6. Run this script again');
    return;
  }

  try {
    console.log('Exchanging authorization code for tokens...');
    
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: AUTH_CODE,
        grant_type: 'authorization_code'
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Error getting tokens:', data.error);
      return;
    }

    console.log('=== SUCCESS ===');
    console.log('Access Token:', data.access_token);
    console.log('Refresh Token:', data.refresh_token);
    console.log('Expires in:', data.expires_in, 'seconds');
    
    // Update .env.local with the tokens
    const envPath = path.join(dirname(__dirname), '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace or add the tokens
    if (envContent.includes('STRAVA_ACCESS_TOKEN=')) {
      envContent = envContent.replace(
        /STRAVA_ACCESS_TOKEN=.*/,
        `STRAVA_ACCESS_TOKEN=${data.access_token}`
      );
    } else {
      envContent += `\nSTRAVA_ACCESS_TOKEN=${data.access_token}\n`;
    }
    
    if (envContent.includes('STRAVA_REFRESH_TOKEN=')) {
      envContent = envContent.replace(
        /STRAVA_REFRESH_TOKEN=.*/,
        `STRAVA_REFRESH_TOKEN=${data.refresh_token}`
      );
    } else {
      envContent += `\nSTRAVA_REFRESH_TOKEN=${data.refresh_token}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Tokens have been updated in your .env.local file');
    
    // Test the new access token
    console.log('\nTesting the new access token...');
    const activityResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=1', {
      headers: {
        'Authorization': `Bearer ${data.access_token}`
      }
    });
    
    if (activityResponse.ok) {
      const activities = await activityResponse.json();
      console.log('✅ New access token works!');
      if (activities.length > 0) {
        console.log(`Most recent activity: ${activities[0].name} (${new Date(activities[0].start_date).toLocaleDateString()})`);
      } else {
        console.log('No activities found in your account.');
      }
    } else {
      console.error('❌ New access token failed:', await activityResponse.text());
    }
    
  } catch (error) {
    console.error('Failed to exchange code for tokens:', error);
  }
}

getStravaTokens();
