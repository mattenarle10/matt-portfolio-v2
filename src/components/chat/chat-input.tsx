"use client"

import { Send } from "lucide-react"
import { type KeyboardEvent, useEffect, useRef, useState } from "react"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  suggestionsEnabled: boolean
  onToggleSuggestions: () => void
}

export function ChatInput({
  onSend,
  isLoading,
  suggestionsEnabled,
  onToggleSuggestions,
}: ChatInputProps) {
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
    <div className="chat-input-container border-t p-3 md:p-4 flex-shrink-0">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about Matt..."
          disabled={isLoading}
          className="chat-input-field flex-1 resize-none rounded-lg px-3 py-2 md:px-4 text-xs md:text-sm border focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
          maxLength={1000}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="chat-send-button flex-shrink-0 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
      <div className="mt-1.5 md:mt-2 flex items-center justify-between">
        <p className="text-[9px] md:text-[10px] opacity-70 text-white">
          Press Enter to send, Shift+Enter for new line
        </p>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-[9px] md:text-[10px] text-white/80">
            Suggestions
          </span>
          <button
            type="button"
            onClick={onToggleSuggestions}
            className={`relative inline-flex h-4 w-7 items-center rounded-full border border-white/30 transition-colors ${
              suggestionsEnabled
                ? "chat-toggle-track-on"
                : "chat-toggle-track-off"
            }`}
            aria-pressed={suggestionsEnabled}
            aria-label={
              suggestionsEnabled
                ? "Disable suggested prompts"
                : "Enable suggested prompts"
            }
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full shadow transition-transform ${
                suggestionsEnabled
                  ? "chat-toggle-knob-on translate-x-3"
                  : "chat-toggle-knob-off translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
