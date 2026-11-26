import { expect, spyOn, test } from "bun:test"
import { GET as githubStats } from "../src/app/api/github-stats/route"
import { GET as stravaActivities } from "../src/app/api/strava/activities/route"

test("Strava serves only public activities and omits route coordinates", async () => {
  const run = {
    id: 1,
    name: "Public run",
    type: "Run",
    start_date: "2026-11-20T08:00:00Z",
    distance: 5000,
    moving_time: 1500,
    total_elevation_gain: 50,
    start_latlng: [12, 34],
    map: { summary_polyline: "hidden coordinates" },
  }
  const mock = spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(Response.json({ access_token: "test-token" }))
    .mockResolvedValueOnce(
      Response.json([
        { ...run, id: 2, visibility: "only_me" },
        { ...run, id: 3, visibility: "followers_only" },
        { ...run, id: 4 },
        { ...run, visibility: "everyone" },
      ])
    )
  try {
    const response = await stravaActivities(
      new Request("https://mattenarle.com/api/strava/activities?per_page=1")
    )
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([
      {
        id: 1,
        name: "Public run",
        type: "Run",
        start_date: "2026-11-20T08:00:00Z",
        distance: 5000,
        moving_time: 1500,
        total_elevation_gain: 50,
      },
    ])
    expect(mock).toHaveBeenCalledTimes(2)
  } finally {
    mock.mockRestore()
  }
})

test("public API query limits reject out-of-scope requests before calling providers", async () => {
  const mock = spyOn(globalThis, "fetch").mockRejectedValue(
    new Error("Unexpected provider request")
  )
  try {
    const strava = await stravaActivities(
      new Request("https://mattenarle.com/api/strava/activities?per_page=200")
    )
    const github = await githubStats(
      new Request("https://mattenarle.com/api/github-stats?repo=unlisted/repo")
    )
    expect(strava.status).toBe(400)
    expect(github.status).toBe(404)
    expect(mock).not.toHaveBeenCalled()
  } finally {
    mock.mockRestore()
  }
})
