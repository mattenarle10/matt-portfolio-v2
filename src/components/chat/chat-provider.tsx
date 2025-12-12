"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import type { Message } from "@/schemas"
import { ChatButton } from "./chat-button"
import { ChatDialog } from "./chat-dialog"

function getSuggestedPrompts(pathname: string): string[] {
  if (pathname.startsWith("/projects")) {
    return [
      "Which of Matt's projects best shows his cloud skills?",
      "Tell me about Matt's most recent project.",
      "Which project involves AI or machine learning?",
    ]
  }

  if (pathname.startsWith("/about")) {
    return [
      "Summarize Matt's experience.",
      "What is Matt's education background?",
      "What are Matt's hobbies and interests?",
    ]
  }

  if (pathname.startsWith("/contact")) {
    return [
      "How can I get in touch with Matt?",
      "What's the best way to collaborate with Matt?",
      "Can I book a call with Matt?",
    ]
  }

  // Default for home or other routes
  return [
    "Give me a quick overview of who Matt is.",
    "What is Matt working on right now?",
    "How does Matt balance work, training, and MBA?",
  ]
}

export function ChatProvider() {
  const pathname = usePathname() || "/"
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const suggestedPrompts = getSuggestedPrompts(pathname)

  async function handleSendMessage(content: string) {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Send last 5 messages as context for the AI
      const recentHistory = messages.slice(-5).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: recentHistory,
          page: pathname,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || errorData.details || `HTTP ${response.status}`
        )
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error || data.details || "API returned an error")
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message || "Sorry, I couldn't process that request.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          error instanceof Error
            ? `Error: ${error.message}`
            : "Sorry, I encountered an error. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <ChatDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        suggestedPrompts={suggestedPrompts}
      />
    </>
  )
}
