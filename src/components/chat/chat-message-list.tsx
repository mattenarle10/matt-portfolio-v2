"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import type { Message } from "@/lib/chat/types"
import { ChatMessage } from "./chat-message"

interface ChatMessageListProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage?: (message: string) => void
}

export function ChatMessageList({
  messages,
  isLoading,
  onSendMessage,
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
            Ask me anything about Matt!
          </h3>
          <p className="text-sm opacity-70 mb-4 text-gray-700 dark:text-gray-300">
            Try asking about his experience, projects, or hobbies
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() =>
                onSendMessage?.("What projects has Matt worked on?")
              }
              className="text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-gray-100"
            >
              What projects has Matt worked on?
            </button>
            <button
              type="button"
              onClick={() => onSendMessage?.("Tell me about Matt's experience")}
              className="text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-gray-100"
            >
              Tell me about Matt's experience
            </button>
            <button
              type="button"
              onClick={() => onSendMessage?.("What are Matt's hobbies?")}
              className="text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-gray-100"
            >
              What are Matt's hobbies?
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/about/matt-viet.png"
              alt="Matt Enarle"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex items-center">
            <div className="rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-700">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
