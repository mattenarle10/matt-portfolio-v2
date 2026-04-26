"use client"

import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks"

const STORAGE_KEY = "mattagotchi_visible"
const TOGGLE_EVENT = "mattagotchi:toggle"

type Mode = "idle" | "wander" | "hop" | "perched" | "petting"
type Heart = { id: number; x: number; y: number }

const SAFE_PADDING = 48
const CHAT_RESERVED_W = 96
const FOOTER_RESERVED_H = 120

function pickWeighted<T>(choices: { value: T; weight: number }[]): T {
  const total = choices.reduce((sum, c) => sum + c.weight, 0)
  let r = Math.random() * total
  for (const c of choices) {
    r -= c.weight
    if (r <= 0) return c.value
  }
  return choices[0].value
}

function PetSprite({
  frame,
  facing,
}: {
  frame: 0 | 1
  facing: "left" | "right"
}) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
        transform: facing === "left" ? "scaleX(-1)" : undefined,
        display: "block",
      }}
      aria-hidden="true"
    >
      {/* body */}
      <rect x="3" y="4" width="6" height="5" fill="currentColor" />
      <rect x="2" y="5" width="1" height="3" fill="currentColor" />
      <rect x="9" y="5" width="1" height="3" fill="currentColor" />
      {/* ears */}
      <rect x="3" y="3" width="1" height="1" fill="currentColor" />
      <rect x="8" y="3" width="1" height="1" fill="currentColor" />
      {/* eyes */}
      <rect x="4" y="6" width="1" height="1" fill="#fff" />
      <rect x="7" y="6" width="1" height="1" fill="#fff" />
      {/* legs (frame swap) */}
      {frame === 0 ? (
        <>
          <rect x="4" y="9" width="1" height="1" fill="currentColor" />
          <rect x="7" y="9" width="1" height="1" fill="currentColor" />
        </>
      ) : (
        <>
          <rect x="3" y="9" width="1" height="1" fill="currentColor" />
          <rect x="8" y="9" width="1" height="1" fill="currentColor" />
        </>
      )}
      {/* tail */}
      <rect x="9" y="6" width="1" height="1" fill="currentColor" />
    </svg>
  )
}

const HEART_PATH = "M6 11 L1 6 A2.5 2.5 0 0 1 6 3 A2.5 2.5 0 0 1 11 6 Z"

function HeartParticle({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 1, x, y, scale: 0.6 }}
      animate={{ opacity: 0, y: y - 28, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ position: "fixed", pointerEvents: "none", zIndex: 41 }}
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 12 12" fill="#ef4444">
        <path d={HEART_PATH} />
      </svg>
    </motion.div>
  )
}

