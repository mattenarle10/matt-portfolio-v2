"use client"

import {
  Activity,
  ArrowUpRight,
  Bike,
  Calendar,
  Dumbbell,
  TrendingUp,
  Waves,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useGlobalState } from "@/context"
import { type ActivityData, type StatsData, useStrava } from "@/hooks"

export function StravaActivity() {
  // Get global state
  const globalState = useGlobalState()

  // Initialize local state
  const [localActivities, setLocalActivities] = useState<ActivityData[]>([])
  const [localStats, setLocalStats] = useState<StatsData | null>(null)
  const [localIsLoading, setLocalIsLoading] = useState(true)
  const [localStatsLoading, setLocalStatsLoading] = useState(true)
  const [localError, setLocalError] = useState<string | null>(null)
  const [localStatsError, setLocalStatsError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Track screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Initialize from global state if available
  useEffect(() => {
    if (globalState.stravaLoaded) {
      setLocalActivities(globalState.stravaActivities)
      setLocalStats(globalState.stravaStats)
      setLocalIsLoading(false)
      setLocalStatsLoading(false)
    }
  }, [
    globalState.stravaLoaded,
    globalState.stravaActivities,
    globalState.stravaStats,
  ])

  // Always fetch from API to ensure we have data
  const {
    activities: apiActivities,
    stats: apiStats,
    error: apiError,
    statsError: apiStatsError,
  } = useStrava()

  // Update local state when API data changes
  useEffect(() => {
    // Update local state whenever we get new API data
    if (apiActivities.length > 0) {
      setLocalActivities(apiActivities)
      setLocalIsLoading(false)
    }

    if (apiStats) {
      setLocalStats(apiStats)
      setLocalStatsLoading(false)
    }

    // Save to global state if we have both types of data
    if (apiActivities.length > 0 && apiStats) {
      globalState.setStravaData(apiActivities, apiStats)
    }

    if (apiError) setLocalError(apiError)
    if (apiStatsError) setLocalStatsError(apiStatsError)
  }, [apiActivities, apiStats, apiError, apiStatsError, globalState])

  // Use local state for component rendering
  const activities = localActivities
  const stats = localStats
  const isLoading = localIsLoading
  const statsLoading = localStatsLoading
  const error = localError
  const statsError = localStatsError

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date)
    } catch {
      return "recently"
    }
  }

  return (
    <div className="flex flex-col space-y-3 md:space-y-4">
      {/* Header */}
      <div className="mb-2 md:mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base md:text-lg font-light text-black dark:text-white">
              Training
            </h2>
          </div>
          <a
            href="https://www.strava.com/athletes/mattenarle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-black dark:text-white/70 hover:text-orange-500 dark:hover:text-orange-400 flex items-center gap-1 outline-none focus:outline-none focus:ring-0 transition-all duration-200 ease-out hover:translate-x-0.5"
          >
            View on Strava
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Mobile: Combined Card */}
      <div className="md:hidden">
        <div
          className="overflow-hidden rounded-md border border-white/10 dark:border-black/10 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{ background: "var(--color-background)" }}
        >
          <div className="p-2">
            {/* Stats Section - Compact */}
            {statsLoading ? (
              <div className="mb-3">
                <div className="font-light text-sm text-black dark:text-white border-b border-white/10 dark:border-black/10 pb-1 mb-2">
                  Run Stats
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                  <div className="h-12 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                  <div className="h-12 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                </div>
              </div>
            ) : (
              stats && (
                <div className="mb-3">
                  <h3 className="font-light text-xs text-black dark:text-white border-b border-white/10 dark:border-black/10 pb-1 mb-2">
                    Run Stats
                  </h3>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                    <div className="run-stats-tile rounded-md p-1.5 text-center">
                      <div className="flex items-center justify-center mb-0.5">
                        <Activity className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                      </div>
                      <p className="text-black dark:text-white/60 uppercase tracking-wider mb-0.5 text-[9px]">
                        8 Weeks
                      </p>
                      <p className="text-orange-500 dark:text-orange-400 font-medium">
                        {stats.recentRuns.distance.toFixed(0)}
                        <span className="text-[8px]">km</span>
                      </p>
                    </div>
                    <div className="run-stats-tile rounded-md p-1.5 text-center">
                      <div className="flex items-center justify-center mb-0.5">
                        <Calendar className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                      </div>
                      <p className="text-black dark:text-white/60 uppercase tracking-wider mb-0.5 text-[9px]">
                        YTD
                      </p>
                      <p className="text-orange-500 dark:text-orange-400 font-medium">
                        {stats.ytdRuns.distance.toFixed(0)}
                        <span className="text-[8px]">km</span>
                      </p>
                    </div>
                    <div className="run-stats-tile rounded-md p-1.5 text-center">
                      <div className="flex items-center justify-center mb-0.5">
                        <TrendingUp className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                      </div>
                      <p className="text-black dark:text-white/60 uppercase tracking-wider mb-0.5 text-[9px]">
                        All Time
                      </p>
                      <p className="text-orange-500 dark:text-orange-400 font-medium">
                        {stats.allTimeRuns.distance.toFixed(0)}
                        <span className="text-[8px]">km</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Activity Section */}
            {isLoading ? (
              <div>
                <div className="font-light text-xs text-black dark:text-white border-b border-white/10 dark:border-black/10 pb-1 mb-2">
                  Recent Activities
                </div>
                <div className="space-y-2">
                  <div className="h-14 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                  <div className="h-14 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                </div>
              </div>
            ) : (
              activities.length > 0 && (
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 dark:border-black/10 pb-1 mb-2">
                    <span className="font-light text-xs text-black dark:text-white">
                      Recent Activities
                    </span>
                    <span className="flex gap-0.5">
                      <Waves className="h-3 w-3 text-orange-500" />
                      <Bike className="h-3 w-3 text-orange-500" />
                      <Activity className="h-3 w-3 text-orange-500" />
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activities.slice(0, 2).map((activity: ActivityData) => (
                      <div key={activity.id} className="py-1">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-1">
                            {activity.type === "Run" && (
                              <Activity className="h-3 w-3 text-orange-500 flex-shrink-0" />
                            )}
                            {activity.type === "Ride" && (
                              <Bike className="h-3 w-3 text-orange-500 flex-shrink-0" />
                            )}
                            {activity.type === "Swim" && (
                              <Waves className="h-3 w-3 text-orange-500 flex-shrink-0" />
                            )}
                            {activity.type === "WeightTraining" && (
                              <Dumbbell className="h-3 w-3 text-orange-500 flex-shrink-0" />
                            )}
                            {![
                              "Run",
                              "Ride",
                              "Swim",
                              "WeightTraining",
                            ].includes(activity.type) && (
                              <Activity className="h-3 w-3 text-orange-500 flex-shrink-0" />
                            )}
                            <h4 className="font-light text-xs text-black dark:text-white">
                              {activity.name}
                            </h4>
                          </div>
                          <span className="text-[10px] text-black dark:text-white/70">
                            {formatDate(activity.date)}
                          </span>
                        </div>
                        <div className="flex flex-wrap divide-x divide-black/15 dark:divide-white/15 text-[10px]">
                          <div className="px-1.5 py-0.5">
                            <span>
                              {activity.distance.toFixed(1)}{" "}
                              <span className="text-black dark:text-white/60">
                                km
                              </span>
                            </span>
                          </div>
                          <div className="px-1.5 py-0.5">
                            <span>
                              {activity.movingTime}{" "}
                              <span className="text-black dark:text-white/60">
                                min
                              </span>
                            </span>
                          </div>
                          <div className="px-1.5 py-0.5">
                            <span>
                              {activity.elevationGain}{" "}
                              <span className="text-black dark:text-white/60">
                                m
                              </span>
                            </span>
                          </div>
                          {activity.averageHeartrate && (
                            <div className="px-1.5 py-0.5">
                              <span>
                                {Math.round(activity.averageHeartrate)}{" "}
                                <span className="text-black dark:text-white/60">
                                  bpm
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Separate Cards */}
      <div className="hidden md:grid md:grid-cols-3 items-stretch gap-4 md:gap-5">
        {/* Stats card */}
        <div
          className="overflow-hidden rounded-md border border-white/10 dark:border-black/10 shadow-sm md:col-span-1 transition-all duration-300 hover:shadow-md md:h-full"
          style={{ background: "var(--color-background)" }}
        >
          {" "}
          <div className="p-2 md:p-3">
            {statsLoading ? (
              <>
                <div className="font-light text-sm text-black dark:text-white border-b border-white/10 dark:border-black/10 pb-1 mb-4">
                  Run Stats
                </div>
                <div className="space-y-3 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-white dark:bg-black/90 animate-pulse"></div>
                    <div className="h-3 w-24 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-white dark:bg-black/90 animate-pulse"></div>
                    <div className="h-3 w-24 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-white dark:bg-black/90 animate-pulse"></div>
                    <div className="h-3 w-24 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                  </div>
                </div>
              </>
            ) : statsError ? (
              <p className="text-sm text-black/70 dark:text-white/70 font-light">
                Unable to load stats
              </p>
            ) : (
              stats && (
                <>
                  <h3 className="font-light text-sm text-black dark:text-white border-b border-white/10 dark:border-black/10 pb-1 mb-4">
                    Run Stats
                  </h3>

                  <div className="grid grid-cols-1 gap-1.5 md:gap-3 text-xs font-light mt-1 md:mt-3">
                    <div
                      className="flex items-center gap-2 md:gap-3 group transition-all duration-200 ease-out hover:translate-x-0.5 rounded-md p-1 md:p-2.5 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20"
                      style={{ background: "var(--color-background)" }}
                    >
                      <div className="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 rounded-full bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center">
                        <Activity className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-black dark:text-white/70 text-[10px] uppercase tracking-wider">
                          Last 8 weeks
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-orange-500 dark:text-orange-400 text-sm font-medium">
                            {stats.recentRuns.distance.toFixed(1)}
                          </span>
                          <span className="text-black dark:text-white/70">
                            km
                          </span>
                          <span className="text-black dark:text-white/60 ml-1 text-[10px]">
                            ({stats.recentRuns.count} runs)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 md:gap-3 group transition-all duration-200 hover:translate-x-1 rounded-md p-1 md:p-2.5 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20"
                      style={{ background: "var(--color-background)" }}
                    >
                      <div className="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 rounded-full bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center">
                        <Calendar className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-black dark:text-white/70 text-[10px] uppercase tracking-wider">
                          2025 Year to Date
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-orange-500 dark:text-orange-400 text-sm font-medium">
                            {stats.ytdRuns.distance.toFixed(1)}
                          </span>
                          <span className="text-black dark:text-white/70">
                            km
                          </span>
                          <span className="text-black dark:text-white/60 ml-1 text-[10px]">
                            ({stats.ytdRuns.count} runs)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 md:gap-3 group transition-all duration-200 hover:translate-x-1 bg-white/90 dark:bg-black/60 rounded-md p-1 md:p-2.5"
                      style={{ background: "var(--color-background)" }}
                    >
                      <div className="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 rounded-full bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center">
                        <TrendingUp className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-black dark:text-white/70 text-[10px] uppercase tracking-wider">
                          All Time
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-orange-500 dark:text-orange-400 text-sm font-medium">
                            {stats.allTimeRuns.distance.toFixed(1)}
                          </span>
                          <span className="text-black dark:text-white/70">
                            km
                          </span>
                          <span className="text-black dark:text-white/60 ml-1 text-[10px]">
                            ({stats.allTimeRuns.count} runs)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>

        {/* Recent activities */}
        <div
          className="overflow-hidden rounded-md border border-white/10 dark:border-black/10 shadow-sm md:col-span-2 transition-all duration-300 hover:shadow-md md:h-full"
          style={{ background: "var(--color-background)" }}
        >
          {" "}
          <div className="p-2 md:p-3">
            {isLoading ? (
              <>
                <div className="flex items-center justify-between border-b border-white/10 dark:border-black/10 pb-1 mb-4">
                  <span className="font-light text-sm text-black dark:text-white">
                    Recent Activities
                  </span>
                  <span className="flex gap-1 ml-2">
                    <Waves className="h-4 w-4 text-orange-500" />
                    <Bike className="h-4 w-4 text-orange-500" />
                    <Activity className="h-4 w-4 text-orange-500" />
                    <Dumbbell className="h-4 w-4 text-orange-500" />
                  </span>
                </div>
                <div className="space-y-4 mt-3">
                  <div className="border-b border-white/10 dark:border-black/10 pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-4 w-32 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                      <div className="h-3 w-16 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="h-6 w-14 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                      <div className="h-6 w-14 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                      <div className="h-6 w-14 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                    </div>
                  </div>
                  <div className="border-b border-white/10 dark:border-black/10 pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-4 w-40 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                      <div className="h-3 w-16 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="h-6 w-14 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                      <div className="h-6 w-14 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                      <div className="h-6 w-14 bg-white dark:bg-black/90 animate-pulse rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </>
            ) : error ? (
              <p className="text-sm text-black/70 dark:text-white/70 font-light">
                Unable to load activities
              </p>
            ) : activities.length > 0 ? (
              <div className="divide-y divide-black/15 dark:divide-white/15">
                <div className="flex items-center justify-between border-b border-white/10 dark:border-black/10 pb-1 mb-4">
                  <span className="font-light text-sm text-black dark:text-white">
                    Recent Activities
                  </span>
                  <span className="flex gap-1 ml-2">
                    <Waves className="h-4 w-4 text-orange-500" />
                    <Bike className="h-4 w-4 text-orange-500" />
                    <Activity className="h-4 w-4 text-orange-500" />
                    <Dumbbell className="h-4 w-4 text-orange-500" />
                  </span>
                </div>

                {activities
                  .slice(0, isMobile ? 1 : activities.length)
                  .map((activity: ActivityData) => (
                    <div
                      key={activity.id}
                      className="py-2 md:py-4 px-1 hover:bg-white/95 dark:hover:bg-black/80 transition-all duration-200 group"
                      style={{ background: "var(--color-background)" }}
                    >
                      <div className="flex justify-between items-start mb-1 md:mb-2">
                        <div className="flex items-center gap-1.5">
                          {activity.type === "Run" && (
                            <Activity className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                          )}
                          {activity.type === "Ride" && (
                            <Bike className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                          )}
                          {activity.type === "Swim" && (
                            <Waves className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                          )}
                          {activity.type === "WeightTraining" && (
                            <Dumbbell className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                          )}
                          {!["Run", "Ride", "Swim", "WeightTraining"].includes(
                            activity.type
                          ) && (
                            <Activity className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                          )}
                          <h4 className="font-light text-xs md:text-sm text-black dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-200">
                            {activity.name}
                          </h4>
                        </div>
                        <span className="text-xs text-black dark:text-white/70 font-light px-1.5 py-0.5 rounded-sm">
                          {formatDate(activity.date)}
                        </span>
                      </div>

                      <div className="flex flex-wrap divide-x divide-black/15 dark:divide-white/15 text-[10px] md:text-xs font-light">
                        <div className="flex items-center text-black dark:text-white px-1.5 md:px-2 py-0.5 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20 transition-all duration-200">
                          <span className="font-light">
                            {activity.distance.toFixed(1)}{" "}
                            <span className="text-black dark:text-white/60">
                              km
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center text-black dark:text-white px-1.5 md:px-2 py-0.5 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20 transition-all duration-200">
                          <span>
                            {activity.movingTime}{" "}
                            <span className="text-black dark:text-white/60">
                              min
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center text-black dark:text-white px-1.5 md:px-2 py-0.5 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20 transition-all duration-200">
                          <span>
                            {activity.elevationGain}{" "}
                            <span className="text-black dark:text-white/60">
                              m
                            </span>
                          </span>
                        </div>

                        {activity.averageHeartrate && (
                          <div className="flex items-center text-black dark:text-white px-1.5 md:px-2 py-0.5 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20 transition-all duration-200">
                            <span>
                              {Math.round(activity.averageHeartrate)}{" "}
                              <span className="text-black dark:text-white/60">
                                bpm
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-black/70 dark:text-white/70 font-light">
                No recent activities found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
