import { z } from "zod"

export const contributionSchema = z.object({
  contributions: z
    .array(
      z.object({
        date: z.iso.date(),
        count: z.number().int().nonnegative(),
        level: z.number().int().min(0).max(4),
      })
    )
    .min(1)
    .max(400),
})

export type Contribution = z.infer<
  typeof contributionSchema
>["contributions"][number]

export function getContributionWeeks(days: Contribution[]) {
  if (!days.length) return []
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  const offset = new Date(`${sorted[0].date}T00:00:00Z`).getUTCDay()
  const cells: (Contribution | null)[] = [
    ...Array<null>(offset).fill(null),
    ...sorted,
  ]
  const weeks: (Contribution | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7)
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}