export default function Pet() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [mode, setMode] = useState<Mode>("idle")
  const [facing, setFacing] = useState<"left" | "right">("right")
  const [frame, setFrame] = useState<0 | 1>(0)
  const [hearts, setHearts] = useState<Heart[]>([])

  const perchAnchorRef = useRef<HTMLElement | null>(null)
  const heartIdRef = useRef(0)
  const modeRef = useRef<Mode>("idle")
  modeRef.current = mode

  useEffect(() => {
    setMounted(true)
    if (typeof window === "undefined") return

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReducedMotion(mq.matches)
    onChange()
    mq.addEventListener("change", onChange)

    const readVisible = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === "1") setVisible(true)
        else if (stored === "0") setVisible(false)
        else setVisible(window.innerWidth >= 768)
      } catch {
        setVisible(window.innerWidth >= 768)
      }
    }
    readVisible()

    const onToggle = () => readVisible()
    window.addEventListener(TOGGLE_EVENT, onToggle)

    // initial position: bottom-left
    x.set(SAFE_PADDING)
    y.set(window.innerHeight - FOOTER_RESERVED_H)

    return () => {
      mq.removeEventListener("change", onChange)
      window.removeEventListener(TOGGLE_EVENT, onToggle)
    }
  }, [x, y])

  // Walk frame cycler
  useEffect(() => {
    if (!visible || reducedMotion) return
    const id = window.setInterval(() => {
      if (modeRef.current === "wander" || modeRef.current === "hop") {
        setFrame((f) => (f === 0 ? 1 : 0))
      } else {
        setFrame(0)
      }
    }, 220)
    return () => window.clearInterval(id)
  }, [visible, reducedMotion])

  // Behavior loop
  useEffect(() => {
    if (!visible || reducedMotion || isMobile) return
    let cancelled = false
    let timeoutId: number | undefined

    const safeBounds = () => ({
      minX: SAFE_PADDING,
      maxX: window.innerWidth - SAFE_PADDING - CHAT_RESERVED_W,
      minY: 80,
      maxY: window.innerHeight - FOOTER_RESERVED_H,
    })

    const moveTo = async (tx: number, ty: number) => {
      const dx = tx - x.get()
      setFacing(dx >= 0 ? "right" : "left")
      const distance = Math.hypot(tx - x.get(), ty - y.get())
      const duration = Math.max(0.5, Math.min(2.5, distance / 280))
      await Promise.all([
        animate(x, tx, { duration, ease: "easeInOut" }).finished,
        animate(y, ty, { duration, ease: "easeInOut" }).finished,
      ])
    }

    const doWander = async () => {
      const b = safeBounds()
      const tx = b.minX + Math.random() * (b.maxX - b.minX)
      const ty = b.minY + Math.random() * (b.maxY - b.minY)
      setMode("wander")
      await moveTo(tx, ty)
      if (!cancelled) setMode("idle")
    }

    const doHop = async () => {
      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>("[data-pet-anchor]")
      ).filter((el) => {
        const r = el.getBoundingClientRect()
        return r.top > 60 && r.bottom < window.innerHeight - 60 && r.width > 80
      })
      if (anchors.length === 0) {
        await doWander()
        return
      }
      const anchor = anchors[Math.floor(Math.random() * anchors.length)]
      const r = anchor.getBoundingClientRect()
      const tx = r.left + r.width / 2 - 20
      const ty = r.top - 36
      setMode("hop")
      await moveTo(tx, ty)
      if (cancelled) return
      perchAnchorRef.current = anchor
      setMode("perched")
    }

    const tick = async () => {
      if (cancelled) return
      const choice = pickWeighted<"wander" | "hop" | "idle">([
        { value: "wander", weight: 50 },
        { value: "hop", weight: 30 },
        { value: "idle", weight: 20 },
      ])
      if (choice === "wander") await doWander()
      else if (choice === "hop") await doHop()
      else setMode("idle")

      if (cancelled) return
      const wait =
        modeRef.current === "perched"
          ? 4000 + Math.random() * 6000
          : 3000 + Math.random() * 4000
      timeoutId = window.setTimeout(tick, wait)
    }

    timeoutId = window.setTimeout(tick, 1500)

    return () => {
      cancelled = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [visible, reducedMotion, isMobile, x, y])

  // Perch follow loop — pet sticks to anchor as page scrolls
  useEffect(() => {
    if (mode !== "perched" || !perchAnchorRef.current) return
    let raf = 0
    const follow = () => {
      const anchor = perchAnchorRef.current
      if (!anchor) return
      const r = anchor.getBoundingClientRect()
      const inView = r.bottom > 40 && r.top < window.innerHeight - 40
      if (!inView) {
        perchAnchorRef.current = null
        setMode("idle")
        return
      }
      x.set(r.left + r.width / 2 - 20)
      y.set(r.top - 36)
      raf = window.requestAnimationFrame(follow)
    }
    raf = window.requestAnimationFrame(follow)
    return () => window.cancelAnimationFrame(raf)
  }, [mode, x, y])

  // Resize clamp
  useEffect(() => {
    if (!visible) return
    const onResize = () => {
      const maxX = window.innerWidth - SAFE_PADDING - CHAT_RESERVED_W
      const maxY = window.innerHeight - FOOTER_RESERVED_H
      if (x.get() > maxX) x.set(maxX)
      if (y.get() > maxY) y.set(maxY)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [visible, x, y])

  const handlePet = () => {
    const px = x.get() + 20
    const py = y.get() + 10
    const count = 1 + Math.floor(Math.random() * 3)
    const newHearts: Heart[] = []
    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: heartIdRef.current++,
        x: px - 8 + Math.random() * 16,
        y: py - 4 + (Math.random() - 0.5) * 8,
      })
    }
    setHearts((prev) => [...prev, ...newHearts])
    setMode("petting")
    window.setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.some((nh) => nh.id === h.id))
      )
      if (modeRef.current === "petting") setMode("idle")
    }, 800)
  }

  if (!mounted || !visible) return null

  const idleScale = reducedMotion
    ? { scale: 1 }
    : {
        scale: [1, 1.05, 1],
        transition: {
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      }

  return (
    <>
      <motion.button
        type="button"
        onClick={handlePet}
        aria-label="Pet the pixel pet"
        className="fixed text-black dark:text-white outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-sm"
        style={{
          x,
          y,
          zIndex: 40,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
        animate={mode === "idle" ? idleScale : undefined}
      >
        <PetSprite frame={frame} facing={facing} />
      </motion.button>

      <AnimatePresence>
        {hearts.map((h) => (
          <HeartParticle key={h.id} x={h.x} y={h.y} />
        ))}
      </AnimatePresence>
    </>
  )
}
