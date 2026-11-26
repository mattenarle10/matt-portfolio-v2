"use client"

import { useEffect, useState } from "react"

export interface SpotifyTrack {
  id: string
  name: string
  artists: string[]
  albumName: string
  albumArt: string
  playedAt: string
  previewUrl: string | null
  externalUrl: string
}

const CACHE_KEY_RECENT = "spotify_recent_tracks"
const CACHE_KEY_TOP = "spotify_top_tracks"
const CACHE_EXPIRY = 1000 * 60 * 30

function readCachedTracks(key: string): SpotifyTrack[] {
  try {
    const cached = localStorage.getItem(key)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Array.isArray(data) && Date.now() - timestamp < CACHE_EXPIRY) {
        return data
      }
    }
  } catch {
    // Storage may be unavailable in a private browsing session.
  }
  return []
}

async function loadTracks(
  endpoint: string,
  key: string,
  signal: AbortSignal
): Promise<SpotifyTrack[]> {
  const response = await fetch(endpoint, { signal })
  if (!response.ok) throw new Error("Could not load Spotify tracks")

  const tracks = await response.json()
  if (!Array.isArray(tracks)) throw new Error("Invalid Spotify response")
  if (tracks.length > 0) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ data: tracks, timestamp: Date.now() })
      )
    } catch {
      // Keep showing the fetched tracks if storage is unavailable.
    }
  }
  return tracks
}

export function useSpotify() {
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([])
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const recentCache = readCachedTracks(CACHE_KEY_RECENT)
    const topCache = readCachedTracks(CACHE_KEY_TOP)
    if (recentCache.length) setRecentTracks(recentCache)
    if (topCache.length) setTopTracks(topCache)

    void Promise.allSettled([
      loadTracks("/api/spotify/recently-played", CACHE_KEY_RECENT, signal),
      loadTracks("/api/spotify/top-tracks", CACHE_KEY_TOP, signal),
    ]).then(([recent, top]) => {
      if (signal.aborted) return
      if (recent.status === "fulfilled" && recent.value.length)
        setRecentTracks(recent.value)
      if (top.status === "fulfilled" && top.value.length)
        setTopTracks(top.value)
      if (
        recent.status === "rejected" &&
        top.status === "rejected" &&
        !recentCache.length &&
        !topCache.length
      ) {
        setError("Could not load Spotify tracks")
      }
      setIsLoading(false)
    })

    return () => controller.abort()
  }, [])

  return { recentTracks, topTracks, isLoading, error }
}
