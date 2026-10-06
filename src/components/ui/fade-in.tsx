"use client"

import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
} from "framer-motion"
import type React from "react"
import { useEffect, useRef } from "react"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  y?: number
  x?: number
  once?: boolean
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  y = 20,
  x = 0,
  once = true,
}) => {
  const controls = useAnimation()
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [isInView, controls, once])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
          y: reducedMotion ? 0 : y,
          x: reducedMotion ? 0 : x,
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            duration: reducedMotion ? 0 : duration,
            delay: reducedMotion ? 0 : delay,
            ease: [0.25, 0.1, 0.25, 1.0], // Custom easing for subtle, refined motion
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn
