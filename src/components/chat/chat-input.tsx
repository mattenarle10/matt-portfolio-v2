"use client"

import { Send } from "lucide-react"
import { type KeyboardEvent, useEffect, useRef, useState } from "react"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [message])

  function handleSend() {
    if (message.trim() && !isLoading) {
      onSend(message.trim())
      setMessage("")
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-3 md:p-4 flex-shrink-0">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about Matt..."
          disabled={isLoading}
          className="flex-1 resize-none rounded-lg px-3 py-2 md:px-4 text-xs md:text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-black dark:focus:border-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          rows={1}
          maxLength={1000}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5 md:w-4 md:h-4 !text-white dark:!text-black" />
        </button>
      </div>
      <p className="text-[9px] md:text-[10px] opacity-50 mt-1.5 md:mt-2 text-gray-600 dark:text-gray-400">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
