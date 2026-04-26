"use client"

import { PawPrint } from "lucide-react"
import { useEffect, useState } from "react"

const STORAGE_KEY = "mattagotchi_visible"
const TOGGLE_EVENT = "mattagotchi:toggle"

export default function PetToggle() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === "1") setVisible(true)
      else if (stored === "0") setVisible(false)
      else setVisible(window.innerWidth >= 768)
    } catch {
      setVisible(window.innerWidth >= 768)
    }
  }, [])

  if (!mounted) return null

  const handleToggle = () => {
    const next = !visible
    setVisible(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    } catch {
      // ignore storage failures
    }
    window.dispatchEvent(new Event(TOGGLE_EVENT))
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={visible ? "Hide pixel pet" : "Show pixel pet"}
      aria-pressed={visible}
      title={visible ? "Hide pet" : "Show pet"}
      className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-sm ${
        visible ? "opacity-100" : "opacity-50"
      }`}
    >
      <PawPrint className="w-5 h-5" />
    </button>
  )
}
