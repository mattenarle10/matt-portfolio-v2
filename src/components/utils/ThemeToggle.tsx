"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/context"
import { MoonIcon, SunIcon } from "@/constants"

interface ThemeToggleProps {
  variant?: "default" | "mobile"
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = "default" }) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  if (variant === "mobile") {
    // Mobile version - same toggle switch with label
    return (
      <div className="flex items-center space-x-3">
        <span className="text-lg font-light text-white">
          {isDark ? "Light" : "Dark"} mode
        </span>
        <button
          onClick={toggleTheme}
          className="relative w-12 h-6 rounded-full border transition-colors duration-300 focus:outline-none ring-0"
          style={{
            borderColor: "rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
          aria-label="Toggle theme"
        >
          {/* Sliding circle with icon */}
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-sm flex items-center justify-center"
            style={{
              backgroundColor: "#ffffff",
            }}
            initial={false}
            animate={{
              x: isDark ? 24 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            {/* Icon inside the circle */}
            {isDark ? (
              <MoonIcon className="h-3 w-3 text-gray-800" />
            ) : (
              <SunIcon className="h-3 w-3 text-yellow-400" />
            )}
          </motion.div>
        </button>
      </div>
    )
  }

  // Desktop version - minimal animated toggle switch aligned with your design system
  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full border transition-colors duration-300 focus:outline-none ring-0"
      style={{
        borderColor: isDark
          ? "rgba(255, 255, 255, 0.25)"
          : "rgba(0, 0, 0, 0.25)",
        backgroundColor: isDark
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(0, 0, 0, 0.08)",
      }}
      aria-label="Toggle theme"
    >
      {/* Sliding circle with icon */}
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-sm flex items-center justify-center"
        style={{
          backgroundColor: isDark ? "#ffffff" : "#000000",
        }}
        initial={false}
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Icon inside the circle */}
        {isDark ? (
          <MoonIcon className="h-3 w-3 text-gray-800" />
        ) : (
          <SunIcon className="h-3 w-3 text-yellow-400" />
        )}
      </motion.div>
    </button>
  )
}

export default ThemeToggle
