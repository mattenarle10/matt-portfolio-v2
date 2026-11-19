import { NextResponse } from "next/server"
import OpenAI from "openai"
import { PORTFOLIO_CONTEXT } from "@/constants"
import { ChatRequestSchema } from "@/schemas"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    )
  }

  const validation = ChatRequestSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    )
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "The assistant is unavailable right now." },
      { status: 503 }
    )
  }

  const { message, history = [], page } = validation.data

  try {
    const client = new OpenAI({ apiKey, timeout: 15_000, maxRetries: 0 })
    const response = await client.responses.create({
      model: "gpt-6-luna",
      instructions: PORTFOLIO_CONTEXT,
      input: [
        ...history,
        {
          role: "user",
          content: page ? `Portfolio page: ${page}\n\n${message}` : message,
        },
      ],
      reasoning: { effort: "none" },
      text: { verbosity: "low" },
      max_output_tokens: 350,
      store: false,
    })

    const text = response.output_text.trim()
    if (!text) {
      return NextResponse.json(
        { error: "The assistant could not answer. Please try again." },
        { status: 502 }
      )
    }

    return NextResponse.json({ message: text })
  } catch (error) {
    const status = error instanceof OpenAI.APIError ? error.status : undefined
    console.error("Chat API request failed", { status })

    return NextResponse.json(
      {
        error:
          status === 429
            ? "The assistant is busy right now. Please try again later."
            : "The assistant is unavailable right now.",
      },
      { status: status === 429 ? 429 : 503 }
    )
  }
}
