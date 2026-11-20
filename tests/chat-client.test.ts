import { expect, spyOn, test } from "bun:test"
import { sendChatRequest } from "../src/lib/chat-client"

test("client distinguishes errors even when the response is not JSON", async () => {
  const fetchMock = spyOn(globalThis, "fetch")
  try {
    for (const [status, expected] of [
      [400, "1,000 characters"],
      [429, "busy"],
      [504, "too long"],
      [503, "unavailable"],
    ] as const) {
      fetchMock.mockResolvedValueOnce(
        new Response("Private backend details", { status })
      )
      await expect(
        sendChatRequest({ message: "Hello" }, new AbortController().signal)
      ).rejects.toThrow(expected)
    }
    fetchMock.mockResolvedValueOnce(Response.json({ message: "" }))
    await expect(
      sendChatRequest({ message: "Hello" }, new AbortController().signal)
    ).rejects.toThrow("unavailable")
    fetchMock.mockResolvedValueOnce(
      Response.json({ message: "Matt built Pilly." })
    )
    expect(
      await sendChatRequest(
        { message: "Latest project?" },
        new AbortController().signal
      )
    ).toBe("Matt built Pilly.")
  } finally {
    fetchMock.mockRestore()
  }
})

test("client timeout is distinct from a visitor stopping the reply", async () => {
  const timeout = spyOn(AbortSignal, "timeout").mockReturnValue(
    AbortSignal.abort()
  )
  const fetchMock = spyOn(globalThis, "fetch").mockRejectedValue(
    new Error("aborted")
  )
  try {
    await expect(
      sendChatRequest({ message: "Hi" }, new AbortController().signal)
    ).rejects.toThrow("too long")
    await expect(
      sendChatRequest({ message: "Hi" }, AbortSignal.abort())
    ).rejects.toThrow("aborted")
  } finally {
    timeout.mockRestore()
    fetchMock.mockRestore()
  }
})
