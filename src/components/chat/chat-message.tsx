"use client"

import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import type { Message } from "@/lib/chat/types"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 !text-white dark:!text-black" />
        ) : (
          <Bot className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        )}
      </div>

      <div
        className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? "bg-black dark:bg-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <p className={`text-sm leading-relaxed whitespace-pre-wrap chat-message-text ${
            isUser
              ? "text-white dark:text-black"
              : "text-gray-900 dark:text-gray-100"
          }`}>
            {message.content}
          </p>
        </div>
        <span className="text-[10px] text-gray-600 dark:text-gray-400 opacity-50 mt-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  )
}
