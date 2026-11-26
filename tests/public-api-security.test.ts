import { expect, spyOn, test } from "bun:test"
import { GET as githubStats } from "../src/app/api/github-stats/route"

test("GitHub stats rejects unlisted repositories without calling GitHub", async () => {
  const mock = spyOn(globalThis, "fetch").mockRejectedValue(
    new Error("Unexpected provider request")
  )
  try {
    const github = await githubStats(
      new Request("https://mattenarle.com/api/github-stats?repo=unlisted/repo")
    )
    expect(github.status).toBe(404)
    expect(mock).not.toHaveBeenCalled()
  } finally {
    mock.mockRestore()
  }
})
