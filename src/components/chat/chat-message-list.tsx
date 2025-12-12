"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import type { Message } from "@/schemas"
import { ChatMessage } from "./chat-message"

interface ChatMessageListProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage?: (message: string) => void
  showSuggestions?: boolean
  suggestedPrompts?: string[]
}

export function ChatMessageList({
  messages,
  isLoading,
  onSendMessage,
  showSuggestions = true,
  suggestedPrompts,
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  if (messages.length === 0) {
    const prompts =
      suggestedPrompts && suggestedPrompts.length > 0
        ? suggestedPrompts
        : [
            "What projects has Matt worked on?",
            "Tell me about Matt's experience",
            "What are Matt's hobbies?",
          ]

    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="text-center max-w-sm">
          <h3 className="chat-empty-title text-base md:text-lg font-medium mb-2">
            Ask me anything about Matt!
          </h3>
          {showSuggestions && (
            <>
              <p className="chat-empty-subtitle text-xs md:text-sm mb-4">
                Try asking about his experience, projects, or hobbies
              </p>
              <div className="flex flex-col gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => onSendMessage?.(prompt)}
                    className="chat-suggestion-button text-xs px-3 py-2 rounded-lg transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex gap-2 md:gap-3">
          <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden">
            <Image
              src="/about/matt-viet.png"
              alt="Matt Enarle"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex items-center">
            <div className="rounded-lg px-3 py-2 md:px-4 bg-gray-100 dark:bg-gray-700">
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
