"use client"

import { motion } from "framer-motion"
import { MessageCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

interface ChatButtonProps {
  isOpen: boolean
  onClick: () => void
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 shadow-lg flex items-center justify-center transition-colors"
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      <motion.div
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? (
          <X
            className="w-6 h-6"
            style={{
              color: isDark ? "black" : "white",
              stroke: isDark ? "black" : "white",
            }}
          />
        ) : (
          <MessageCircle
            className="w-6 h-6"
            style={{
              color: isDark ? "black" : "white",
              stroke: isDark ? "black" : "white",
            }}
          />
        )}
      </motion.div>
    </motion.button>
  )
}
