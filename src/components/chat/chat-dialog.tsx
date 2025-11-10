"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useEffect } from "react"
import Image from "next/image"
import type { Message } from "@/lib/chat/types"
import { ChatInput } from "./chat-input"
import { ChatMessageList } from "./chat-message-list"

interface ChatDialogProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => void
}

export function ChatDialog({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
}: ChatDialogProps) {
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
            className="fixed bottom-24 right-6 w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] bg-white dark:bg-[#0a0a0a] rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                  <Image
                    src="/about/matt-viet.png"
                    alt="Matt Enarle"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h2 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    Matt Enarle
                  </h2>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Online
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors chat-close-button"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <ChatMessageList
              messages={messages}
              isLoading={isLoading}
              onSendMessage={onSendMessage}
            />

            {/* Input */}
            <ChatInput onSend={onSendMessage} isLoading={isLoading} />
          </motion.div>
      )}
    </AnimatePresence>
  )
}
