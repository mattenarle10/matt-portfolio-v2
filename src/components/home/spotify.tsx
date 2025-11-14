"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import type { SpotifyTrack } from "@/app/api/spotify/useSpotify"
import { useSpotify } from "@/app/api/spotify/useSpotify"
import { useGlobalState } from "@/components/context/GlobalStateContext"
import FadeIn from "../utils/FadeIn"
import { SpotifyEmbed } from "../utils/spotify-embed"

const SpotifyRecentlyPlayed = () => {
  // Get global state
  const globalState = useGlobalState()

  // Initialize local state
  const [localRecentTracks, setLocalRecentTracks] = useState<SpotifyTrack[]>([])
  const [localTopTracks, setLocalTopTracks] = useState<SpotifyTrack[]>([])
  const [localIsLoading, setLocalIsLoading] = useState(true)
  const [localError, setLocalError] = useState<string | null>(null)

  // Initialize from global state if available
  useEffect(() => {
    if (globalState.spotifyLoaded) {
      setLocalRecentTracks(globalState.recentTracks)
      setLocalTopTracks(globalState.topTracks)
      setLocalIsLoading(false)
    }
  }, [
    globalState.spotifyLoaded,
    globalState.recentTracks,
    globalState.topTracks,
  ])

  // Always fetch from API to ensure we have data
  const {
    recentTracks: apiRecentTracks,
    topTracks: apiTopTracks,
    error: apiError,
  } = useSpotify()

  // Update local state when API data changes
  useEffect(() => {
    // Update local state whenever we get new API data
    if (apiRecentTracks.length > 0) {
      setLocalRecentTracks(apiRecentTracks)
      setLocalIsLoading(false)
    }

    if (apiTopTracks.length > 0) {
      setLocalTopTracks(apiTopTracks)
      setLocalIsLoading(false)
    }

    // Save to global state if we have both types of data
    if (apiRecentTracks.length > 0 && apiTopTracks.length > 0) {
      globalState.setSpotifyData(apiRecentTracks, apiTopTracks)
    }

    if (apiError) {
      setLocalError(apiError)
    }
  }, [apiRecentTracks, apiTopTracks, apiError, globalState])

  // Use local state for component rendering
  const recentTracks = localRecentTracks
  const topTracks = localTopTracks
  const isLoading = localIsLoading
  const error = localError

  const [activeList, setActiveList] = useState<"recent" | "top">("recent")
  const [displayTrack, setDisplayTrack] = useState<SpotifyTrack | null>(null)
  const [tracksList, setTracksList] = useState<SpotifyTrack[]>([])
  const tracksRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Effect to detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Effect to update displayed tracks when switching between recent and top
  useEffect(() => {
    // Force a re-render when switching between lists
    if (activeList === "top" && topTracks && topTracks.length > 0) {
      // Clear current tracks first to ensure UI updates
      setDisplayTrack(null)
      setTracksList([])

      // Small timeout to ensure state update and animation
      setTimeout(() => {
        setDisplayTrack(topTracks[0])
        const trackCount = isMobile ? 3 : 5 // 2 tracks on mobile, 4 on desktop
        setTracksList(topTracks.slice(1, trackCount))
      }, 50)
    } else if (recentTracks && recentTracks.length > 0) {
      // Clear current tracks first to ensure UI updates
      setDisplayTrack(null)
      setTracksList([])

      // Small timeout to ensure state update and animation
      setTimeout(() => {
        setDisplayTrack(recentTracks[0])
        const trackCount = isMobile ? 3 : 5 // 2 tracks on mobile, 4 on desktop
        setTracksList(recentTracks.slice(1, trackCount))
      }, 50)
    }
  }, [activeList, recentTracks, topTracks, isMobile])

  const handleTabClick = (tab: "recent" | "top") => {
    if (activeList !== tab) {
      setActiveList(tab)
    }
    // Simple scroll if needed on mobile
    if (window.innerWidth < 768 && tracksRef.current) {
      tracksRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }

  return (
    <section className="mt-12">
      {/* Improved header with better tab spacing */}
      <div className="mb-4 flex flex-col">
        <div className="flex justify-between items-center pb-1">
          <h2 className="text-base font-normal">
            {activeList === "top" ? "Top Tracks" : "Recently Played"}
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabClick("recent")}
              className="text-xs py-0.5 px-1 transition-all relative"
            >
              <span className={activeList === "recent" ? "" : "text-gray-400"}>
                Recent
              </span>
              {activeList === "recent" && (
                <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => handleTabClick("top")}
              className="text-xs py-0.5 px-1 transition-all relative ml-2"
            >
              <span className={activeList === "top" ? "" : "text-gray-400"}>
                Top
              </span>
              {activeList === "top" && (
                <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State - Minimal */}
      {isLoading && (
        <div className="flex justify-start py-2">
          <div className="animate-pulse flex space-x-3 w-full">
            <div className="rounded bg-gray-100 h-12 w-12"></div>
            <div className="flex-1 space-y-1.5 py-1">
              <div className="h-1.5 bg-gray-100 rounded w-3/4"></div>
              <div className="h-1.5 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Main Content */}
      {!isLoading && !error && (
        <div className="flex flex-col md:flex-row md:gap-6 space-y-0">
          {/* Featured Track Card - Left Side */}
          {displayTrack && (
            <div className="w-full md:w-2/5 mb-0 md:mb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayTrack.externalUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col h-full">
                    <SpotifyEmbed
                      link={displayTrack.externalUrl}
                      width="100%"
                      height={isMobile ? "172" : "352"}
                      className="w-full rounded-md overflow-hidden mb-0"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Track List - Right Side */}
          <div ref={tracksRef} className="w-full md:w-3/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeList}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                <div className="grid grid-cols-1 gap-3 pt-0 md:pt-1">
                  {isMobile && tracksList.length > 0 && (
                    <div className="text-xs text-gray-500 font-light mb-1 mt-0">
                      More tracks
                    </div>
                  )}
                  {tracksList.map((track, index) => (
                    <FadeIn key={`${track.id}-${index}`} delay={0.03 * index}>
                      <SpotifyEmbed
                        link={track.externalUrl}
                        width="100%"
                        height="80"
                        className="w-full rounded-md overflow-hidden"
                      />
                    </FadeIn>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State - Minimal */}
      {!isLoading && !displayTrack && !error && (
        <div className="text-left py-6">
          <p className="text-gray-400 text-xs font-light">No tracks found</p>
        </div>
      )}
    </section>
  )
}

export default SpotifyRecentlyPlayed
