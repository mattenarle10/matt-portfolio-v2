import { expect, spyOn, test } from "bun:test"
import { GET } from "../src/app/api/github-contributions/route"

test("activity endpoint caches valid public contribution data", async () => {
  const contributions = [{ date: "2026-01-01", count: 3, level: 2 }]
  const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json({ contributions })
  )
  try {
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600")
    expect(await response.json()).toEqual({ contributions })
  } finally {
    fetchMock.mockRestore()
  }
})

test("upstream failure returns a retryable error without fabricated activity", async () => {
  const fetchMock = spyOn(globalThis, "fetch").mockRejectedValue(
    new Error("upstream offline")
  )
  try {
    const response = await GET()
    expect(response.status).toBe(503)
    expect(response.headers.get("cache-control")).toBeNull()
    expect(await response.json()).toEqual({
      error: "GitHub activity is unavailable right now.",
    })
  } finally {
    fetchMock.mockRestore()
  }
})

test("invalid upstream data follows the error path", async () => {
  const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json({
      contributions: [{ date: "not-a-date", count: 1, level: 2 }],
    })
  )
  try {
    expect((await GET()).status).toBe(503)
  } finally {
    fetchMock.mockRestore()
  }
})
