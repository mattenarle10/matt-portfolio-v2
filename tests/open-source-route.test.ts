import { expect, spyOn, test } from "bun:test"
import { GET } from "../src/app/api/github-open-source/route"

const items = [1, 2, 3].map((number) => ({
  number,
  repository_url: "https://api.github.com/repos/aws/example",
  user: { login: "mattenarle10" },
  title: `Contribution ${number}`,
  state: "open",
  draft: false,
  pull_request: { merged_at: null },
}))

test("public PRs use the live title and distinguish merged, open, and closed drafts", async () => {
  const details = [
    {
      title: "Merged contribution",
      state: "closed",
      merged_at: "2026-11-09T22:42:42Z",
      draft: false,
    },
    {
      title: "Updated contribution title",
      state: "open",
      merged_at: null,
      draft: false,
    },
    {
      title: "Closed draft",
      state: "closed",
      merged_at: null,
      draft: true,
    },
  ]
  const fetchMock = spyOn(globalThis, "fetch").mockResolvedValueOnce(
    Response.json({
      items: items.map((item, index) => {
        const { merged_at, ...pr } = details[index]
        return { ...item, ...pr, pull_request: { merged_at } }
      }),
    })
  )
  try {
    const response = await GET()
    const { contributions } = await response.json()
    const searchUrl = new URL(String(fetchMock.mock.calls[0][0]))
    expect(searchUrl.searchParams.get("q")).toContain("author:mattenarle10")
    expect(searchUrl.searchParams.get("q")).toContain("is:public")
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600")
    expect(contributions.map((pr: { status: string }) => pr.status)).toEqual([
      "merged",
      "open",
      "closed",
    ])
    expect(contributions[1].title).toBe("Updated contribution title")
    expect(contributions[0].url).toBe("https://github.com/aws/example/pull/1")
    expect(fetchMock).toHaveBeenCalledTimes(1)
  } finally {
    fetchMock.mockRestore()
  }
})

test("a different author or non-AWS repository is never displayed", async () => {
  for (const item of [
    { ...items[0], user: { login: "someone-else" } },
    {
      ...items[0],
      repository_url: "https://api.github.com/repos/not-aws/example",
    },
    {
      ...items[0],
      repository_url: "https://example.invalid/repos/aws/example",
    },
  ]) {
    const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ items: [item] })
    )
    try {
      expect((await GET()).status).toBe(503)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    } finally {
      fetchMock.mockRestore()
    }
  }
})

test("GitHub rate limits produce an uncached error without invented contributions", async () => {
  const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json({ message: "API rate limit exceeded" }, { status: 403 })
  )
  try {
    const response = await GET()
    expect(response.status).toBe(503)
    expect(response.headers.get("cache-control")).toBeNull()
    expect(await response.json()).toEqual({
      error: "Open source contributions are unavailable right now.",
    })
  } finally {
    fetchMock.mockRestore()
  }
})

test("no matching PRs returns an empty list", async () => {
  const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json({ items: [] })
  )
  try {
    expect(await (await GET()).json()).toEqual({ contributions: [] })
  } finally {
    fetchMock.mockRestore()
  }
})
