import { z } from "zod"

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.date(),
})

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
  page: z.string().optional(),
})

export const ChatResponseSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
})

export type Message = z.infer<typeof MessageSchema>
export type ChatRequest = z.infer<typeof ChatRequestSchema>
export type ChatResponse = z.infer<typeof ChatResponseSchema>

export interface ChatState {
  messages: Message[]
  isOpen: boolean
  isLoading: boolean
}
