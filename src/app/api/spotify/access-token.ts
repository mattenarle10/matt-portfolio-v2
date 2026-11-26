export async function getSpotifyAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify API credentials")
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  )
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) {
    throw new Error(`Failed to refresh Spotify token: ${response.status}`)
  }
  const { access_token: token } = await response.json()
  if (typeof token !== "string" || !token) {
    throw new Error("Spotify did not return an access token")
  }
  return token
}
