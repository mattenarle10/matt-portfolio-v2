"use client"

import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks"

const STORAGE_KEY = "mattagotchi_visible"
const TOGGLE_EVENT = "mattagotchi:toggle"

type Mode = "idle" | "wander" | "hop" | "perched"
type Reaction = null | "petting" | "burst" | "alerted"
type Heart = { id: number; x: number; y: number }
type Bubble = { id: number; text: string }

const SAFE_PADDING = 48
const CHAT_RESERVED_W = 96
const FOOTER_RESERVED_H = 120
const PET_W = 44
const PROXIMITY_PX = 100

const PINK = "#f8a5b4"
const PINK_DARK = "#e87295"

const QUIPS = [
  "hi!",
  "*yawn*",
  "boop?",
  "hewwo",
  "(=^･ω･^=)",
  "matt's coding",
  "any treats?",
  "zzz",
  "*purr*",
  "good vibes",
]

function pickWeighted<T>(choices: { value: T; weight: number }[]): T {
  const total = choices.reduce((sum, c) => sum + c.weight, 0)
  let r = Math.random() * total
  for (const c of choices) {
    r -= c.weight
    if (r <= 0) return c.value
  }
  return choices[0].value
}

type EyeState = "open" | "closed" | "heart"

function PetSprite({
  frame,
  facing,
  eyeState,
}: {
  frame: 0 | 1
  facing: "left" | "right"
  eyeState: EyeState
}) {
  return (
    <svg
      width={PET_W}
      height={PET_W}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
        transform: facing === "left" ? "scaleX(-1)" : undefined,
        display: "block",
        filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.25))",
      }}
      aria-hidden="true"
    >
      {/* Tail (drawn first so head/body cover its base) */}
      <rect x="13" y="7" width="1" height="3" fill="currentColor" />
      <rect x="14" y="6" width="1" height="2" fill="currentColor" />

      {/* Ears */}
      <rect x="3" y="1" width="2" height="1" fill="currentColor" />
      <rect x="2" y="2" width="3" height="1" fill="currentColor" />
      <rect x="11" y="1" width="2" height="1" fill="currentColor" />
      <rect x="11" y="2" width="3" height="1" fill="currentColor" />

      {/* Head (10x6) */}
      <rect x="3" y="3" width="10" height="5" fill="currentColor" />
      <rect x="2" y="4" width="1" height="3" fill="currentColor" />
      <rect x="13" y="4" width="1" height="3" fill="currentColor" />

      {/* Inner ear (pink hint) */}
      <rect x="3" y="2" width="1" height="1" fill={PINK} />
      <rect x="12" y="2" width="1" height="1" fill={PINK} />

      {/* Cheek blush */}
      <rect x="3" y="6" width="1" height="1" fill={PINK} opacity="0.5" />
      <rect x="12" y="6" width="1" height="1" fill={PINK} opacity="0.5" />

      {/* Eyes */}
      {eyeState === "open" && (
        <>
          <rect x="5" y="4" width="2" height="2" fill="#fff" />
          <rect x="9" y="4" width="2" height="2" fill="#fff" />
          <rect x="6" y="5" width="1" height="1" fill="#000" />
          <rect x="10" y="5" width="1" height="1" fill="#000" />
        </>
      )}
      {eyeState === "closed" && (
        <>
          <rect x="5" y="5" width="2" height="1" fill={PINK_DARK} />
          <rect x="9" y="5" width="2" height="1" fill={PINK_DARK} />
        </>
      )}
      {eyeState === "heart" && (
        <>
          {/* left heart */}
          <rect x="5" y="4" width="1" height="1" fill={PINK_DARK} />
          <rect x="6" y="5" width="1" height="1" fill={PINK_DARK} />
          <rect x="7" y="4" width="1" height="1" fill={PINK_DARK} />
          <rect x="5" y="5" width="3" height="1" fill={PINK_DARK} />
          {/* right heart */}
          <rect x="9" y="4" width="1" height="1" fill={PINK_DARK} />
          <rect x="10" y="5" width="1" height="1" fill={PINK_DARK} />
          <rect x="11" y="4" width="1" height="1" fill={PINK_DARK} />
          <rect x="9" y="5" width="3" height="1" fill={PINK_DARK} />
        </>
      )}

      {/* Nose */}
      <rect x="7" y="6" width="2" height="1" fill={PINK} />

      {/* Body */}
      <rect x="3" y="8" width="10" height="4" fill="currentColor" />
      <rect x="4" y="12" width="8" height="1" fill="currentColor" />

      {/* Belly highlight */}
      <rect
        x="6"
        y="10"
        width="4"
        height="1"
        fill="currentColor"
        opacity="0.7"
      />

      {/* Legs (walk cycle) */}
      {frame === 0 ? (
        <>
          <rect x="4" y="13" width="2" height="1" fill="currentColor" />
          <rect x="10" y="13" width="2" height="1" fill="currentColor" />
        </>
      ) : (
        <>
          <rect x="3" y="13" width="2" height="1" fill="currentColor" />
          <rect x="11" y="13" width="2" height="1" fill="currentColor" />
        </>
      )}
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

