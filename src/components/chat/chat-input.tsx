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
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
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
          aria-label="Message Matt's assistant"
          disabled={isLoading}
          className="chat-input-field min-w-0 min-h-11 flex-1 resize-none rounded-lg px-3 py-2 md:px-4 text-base border disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
          maxLength={1000}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="chat-send-button flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 items-center justify-between">
        <p className="chat-hint hidden md:block text-xs">
          Press Enter to send, Shift+Enter for new line
        </p>
        <div className="flex items-center gap-2">
          <span className="chat-hint text-xs">Suggestions</span>
          <button
            type="button"
            onClick={onToggleSuggestions}
            className="suggestions-toggle relative inline-flex h-11 w-11 items-center justify-center"
            aria-pressed={suggestionsEnabled}
            aria-label={
              suggestionsEnabled
                ? "Disable suggested prompts"
                : "Enable suggested prompts"
            }
          >
            <span
              aria-hidden="true"
              className={`inline-flex h-5 w-8 items-center rounded-full border ${suggestionsEnabled ? "chat-toggle-track-on" : "chat-toggle-track-off"}`}
            >
              <span
                className={`inline-block h-3 w-3 rounded-full shadow transition-transform ${suggestionsEnabled ? "chat-toggle-knob-on translate-x-4" : "chat-toggle-knob-off translate-x-0.5"}`}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
