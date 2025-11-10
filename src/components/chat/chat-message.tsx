"use client"

import { motion } from "framer-motion"
import { User } from "lucide-react"
import Image from "next/image"
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
      className={`flex gap-2 md:gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden ${
          isUser
            ? "bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            : ""
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-700 dark:text-gray-300" />
        ) : (
          <Image
            src="/about/matt-viet.png"
            alt="Matt Enarle"
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      <div
        className={`flex flex-col max-w-[80%] md:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-lg px-3 py-2 md:px-4 ${
            isUser ? "bg-black dark:bg-white" : "bg-gray-100 dark:bg-gray-700"
          }`}
        >
          <p
            className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words ${
              isUser ? "user-message-text" : "assistant-message-text"
            }`}
          >
            {message.content}
          </p>
        </div>
        <span className="text-[9px] md:text-[10px] text-gray-600 dark:text-gray-400 opacity-50 mt-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  )
}
