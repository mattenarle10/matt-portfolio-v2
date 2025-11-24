"use client"

import { useEffect, useRef, useState } from "react"

export interface MediumPost {
  title: string
  url: string
  publishedAt: string
  excerpt: string | null
}

const MEDIUM_POSTS_CACHE_KEY = "medium_recent_posts"
const CACHE_EXPIRY = 1000 * 60 * 30

export function useMediumPosts(limit = 3) {
  const [posts, setPosts] = useState<MediumPost[]>(() => {
    if (typeof window === "undefined") return []

    try {
      const cached = localStorage.getItem(MEDIUM_POSTS_CACHE_KEY)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_EXPIRY && Array.isArray(data)) {
          return data as MediumPost[]
        }
      }
    } catch (error) {
      console.error("Error reading Medium posts cache:", error)
    }

    return []
  })

  const [isLoading, setIsLoading] = useState(!posts.length)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!posts.length) {
          setIsLoading(true)
        }
        setError(null)

        const response = await fetch("/api/medium")

        if (!response.ok) {
          throw new Error(`Failed to fetch Medium posts: ${response.status}`)
        }

        const data = (await response.json()) as MediumPost[]

        if (!Array.isArray(data)) {
          throw new Error("Medium posts response was not an array")
        }

        if (isMounted.current) {
          setPosts(data)

          try {
            localStorage.setItem(
              MEDIUM_POSTS_CACHE_KEY,
              JSON.stringify({
                data,
                timestamp: Date.now(),
              })
            )
          } catch (cacheError) {
            console.error("Error caching Medium posts:", cacheError)
          }
        }
      } catch (err) {
        console.error("Error fetching Medium posts:", err)
        if (isMounted.current) {
          setError("Could not load Medium posts")
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false)
        }
      }
    }

    fetchPosts()

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const limitedPosts = posts.slice(0, limit)

  return {
    posts: limitedPosts,
    isLoading,
    error,
  }
}
