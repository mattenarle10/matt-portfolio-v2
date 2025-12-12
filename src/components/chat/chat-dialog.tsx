"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { Message } from "@/schemas"
import { ChatInput } from "./chat-input"
import { ChatMessageList } from "./chat-message-list"

interface ChatDialogProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  suggestedPrompts?: string[]
}

export function ChatDialog({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
  suggestedPrompts,
}: ChatDialogProps) {
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="chat-panel fixed bottom-4 right-4 md:bottom-24 md:right-6 w-full max-w-[calc(100vw-2rem)] md:w-[400px] h-[500px] md:h-[600px] max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-8rem)] rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border"
        >
          {/* Header */}
          <div className="chat-header flex items-center justify-between p-3 md:p-4 border-b flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden relative flex-shrink-0">
                <Image
                  src="/about/matt-viet.png"
                  alt="Matt Enarle"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="chat-header-title font-medium text-xs md:text-sm">
                  Matt Enarle
                </h2>
                <p className="chat-header-status text-[10px] md:text-xs">
                  Online
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="chat-header-button w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg chat-close-button flex-shrink-0"
              aria-label="Close chat"
            >
              <X className="chat-close-icon w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Messages */}
          <ChatMessageList
            messages={messages}
            isLoading={isLoading}
            onSendMessage={onSendMessage}
            showSuggestions={showSuggestions}
            suggestedPrompts={suggestedPrompts}
          />

          {/* Input */}
          <ChatInput
            onSend={onSendMessage}
            isLoading={isLoading}
            suggestionsEnabled={showSuggestions}
            onToggleSuggestions={() => setShowSuggestions((prev) => !prev)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
