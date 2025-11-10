"use client"

import { Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import type { Message } from "@/lib/chat/types"
import { ChatMessage } from "./chat-message"

interface ChatMessageListProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
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
          <h3 className="text-lg font-medium mb-2">
            Ask me anything about Matt!
          </h3>
          <p className="text-sm opacity-70 mb-4">
            Try asking about his experience, projects, or hobbies
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              What projects has Matt worked on?
            </button>
            <button
              type="button"
              className="text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Tell me about Matt's experience
            </button>
            <button
              type="button"
              className="text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <Loader2 className="w-4 h-4 text-gray-700 dark:text-gray-300 animate-spin" />
          </div>
          <div className="flex items-center">
            <div className="rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800">
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
