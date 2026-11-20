"use client"

import { useReducedMotion } from "framer-motion"
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
  const listRef = useRef<HTMLDivElement>(null)
  const nearBottom = useRef(true)
  const listHeight = useRef(0)
  const reducedMotion = useReducedMotion()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
    })
  }

  useEffect(() => {
    if (messages.at(-1)?.role === "user") nearBottom.current = true
    if (!nearBottom.current) return
    const frame = requestAnimationFrame(scrollToBottom)
    return () => cancelAnimationFrame(frame)
  }, [messages, isLoading])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    let frame = 0
    const observer = new ResizeObserver(() => {
      listHeight.current = list.clientHeight
      if (nearBottom.current) {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(scrollToBottom)
      }
    })
    observer.observe(list)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [messages.length > 0, reducedMotion])

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
      <div className="chat-messages min-h-0 min-w-0 flex-1 flex flex-col overflow-y-auto">
        <div className="shrink-0 mx-auto my-auto p-4 md:p-8 text-center max-w-sm">
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
    <div
      ref={listRef}
      role="log"
      aria-label="Conversation"
      aria-live="polite"
      onScroll={(event) => {
        const list = event.currentTarget
        // Resizing is not a visitor choosing to scroll away from the latest reply.
        if (list.clientHeight !== listHeight.current) return
        nearBottom.current =
          list.scrollHeight - list.scrollTop - list.clientHeight < 80
      }}
      className="chat-messages min-h-0 min-w-0 flex-1 overflow-y-auto"
    >
      <div className="p-3 md:p-4 space-y-3 md:space-y-4">
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
              <div
                className="chat-bubble-assistant rounded-lg px-3 py-2 md:px-4"
                role="status"
              >
                <span className="sr-only">Preparing a reply</span>
                <div className="flex gap-1" aria-hidden="true">
                  <span className="w-1.5 h-1.5 bg-current opacity-40 rounded-full motion-safe:animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-current opacity-40 rounded-full motion-safe:animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-current opacity-40 rounded-full motion-safe:animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
