import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { PORTFOLIO_CONTEXT } from "@/lib/chat/context"
import { ChatRequestSchema } from "@/schemas"

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

    const { message, history = [], page } = validation.data

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    // Build page and conversation context
    const pageContext = page
      ? `\n\nCurrent page or section: ${page}. Focus your answer on what would be most helpful for a visitor on this page.`
      : ""

    const conversationContext =
      history.length > 0
        ? `\n\nPrevious conversation:\n${history
            .map(
              (msg) =>
                `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
            )
            .join("\n")}\n`
        : ""

    const prompt = `${PORTFOLIO_CONTEXT}${pageContext}${conversationContext}\nUser question: ${message}\n\nPlease provide a helpful response about Matt Enarle based on the context above.`

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        maxOutputTokens: 350,
        temperature: 0.5,
        topP: 0.9,
        topK: 32,
      },
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Chat API error:", error)

    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error message"
    const isRateLimit =
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("quota exceeded")
    const statusCode = isRateLimit ? 429 : 500
    const clientErrorMessage = isRateLimit
      ? "Rate limited by Gemini API. Please retry shortly."
      : "Failed to process message"

    return NextResponse.json(
      {
        error: clientErrorMessage,
        details: errorMessage,
      },
      { status: statusCode }
    )
  }
}
