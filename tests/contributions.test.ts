import { expect, test } from "bun:test"
import {
  contributionSchema,
  getContributionWeeks,
} from "../src/lib/contributions"

const day = (date: string, count = 1) => ({ date, count, level: count ? 1 : 0 })

test("calendar keeps leap day and month boundaries in their UTC weekdays", () => {
  const days = [
    "2024-02-28",
    "2024-02-29",
    "2024-03-01",
    "2024-03-02",
    "2024-03-03",
  ].map((date) => day(date))
  const weeks = getContributionWeeks(days)
  expect(weeks[0].map((entry) => entry?.date ?? null)).toEqual([
    null,
    null,
    null,
    "2024-02-28",
    "2024-02-29",
    "2024-03-01",
    "2024-03-02",
  ])
  expect(weeks[1][0]?.date).toBe("2024-03-03")
  expect(weeks[1].slice(1)).toEqual(Array(6).fill(null))
})

test("calendar sorts days without mutating the response or inventing contributions", () => {
  const days = [day("2025-01-01", 0), day("2024-12-31", 4)]
  const weeks = getContributionWeeks(days)
  expect(weeks.flat().filter(Boolean)).toEqual([
    day("2024-12-31", 4),
    day("2025-01-01", 0),
  ])
  expect(days[0].date).toBe("2025-01-01")
  expect(getContributionWeeks([])).toEqual([])
})

test("upstream validation rejects malformed dates, counts, levels, and empty data", () => {
  for (const contributions of [
    [],
    [day("2025-02-30")],
    [day("2025-01-01", -1)],
    [{ ...day("2025-01-01"), level: 5 }],
  ]) {
    expect(contributionSchema.safeParse({ contributions }).success).toBe(false)
  }
  expect(
    contributionSchema.safeParse({ contributions: [day("2024-02-29", 0)] })
      .success
  ).toBe(true)
})
