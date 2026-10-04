"use client"

import { useEffect, useState } from "react"

export interface MediumPost {
  title: string
  url: string
  publishedAt: string
  excerpt: string | null
  imageUrl: string | null
  source?: "medium" | "builder-center"
}

const MEDIUM_POSTS_CACHE_KEY = "medium_recent_posts"
const CACHE_EXPIRY = 1000 * 60 * 30
const POST_SOURCES = [
  { endpoint: "/api/medium", source: "medium" },
  { endpoint: "/api/builder-center", source: "builder-center" },
] as const

async function fetchPosts(
  endpoint: string,
  source: MediumPost["source"],
  signal: AbortSignal
): Promise<MediumPost[]> {
  const response = await fetch(endpoint, { signal })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${source} posts: ${response.status}`)
  }

  const data = (await response.json()) as MediumPost[]

  if (!Array.isArray(data)) {
    throw new Error(`${source} posts response was not an array`)
  }

  return data.map((post) => ({ ...post, source }))
}

export function useMediumPosts(limit?: number) {
  const [posts, setPosts] = useState<MediumPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadFromCacheAndFetch = async () => {
      try {
        setError(null)

        if (typeof window !== "undefined") {
          try {
            const cached = localStorage.getItem(MEDIUM_POSTS_CACHE_KEY)
            if (cached) {
              const { data, timestamp } = JSON.parse(cached)
              if (
                Date.now() - timestamp < CACHE_EXPIRY &&
                Array.isArray(data) &&
                !controller.signal.aborted
              ) {
                setPosts(data as MediumPost[])
                setIsLoading(false)
              }
            }
          } catch (cacheError) {
            console.error("Error reading Medium posts cache:", cacheError)
          }
        }

        const results = await Promise.allSettled(
          POST_SOURCES.map(({ endpoint, source }) =>
            fetchPosts(endpoint, source, controller.signal)
          )
        )

        if (controller.signal.aborted) return

        const failed = results.filter((result) => result.status === "rejected")
        for (const result of failed) {
          console.error("Error fetching posts:", result.reason)
        }
        if (failed.length === results.length) {
          throw new Error("Failed to fetch posts from every source")
        }

        const data = results
          .flatMap((result) =>
            result.status === "fulfilled" ? result.value : []
          )
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          )

        setPosts(data)

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              MEDIUM_POSTS_CACHE_KEY,
              JSON.stringify({ data, timestamp: Date.now() })
            )
          } catch (cacheError) {
            console.error("Error caching Medium posts:", cacheError)
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return
        console.error("Error fetching Medium posts:", err)
        setError("Could not load Medium posts")
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadFromCacheAndFetch()

    return () => {
      controller.abort()
    }
  }, [])

  const limitedPosts = typeof limit === "number" ? posts.slice(0, limit) : posts

  return {
    posts: limitedPosts,
    total: posts.length,
    isLoading,
    error,
  }
}
