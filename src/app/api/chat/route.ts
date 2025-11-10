import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { PORTFOLIO_CONTEXT } from "@/lib/chat/context"
import { ChatRequestSchema } from "@/lib/chat/types"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = ChatRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      )
    }

    const { message } = validation.data

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: PORTFOLIO_CONTEXT }],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand! I'm ready to answer questions about Matt Enarle's portfolio, experience, projects, and interests. How can I help you learn more about Matt?",
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}
