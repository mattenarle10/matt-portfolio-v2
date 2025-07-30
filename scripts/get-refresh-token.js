// Script to exchange authorization code for refresh token
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

// Spotify credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Authorization code from the query parameter
const AUTH_CODE = 'AQAKBYnCz4wSVstcSfODPbIrbCm35kDrfbQhLOQeSNBJCf1G0uhxUEKkrKKfziRAxNCFtSLT32MPFD_gnzCUARvcZnb7cjAJwPHas_7WmlndxNa3Tx9J_9z8TqJIdBGAn7rv8NyqEMrEGdnBdixEK_xeJVLHE6W_pSPbssH9fH9jasS7ocTqpoOrloQxKn0sndLYC9l5xBV1aJpjk2HAr6rcuF4BGl6aeCYHrAax1vwOvuxDtrNzswR1CRl47N_XQI-JmTY2hf4';

// The redirect URI - must be the same as what was used during authorization
const REDIRECT_URI = 'https://mattenarle.vercel.app'; 

async function getRefreshToken() {
  try {
    console.log('Exchanging authorization code for tokens...');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: AUTH_CODE,
        redirect_uri: REDIRECT_URI
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
    
    // Update .env.local with the refresh token
    const envPath = path.join(dirname(__dirname), '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Plain token for Vercel (no quotes)
    console.log('\n=== FOR VERCEL ===');
    console.log('Copy this exact token to Vercel (no quotes):');
    console.log(data.refresh_token);
    
    // Replace or add the SPOTIFY_REFRESH_TOKEN
    if (envContent.includes('SPOTIFY_REFRESH_TOKEN=')) {
      envContent = envContent.replace(
        /SPOTIFY_REFRESH_TOKEN=.*/,
        `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`
      );
    } else {
      envContent += `\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Refresh token has been added to your .env.local file');
    console.log('\n🔥 IMPORTANT: Make sure to add this refresh token to your Vercel environment variables too!');
    
  } catch (error) {
    console.error('Failed to exchange code for tokens:', error);
  }
}

getRefreshToken();
