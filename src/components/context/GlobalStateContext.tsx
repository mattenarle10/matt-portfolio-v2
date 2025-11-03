"use client"

import React, {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react"
import type { SpotifyTrack } from "@/app/api/spotify/useSpotify"
import type { ActivityData, StatsData } from "@/app/api/strava/useStrava"

// Define the shape of our global state
interface GlobalState {
  // Spotify state
  recentTracks: SpotifyTrack[]
  topTracks: SpotifyTrack[]
  spotifyLoaded: boolean

  // Strava state
  stravaActivities: ActivityData[]
  stravaStats: StatsData | null
  stravaLoaded: boolean

  // Update functions
  setSpotifyData: (
    recentTracks: SpotifyTrack[],
    topTracks: SpotifyTrack[]
  ) => void
  setStravaData: (activities: ActivityData[], stats: StatsData | null) => void
}

// Create the context with default values
const GlobalStateContext = createContext<GlobalState>({
  recentTracks: [],
  topTracks: [],
  spotifyLoaded: false,
  stravaActivities: [],
  stravaStats: null,
  stravaLoaded: false,
  setSpotifyData: () => {},
  setStravaData: () => {},
})

// Provider component
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  // Spotify state
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([])
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([])
  const [spotifyLoaded, setSpotifyLoaded] = useState(false)

  // Strava state
  const [stravaActivities, setStravaActivities] = useState<ActivityData[]>([])
  const [stravaStats, setStravaStats] = useState<StatsData | null>(null)
  const [stravaLoaded, setStravaLoaded] = useState(false)

  // Update functions
  const setSpotifyData = (recent: SpotifyTrack[], top: SpotifyTrack[]) => {
    setRecentTracks(recent)
    setTopTracks(top)
    setSpotifyLoaded(true)
  }

  const setStravaData = (
    activities: ActivityData[],
    stats: StatsData | null
  ) => {
    setStravaActivities(activities)
    setStravaStats(stats)
    setStravaLoaded(true)
  }

  return (
    <GlobalStateContext.Provider
      value={{
        recentTracks,
        topTracks,
        spotifyLoaded,
        stravaActivities,
        stravaStats,
        stravaLoaded,
        setSpotifyData,
        setStravaData,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}

// Custom hook to use the global state
export const useGlobalState = () => useContext(GlobalStateContext)
