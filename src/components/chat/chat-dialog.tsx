"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
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
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen) {
      if (!dialog?.open) dialog?.showModal()
      const overflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = overflow
      }
    }
    dialog?.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className="chat-panel"
      aria-labelledby="chat-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          <div className="chat-header flex items-center justify-between p-4 border-b shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
                <Image
                  src="/about/matt-viet.png"
                  alt=""
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2
                  id="chat-title"
                  className="chat-header-title text-sm font-medium"
                >
                  Matt&apos;s assistant
                </h2>
                <p className="chat-header-status text-[11px]">
                  AI guide to my work & life
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="chat-header-button icon-button"
              aria-label="Close chat"
            >
              <X size={17} />
            </button>
          </div>
          <ChatMessageList
            messages={messages}
            isLoading={isLoading}
            onSendMessage={onSendMessage}
            showSuggestions={showSuggestions}
            suggestedPrompts={suggestedPrompts}
          />
          <ChatInput
            onSend={onSendMessage}
            isLoading={isLoading}
            suggestionsEnabled={showSuggestions}
            onToggleSuggestions={() => setShowSuggestions((prev) => !prev)}
          />
        </motion.div>
      )}
    </dialog>
  )
}
