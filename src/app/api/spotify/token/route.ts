import { NextResponse } from "next/server"

// Define environment variable types
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"

export async function GET() {
  try {
    // Validate environment variables
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json(
        { error: "Missing Spotify API credentials" },
        { status: 500 }
      )
    }

    // Basic authentication for Spotify token endpoint
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    )

    // Use URLSearchParams for form data
    const params = new URLSearchParams()
    params.append("grant_type", "refresh_token")
    params.append("refresh_token", REFRESH_TOKEN)

    // Make request to Spotify for access token
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.status}`)
    }

    const data = await response.json()

    // Return only what's needed to the client
    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
    })
  } catch (error) {
    console.error("Error in Spotify token API:", error)
    return NextResponse.json(
      { error: "Failed to fetch Spotify authentication token" },
      { status: 500 }
    )
  }
}
