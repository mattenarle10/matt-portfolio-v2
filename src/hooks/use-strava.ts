"use client"

import { useEffect, useRef, useState } from "react"

// Define types for Strava API responses
type StravaMap = {
  id: string
  summary_polyline: string
}

type StravaActivity = {
  id: number
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: string
  sport_type: string
  start_date: string
  start_date_local: string
  map: StravaMap
  average_speed: number
  average_heartrate?: number
  max_heartrate?: number
  kudos_count: number
  athlete_count: number
  photo_count: number
  achievement_count: number
}

// Type for athlete stats
type AthleteStats = {
  recent_run_totals: ActivityTotals
  recent_ride_totals: ActivityTotals
  ytd_run_totals: ActivityTotals
  ytd_ride_totals: ActivityTotals
  all_run_totals: ActivityTotals
  all_ride_totals: ActivityTotals
}

type ActivityTotals = {
  count: number
  distance: number
  moving_time: number
  elevation_gain: number
}

// Type for our component to use - simplified from API response
export interface ActivityData {
  id: number
  name: string
  distance: number // in kilometers
  movingTime: number // in minutes
  date: string
  mapPolyline?: string
  elevationGain: number // in meters
  averageSpeed: number // km/h
  averageHeartrate?: number
  maxHeartrate?: number
  kudosCount: number
  type: string
}

// Stats interface
export interface StatsData {
  recentRuns: {
    count: number
    distance: number // in km
    time: number // in minutes
  }
  ytdRuns: {
    count: number
    distance: number // in km
  }
  allTimeRuns: {
    count: number
    distance: number // in km
  }
}

// Cache keys for localStorage
const ACTIVITIES_CACHE_KEY = "strava_recent_activities"
const STATS_CACHE_KEY = "strava_athlete_stats"
const CACHE_EXPIRY = 1000 * 60 * 30 // 30 minutes

export function useStrava() {
  // Store multiple activities
  const [activities, setActivities] = useState<ActivityData[]>([])
  // Store athlete stats
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  // Initialize from cache when on client
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    try {
      const activitiesCached = localStorage.getItem(ACTIVITIES_CACHE_KEY)
      if (activitiesCached) {
        const { data, timestamp } = JSON.parse(activitiesCached)
        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setActivities(data)
          setIsLoading(false)
        }
      }

      const statsCached = localStorage.getItem(STATS_CACHE_KEY)
      if (statsCached) {
        const { data, timestamp } = JSON.parse(statsCached)
        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setStats(data)
          setStatsLoading(false)
        }
      }
    } catch (e) {
      console.error("Error reading from cache:", e)
    }
  }, [])
  const [error, setError] = useState<string | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)

  // Track whether the component is mounted
  const isMounted = useRef(true)

  // Get recent activities from our API endpoint
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        if (!activities.length) {
          setIsLoading(true)
        }

        // Call our server endpoint instead of Strava API directly
        const response = await fetch("/api/strava/activities?per_page=3")

        if (!response.ok) {
          throw new Error(
            `Failed to fetch recent activities: ${response.status}`
          )
        }

        const data = await response.json()

        if (
          data &&
          Array.isArray(data) &&
          data.length > 0 &&
          isMounted.current
        ) {
          const processedActivities = data.map((activity: StravaActivity) => ({
            id: activity.id,
            name: activity.name,
            distance: activity.distance / 1000, // convert meters to kilometers
            movingTime: Math.round(activity.moving_time / 60), // convert seconds to minutes
            date: activity.start_date,
            mapPolyline: activity.map?.summary_polyline,
            elevationGain: activity.total_elevation_gain,
            averageSpeed: activity.average_speed * 3.6, // convert m/s to km/h
            averageHeartrate: activity.average_heartrate,
            maxHeartrate: activity.max_heartrate,
            kudosCount: activity.kudos_count,
            type: activity.type,
          }))

          // Only update state if component is still mounted
          if (isMounted.current) {
            setActivities(processedActivities)

            // Cache the results
            try {
              localStorage.setItem(
                ACTIVITIES_CACHE_KEY,
                JSON.stringify({
                  data: processedActivities,
                  timestamp: Date.now(),
                })
              )
            } catch (e) {
              console.error("Error caching recent activities:", e)
            }
          }
        }
      } catch (err) {
        console.error("Error fetching recent activities:", err)
        if (isMounted.current) {
          setError("Could not load recent activities")
        }
      } finally {
        // Only update loading state if mounted
        if (isMounted.current) {
          setIsLoading(false)
        }
      }
    }

    // Fetch athlete stats from our API endpoint
    const fetchAthleteStats = async () => {
      try {
        if (!stats) {
          setStatsLoading(true)
        }

        // Call our server endpoint instead of Strava API directly
        const response = await fetch("/api/strava/stats")

        if (!response.ok) {
          throw new Error(`Failed to fetch athlete stats: ${response.status}`)
        }

        const data: AthleteStats = await response.json()

        if (data && isMounted.current) {
          const processedStats: StatsData = {
            recentRuns: {
              count: data.recent_run_totals.count,
              distance: data.recent_run_totals.distance / 1000, // m to km
              time: Math.round(data.recent_run_totals.moving_time / 60), // s to min
            },
            ytdRuns: {
              count: data.ytd_run_totals.count,
              distance: data.ytd_run_totals.distance / 1000, // m to km
            },
            allTimeRuns: {
              count: data.all_run_totals.count,
              distance: data.all_run_totals.distance / 1000, // m to km
            },
          }

          // Only update state if component is still mounted
          if (isMounted.current) {
            setStats(processedStats)

            // Cache the results
            try {
              localStorage.setItem(
                STATS_CACHE_KEY,
                JSON.stringify({
                  data: processedStats,
                  timestamp: Date.now(),
                })
              )
            } catch (e) {
              console.error("Error caching athlete stats:", e)
            }
          }
        }
      } catch (err) {
        console.error("Error fetching athlete stats:", err)
        if (isMounted.current) {
          setStatsError("Could not load athlete stats")
        }
      } finally {
        // Only update loading state if mounted
        if (isMounted.current) {
          setStatsLoading(false)
        }
      }
    }

    // Run both fetches
    fetchRecentActivities()
    fetchAthleteStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // No dependencies since we're using our server endpoints now

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return {
    activities,
    stats,
    isLoading,
    statsLoading,
    error,
    statsError,
  }
}