function SpeechBubble({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: y + 4, scale: 0.85 }}
      animate={{ opacity: 1, y, scale: 1 }}
      exit={{ opacity: 0, y: y - 4, scale: 0.85 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        position: "fixed",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 41,
      }}
    >
      <div className="px-2 py-0.5 text-[10px] font-mono whitespace-nowrap rounded-sm bg-white dark:bg-neutral-900 text-black dark:text-white border border-black/10 dark:border-white/15 shadow-sm">
        {text}
      </div>
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
  const [reaction, setReaction] = useState<Reaction>(null)
  const [facing, setFacing] = useState<"left" | "right">("right")
  const [frame, setFrame] = useState<0 | 1>(0)
  const [hearts, setHearts] = useState<Heart[]>([])
  const [bubble, setBubble] = useState<Bubble | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [blink, setBlink] = useState(false)

  const perchAnchorRef = useRef<HTMLElement | null>(null)
  const heartIdRef = useRef(0)
  const bubbleIdRef = useRef(0)
  const modeRef = useRef<Mode>("idle")
  const draggingRef = useRef(false)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  modeRef.current = mode
  draggingRef.current = isDragging

  useEffect(() => {
    setMounted(true)
    if (typeof window === "undefined") return

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onMqChange = () => setReducedMotion(mq.matches)
    onMqChange()
    mq.addEventListener("change", onMqChange)

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

    x.set(SAFE_PADDING)
    y.set(window.innerHeight - FOOTER_RESERVED_H)

    return () => {
      mq.removeEventListener("change", onMqChange)
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

  // Random blink during idle/perched
  useEffect(() => {
    if (!visible || reducedMotion) return
    let timer: number | undefined
    const scheduleBlink = () => {
      const wait = 3000 + Math.random() * 5000
      timer = window.setTimeout(() => {
        if (modeRef.current === "idle" || modeRef.current === "perched") {
          setBlink(true)
          window.setTimeout(() => setBlink(false), 140)
        }
        scheduleBlink()
      }, wait)
    }
    scheduleBlink()
    return () => {
      if (timer) window.clearTimeout(timer)
    }
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

    const maybeQuip = () => {
      if (Math.random() > 0.35) return
      const text = QUIPS[Math.floor(Math.random() * QUIPS.length)]
      const id = bubbleIdRef.current++
      setBubble({ id, text })
      window.setTimeout(() => {
        setBubble((prev) => (prev?.id === id ? null : prev))
      }, 1800)
    }

    const tick = async () => {
      if (cancelled) return
      if (draggingRef.current) {
        timeoutId = window.setTimeout(tick, 1000)
        return
      }
      const choice = pickWeighted<"wander" | "hop" | "idle">([
        { value: "wander", weight: 50 },
        { value: "hop", weight: 30 },
        { value: "idle", weight: 20 },
      ])
      if (choice === "wander") await doWander()
      else if (choice === "hop") await doHop()
      else {
        setMode("idle")
        maybeQuip()
      }

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

  // Perch follow loop
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

  // Mouse proximity tracking — pet "perks up" and faces cursor when near
  useEffect(() => {
    if (!visible || reducedMotion) return
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      const px = x.get() + PET_W / 2
      const py = y.get() + PET_W / 2
      const dist = Math.hypot(e.clientX - px, e.clientY - py)
      if (dist < PROXIMITY_PX) {
        setReaction((prev) => (prev === null ? "alerted" : prev))
        if (modeRef.current === "idle" || modeRef.current === "perched") {
          setFacing(e.clientX < px ? "left" : "right")
        }
      } else {
        setReaction((prev) => (prev === "alerted" ? null : prev))
      }
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [visible, reducedMotion, x, y])

  const spawnHearts = (count: number, origin: { x: number; y: number }) => {
    const newHearts: Heart[] = []
    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: heartIdRef.current++,
        x: origin.x - 8 + Math.random() * 16,
        y: origin.y - 4 + (Math.random() - 0.5) * 8,
      })
    }
    setHearts((prev) => [...prev, ...newHearts])
    window.setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.some((nh) => nh.id === h.id))
      )
    }, 800)
  }

  const handlePet = () => {
    const origin = { x: x.get() + 20, y: y.get() + 10 }
    spawnHearts(1 + Math.floor(Math.random() * 3), origin)
    setReaction("petting")
    window.setTimeout(() => {
      setReaction((prev) => (prev === "petting" ? null : prev))
    }, 700)
  }

  const handleBurst = () => {
    const origin = { x: x.get() + 20, y: y.get() + 10 }
    spawnHearts(6 + Math.floor(Math.random() * 4), origin)
    setReaction("burst")
    const id = bubbleIdRef.current++
    setBubble({ id, text: "*spin*" })
    window.setTimeout(() => {
      setBubble((prev) => (prev?.id === id ? null : prev))
      setReaction((prev) => (prev === "burst" ? null : prev))
    }, 1000)
  }

  // Keyboard "p" → pet
  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "p" && e.key !== "P") return
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }
      handlePet()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  if (!mounted || !visible) return null

  const idleScale = reducedMotion
    ? { scale: 1 }
    : reaction === "alerted"
      ? { scale: 1.15 }
      : reaction === "burst"
        ? { rotate: 360, scale: 1.2 }
        : reaction === "petting"
          ? { scale: 1.2 }
          : {
              scale: [1, 1.05, 1],
              transition: {
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
            }

  const showBubble = bubble && !isDragging

  const eyeState: EyeState =
    reaction === "burst"
      ? "heart"
      : reaction === "petting" || blink
        ? "closed"
        : "open"

  return (
    <>
      <motion.button
        type="button"
        onClick={handlePet}
        onDoubleClick={handleBurst}
        aria-label="Pet the pixel pet (press P)"
        className="fixed text-black dark:text-white outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-sm"
        style={{
          x,
          y,
          zIndex: 40,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        animate={
          mode === "idle" || mode === "perched" || reaction !== null
            ? idleScale
            : undefined
        }
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => {
          setIsDragging(true)
          setReaction(null)
          if (mode === "perched") {
            perchAnchorRef.current = null
            setMode("idle")
          }
        }}
        onDragEnd={() => {
          setIsDragging(false)
          const maxX = window.innerWidth - SAFE_PADDING
          const maxY = window.innerHeight - FOOTER_RESERVED_H
          if (x.get() < 0) x.set(0)
          if (x.get() > maxX) x.set(maxX)
          if (y.get() < 0) y.set(0)
          if (y.get() > maxY) y.set(maxY)
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <PetSprite frame={frame} facing={facing} eyeState={eyeState} />
      </motion.button>

      <AnimatePresence>
        {hearts.map((h) => (
          <HeartParticle key={h.id} x={h.x} y={h.y} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showBubble && (
          <SpeechBubble
            key={bubble.id}
            x={x.get() + PET_W / 2 - 20}
            y={y.get() - 18}
            text={bubble.text}
          />
        )}
      </AnimatePresence>
    </>
  )
}
