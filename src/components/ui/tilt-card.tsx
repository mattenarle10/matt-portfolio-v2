"use client"

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import { type PointerEvent, type ReactNode, useEffect } from "react"

export function TiltCard({
  children,
  className = "",
  strength = 1.5,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const reducedMotion = useReducedMotion()
  const rotateX = useSpring(0, { stiffness: 180, damping: 24 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 24 })
  const lift = useSpring(0, { stiffness: 240, damping: 22 })
  const sheen = useSpring(0, { stiffness: 200, damping: 26 })
  const lightX = useMotionValue(50)
  const lightY = useMotionValue(50)
  const lightPosition = useMotionTemplate`${lightX}% ${lightY}%`

  function reset() {
    rotateX.set(0)
    rotateY.set(0)
    lift.set(0)
    sheen.set(0)
  }

  useEffect(() => {
    if (reducedMotion) {
      rotateX.jump(0)
      rotateY.jump(0)
      lift.jump(0)
      sheen.jump(0)
    }
  }, [reducedMotion, rotateX, rotateY, lift, sheen])

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return
    // Measure the stationary hit area, not the rotating surface.
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(
      -1,
      Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
    )
    const y = Math.max(
      -1,
      Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
    )
    rotateX.set(-y * strength)
    rotateY.set(x * strength)
    lift.set(-1.5)
    sheen.set(1)
    lightX.set(50 - x * 35)
    lightY.set(50 - y * 20)
  }

  return (
    <div
      className="tilt-stage"
      onPointerEnter={tilt}
      onPointerMove={tilt}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.div
        className={`tilt-card ${className}`}
        style={{ rotateX, rotateY, y: lift, transformStyle: "preserve-3d" }}
      >
        {children}
        <motion.div
          aria-hidden="true"
          className="tilt-sheen"
          style={{ opacity: sheen, backgroundPosition: lightPosition }}
        />
      </motion.div>
    </div>
  )
}
