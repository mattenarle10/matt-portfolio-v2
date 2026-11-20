"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { ChatRequestError, sendChatRequest } from "@/lib/chat-client"
import type { Message } from "@/schemas"
import { ChatButton } from "./chat-button"

const ChatDialog = dynamic(
  () => import("./chat-dialog").then((mod) => mod.ChatDialog),
  { ssr: false }
)

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

const ChatContext = createContext({ openChat: () => {}, closeChat: () => {} })

export const useChat = () => useContext(ChatContext)

export function ChatProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/"
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const pendingRequest = useRef<AbortController | null>(null)
  const suggestedPrompts = getSuggestedPrompts(pathname)

  useEffect(() => () => pendingRequest.current?.abort(), [])

  function openChat() {
    setHasOpened(true)
    setIsOpen(true)
  }

  function handleToggleChat() {
    setIsOpen((current) => {
      if (!current) {
        setHasOpened(true)
      }
      return !current
    })
  }

  async function handleSendMessage(content: string) {
    content = content.trim()
    if (pendingRequest.current || !content || content.length > 1000) return
    const controller = new AbortController()
    pendingRequest.current = controller
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
      const recentHistory = messages
        .filter((msg) => !msg.isError)
        .slice(-5)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

      const reply = await sendChatRequest(
        {
          message: content,
          history: recentHistory,
          page: pathname,
        },
        controller.signal
      )
      if (controller.signal.aborted) return

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      if (controller.signal.aborted) return
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          error instanceof ChatRequestError
            ? error.message
            : "The assistant is unavailable right now. Please try again.",
        timestamp: new Date(),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      pendingRequest.current = null
      setIsLoading(false)
    }
  }

  return (
    <ChatContext.Provider
      value={{ openChat, closeChat: () => setIsOpen(false) }}
    >
      {children}
      <ChatButton isOpen={isOpen} onClick={handleToggleChat} />
      {hasOpened && (
        <ChatDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onStop={() => pendingRequest.current?.abort()}
          onReset={() => setMessages([])}
          suggestedPrompts={suggestedPrompts}
        />
      )}
    </ChatContext.Provider>
  )
}
