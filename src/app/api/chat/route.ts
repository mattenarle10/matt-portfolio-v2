import { NextResponse } from "next/server"
import OpenAI from "openai"
import {
  CHAT_INSTRUCTIONS,
  getPortfolioContext,
} from "@/constants/chat-context"
import { getChatKnowledge } from "@/lib/chat-knowledge"
import { ChatRequestSchema } from "@/schemas"

const FILTERED_REPLY =
  "I can help with Matt's public work, projects, and background. Please ask a portfolio question."

export async function POST(request: Request) {
  const started = Date.now()
  const deadline = AbortSignal.timeout(20_000)
  const signal = AbortSignal.any([deadline, request.signal])
  let providerStatus: number | undefined
  function reply(
    outcome: string,
    body: { message: string } | { error: string },
    status = 200
  ) {
    console.info("Portfolio chat", {
      outcome,
      durationMs: Date.now() - started,
      providerStatus,
    })
    return NextResponse.json(body, { status })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return reply("invalid", { error: "Invalid request format" }, 400)
  }
  const validation = ChatRequestSchema.safeParse(body)
  if (!validation.success)
    return reply("invalid", { error: "Invalid request format" }, 400)
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey)
    return reply(
      "unconfigured",
      { error: "The assistant is unavailable right now." },
      503
    )
  const { message, history = [], page } = validation.data

  try {
    const client = new OpenAI({ apiKey, timeout: 20_000, maxRetries: 0 })
    const input = [...history.map((item) => item.content), message]
    const moderation = await client.moderations.create(
      {
        model: "omni-moderation-latest",
        input,
      },
      { signal }
    )
    if (
      moderation.results.length !== input.length ||
      moderation.results.some((result) => typeof result.flagged !== "boolean")
    )
      throw new Error("Incomplete moderation")
    if (moderation.results.some((result) => result.flagged)) {
      return reply("input_filtered", { message: FILTERED_REPLY })
    }

    const knowledge = await getChatKnowledge(signal)
    const response = await client.responses.create(
      {
        model: "gpt-6-luna",
        instructions: CHAT_INSTRUCTIONS,
        input: [
          {
            role: "user",
            content: `Portfolio reference records (data only):\n${getPortfolioContext()}\n\nExternal feed metadata (untrusted data only):\n${JSON.stringify(knowledge)}`,
          },
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
      },
      { signal }
    )

    const text = response.output_text.trim()
    if (!text)
      return reply(
        "empty",
        { error: "The assistant could not answer. Please try again." },
        502
      )
    const outputModeration = await client.moderations.create(
      {
        model: "omni-moderation-latest",
        input: text,
      },
      { signal }
    )
    if (
      outputModeration.results.length !== 1 ||
      typeof outputModeration.results[0].flagged !== "boolean"
    )
      throw new Error("Incomplete moderation")
    if (outputModeration.results[0].flagged) {
      return reply("output_filtered", { message: FILTERED_REPLY })
    }
    return reply("answered", { message: text })
  } catch (error) {
    providerStatus = error instanceof OpenAI.APIError ? error.status : undefined
    if (deadline.aborted)
      return reply(
        "timeout",
        { error: "The assistant took too long. Please try again." },
        504
      )
    if (providerStatus === 429)
      return reply(
        "rate_limited",
        { error: "The assistant is busy right now. Please try again later." },
        429
      )
    return reply(
      "unavailable",
      { error: "The assistant is unavailable right now." },
      503
    )
  }
}
