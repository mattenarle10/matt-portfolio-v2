"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Theme values aligned with your preferred sleek, modern aesthetic
const lightTheme = {
  nav: {
    bubble: "rgba(240, 242, 245, 0.8)", // Subtle light gray
    text: "#18181b",
    activeText: "#2563eb", // Blue accent for active states
  },
  background: "#ffffff",
  text: "#18181b",
  accent: "#2563eb", // Blue accent color
}

// Dark theme with subtle, refined colors
const darkTheme = {
  nav: {
    bubble: "rgba(30, 41, 59, 0.8)", // Subtle dark blue
    text: "#f1f5f9",
    activeText: "#3b82f6",
  },
  background: "#0a0a0a", // Matching your dark:bg-[#0a0a0a] preference
  text: "#f1f5f9",
  accent: "#3b82f6",
}

type ThemeMode = "light" | "dark"

interface ThemeContextType {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
})

export const ThemeProvider: React.FC<{
  children: React.ReactNode
  initialTheme?: ThemeMode
}> = ({ children, initialTheme = "dark" }) => {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme)

  // Sync document class and persistence whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    try {
      localStorage.setItem("theme", theme)
    } catch {}
    try {
      if (window.cookieStore?.set) {
        void window.cookieStore.set("theme", theme).catch(() => {})
      } else {
        /* biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not available in all browsers, so we fall back to a standard cookie write for theme persistence. */
        document.cookie = `theme=${theme}; path=/; max-age=31536000; samesite=lax`
      }
    } catch {}
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
