"use client"

import { useEffect } from "react"

export function ViewportObserver() {
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const root = document.documentElement
    let frame = 0

    function measure() {
      // Let the browser handle pinch zoom without moving the overlays around it.
      if (!viewport || Math.abs(viewport.scale - 1) > 0.01) return
      root.style.setProperty(
        "--overlay-viewport-height",
        `${viewport.height}px`
      )
      root.style.setProperty(
        "--overlay-viewport-top",
        `${viewport.offsetTop}px`
      )
    }

    function schedule() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    measure()
    viewport.addEventListener("resize", schedule, { passive: true })
    viewport.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener("resize", schedule)
      viewport.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      root.style.removeProperty("--overlay-viewport-height")
      root.style.removeProperty("--overlay-viewport-top")
    }
  }, [])

  return null
}
