import { NextResponse } from "next/server"
import { GET as getToken } from "../token/route"

// Define types for Spotify API responses
type SpotifyArtist = {
  name: string
  id: string
}

type SpotifyImage = {
  url: string
  height: number
  width: number
}

type SpotifyAlbum = {
  id: string
  name: string
  images: SpotifyImage[]
}

type SpotifyTrack = {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  preview_url: string | null
  external_urls: {
    spotify: string
  }
}

type SpotifyRecentlyPlayedItem = {
  track: SpotifyTrack
  played_at: string
}

type SpotifyTopTracksResponse = {
  items: SpotifyTrack[]
}

export async function GET() {
  try {
    // Get the access token using our token endpoint
    const tokenResponse = await getToken()
    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      throw new Error("Failed to obtain Spotify access token")
    }

    // If the user doesn't have top tracks, we'll use a fallback time range
    // Try short_term first (4 weeks), then medium_term (6 months), then long_term (years)
    const timeRanges = ["short_term", "medium_term", "long_term"]
    let tracks = []

    // Try each time range until we get some tracks
    for (const timeRange of timeRanges) {
      // Fetch top tracks from Spotify API
      const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
          cache: "no-store",
        }
      )

      if (!response.ok) {
        continue // Try next time range
      }

      const data = (await response.json()) as SpotifyTopTracksResponse

      if (data.items && data.items.length > 0) {
        // Transform the data to match our component's expectations
        tracks = data.items.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          albumName: track.album.name,
          albumArt: track.album.images[0]?.url || "",
          playedAt: "", // Top tracks don't have played_at timestamp
          previewUrl: track.preview_url,
          externalUrl: track.external_urls.spotify,
        }))
        break // We got tracks, no need to try other time ranges
      }
    }

    // If we still don't have top tracks, return recently played tracks as a fallback
    if (tracks.length === 0) {
      // Try fetching recently played as a fallback
      const recentResponse = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=10",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
          cache: "no-store",
        }
      )

      if (recentResponse.ok) {
        const recentData = await recentResponse.json()

        if (recentData && recentData.items && recentData.items.length > 0) {
          tracks = recentData.items.map((item: SpotifyRecentlyPlayedItem) => ({
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists.map(
              (artist: { name: string }) => artist.name
            ),
            albumName: item.track.album.name,
            albumArt: item.track.album.images[0]?.url || "",
            playedAt: item.played_at,
            previewUrl: item.track.preview_url,
            externalUrl: item.track.external_urls.spotify,
          }))
        }
      }
    }

    return NextResponse.json(tracks)
  } catch (error) {
    console.error("Error in Spotify Top Tracks API:", error)
    return NextResponse.json(
      [], // Return empty array instead of error object
      { status: 200 } // Return 200 to avoid client-side errors
    )
  }
}
