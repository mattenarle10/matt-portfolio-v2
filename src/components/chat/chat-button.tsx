"use client"

import { motion } from "framer-motion"
import { MessageCircle, X } from "lucide-react"

interface ChatButtonProps {
  isOpen: boolean
  onClick: () => void
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="chat-launcher fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center"
      aria-label={isOpen ? "Close chat" : "Open chat"}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X size={21} aria-hidden="true" />
      ) : (
        <MessageCircle size={21} aria-hidden="true" />
      )}
    </motion.button>
  )
}
