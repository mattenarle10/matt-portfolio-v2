"use client"

import { motion } from "framer-motion"
import { MoonIcon, SunIcon } from "@/constants"
import { useTheme } from "@/context"

interface ThemeToggleProps {
  variant?: "default" | "mobile"
}

export default function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"
  const control = (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-switch"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="theme-switch-track" aria-hidden="true">
        <motion.span
          className="theme-switch-knob"
          initial={false}
          animate={{ x: isDark ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isDark ? (
            <MoonIcon className="h-3 w-3" />
          ) : (
            <SunIcon className="h-3 w-3" />
          )}
        </motion.span>
      </span>
    </button>
  )
  return variant === "mobile" ? (
    <div className="flex items-center gap-3">
      <span className="text-base">{isDark ? "Light" : "Dark"} mode</span>
      {control}
    </div>
  ) : (
    control
  )
}
