import { type ChatRequest, ChatResponseSchema } from "@/schemas"

export class ChatRequestError extends Error {}

const unavailable =
  "The assistant is unavailable right now. Try again shortly, or email matthew.enarle@outlook.com."

export async function sendChatRequest(body: ChatRequest, signal: AbortSignal) {
  const deadline = AbortSignal.timeout(25_000)
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.any([signal, deadline]),
    })
    if (!response.ok) {
      const errors: Record<number, string> = {
        400: "That message could not be sent. Keep it under 1,000 characters and try again.",
        429: "The assistant is busy right now. Please try again later.",
        504: "The reply took too long. Please try again.",
      }
      throw new ChatRequestError(errors[response.status] ?? unavailable)
    }
    const data = ChatResponseSchema.safeParse(await response.json())
    if (!data.success || data.data.error || !data.data.message.trim()) {
      throw new ChatRequestError(unavailable)
    }
    return data.data.message
  } catch (error) {
    if (signal.aborted) throw error
    if (deadline.aborted)
      throw new ChatRequestError("The reply took too long. Please try again.")
    if (error instanceof ChatRequestError) throw error
    throw new ChatRequestError(unavailable)
  }
}
