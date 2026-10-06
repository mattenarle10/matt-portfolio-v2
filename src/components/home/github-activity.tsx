"use client"

import { ArrowUpRight, GitCommitHorizontal, RotateCcw } from "lucide-react"
import { type KeyboardEvent, useEffect, useRef, useState } from "react"
import { TiltCard } from "@/components/ui/tilt-card"
import {
  type Contribution,
  contributionSchema,
  getContributionWeeks,
} from "@/lib/contributions"

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})
const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
})

function describeDay(day: Contribution) {
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${dateFormatter.format(new Date(`${day.date}T00:00:00Z`))}`
}

export default function GitHubActivity() {
  const [days, setDays] = useState<Contribution[]>([])
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")
  const [attempt, setAttempt] = useState(0)
  const [activeDay, setActiveDay] = useState<Contribution | null>(null)
  const [focusDate, setFocusDate] = useState("")
  const scroller = useRef<HTMLElement>(null)
  const buttons = useRef(new Map<string, HTMLButtonElement>())

  useEffect(() => {
    const controller = new AbortController()
    setState("loading")
    async function load() {
      try {
        const response = await fetch("/api/github-contributions", {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Activity unavailable")
        const data = contributionSchema.parse(await response.json())
        const sorted = data.contributions.sort((a, b) =>
          a.date.localeCompare(b.date)
        )
        setDays(sorted)
        setFocusDate(sorted[sorted.length - 1].date)
        setState("ready")
      } catch {
        if (!controller.signal.aborted) setState("error")
      }
    }
    void load()
    return () => controller.abort()
  }, [attempt])

  useEffect(() => {
    if (state === "ready" && scroller.current) {
      scroller.current.scrollLeft = scroller.current.scrollWidth
    }
  }, [state])

  const weeks = getContributionWeeks(days)
  const total = days.reduce((sum, day) => sum + day.count, 0)
  const activeDays = days.filter((day) => day.count > 0).length

  function navigate(
    event: KeyboardEvent<HTMLButtonElement>,
    day: Contribution
  ) {
    const index = days.findIndex((entry) => entry.date === day.date)
    const steps: Record<string, number> = {
      ArrowLeft: -7,
      ArrowRight: 7,
      ArrowUp: -1,
      ArrowDown: 1,
    }
    let next = index
    if (event.key in steps) next += steps[event.key]
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = days.length - 1
    else return
    event.preventDefault()
    const target = days[Math.max(0, Math.min(days.length - 1, next))]
    buttons.current.get(target.date)?.focus()
  }

  return (
    <section aria-labelledby="github-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="github-heading" className="text-base md:text-lg font-light">
          Activity
        </h2>
        <a
          href="https://github.com/mattenarle10"
          target="_blank"
          rel="noopener noreferrer"
          className="quiet-link text-xs"
        >
          GitHub <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
      <TiltCard strength={1.5} className="surface-card activity-card">
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="inline-flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <GitCommitHorizontal size={15} aria-hidden="true" />
            <span className="font-mono">mattenarle10</span>
          </span>
          <span className="text-[11px] text-neutral-500">
            <span className="md:hidden">swipe to explore · </span>past year
          </span>
        </div>
        {state === "loading" && (
          <div className="activity-skeleton" role="status">
            <span className="sr-only">Loading GitHub activity...</span>
          </div>
        )}
        {state === "error" && (
          <div
            className="min-h-28 flex flex-col items-center justify-center gap-3 text-xs text-neutral-500 dark:text-neutral-400"
            role="status"
          >
            <p>GitHub activity couldn&apos;t load right now.</p>
            <button
              type="button"
              className="quiet-link"
              onClick={() => setAttempt((value) => value + 1)}
            >
              <RotateCcw size={13} aria-hidden="true" /> Try again
            </button>
          </div>
        )}
        {state === "ready" && (
          <>
            <section
              ref={scroller}
              className="activity-scroll"
              aria-label="GitHub contributions. Use arrow keys to explore days."
            >
              <div
                className="activity-calendar"
                style={{
                  gridTemplateColumns: `repeat(${weeks.length}, minmax(8px, 1fr))`,
                }}
              >
                {weeks.map((week, weekIndex) => {
                  const first = week.find((day) => day !== null)!
                  const month = first.date.slice(0, 7)
                  const previous =
                    weekIndex > 0
                      ? weeks[weekIndex - 1]
                          .find((day) => day !== null)
                          ?.date.slice(0, 7)
                      : null
                  return (
                    <div className="activity-week" key={first.date}>
                      <span className="activity-month" aria-hidden="true">
                        {month !== previous && weekIndex < weeks.length - 2
                          ? monthFormatter.format(
                              new Date(`${first.date}T00:00:00Z`)
                            )
                          : ""}
                      </span>
                      {week.map((day, dayIndex) =>
                        day ? (
                          <button
                            key={day.date}
                            type="button"
                            ref={(node) => {
                              if (node) buttons.current.set(day.date, node)
                              else buttons.current.delete(day.date)
                            }}
                            className="activity-cell"
                            data-level={day.level}
                            aria-label={describeDay(day)}
                            title={describeDay(day)}
                            tabIndex={focusDate === day.date ? 0 : -1}
                            onPointerEnter={() => setActiveDay(day)}
                            onPointerLeave={() => setActiveDay(null)}
                            onFocus={() => {
                              setFocusDate(day.date)
                              setActiveDay(day)
                            }}
                            onBlur={() => setActiveDay(null)}
                            onClick={() => setActiveDay(day)}
                            onKeyDown={(event) => navigate(event, day)}
                          />
                        ) : (
                          <span
                            key={`empty-${dayIndex}`}
                            className="activity-cell invisible"
                          />
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              <p aria-live="polite" aria-atomic="true" className="min-h-4">
                {activeDay ? (
                  describeDay(activeDay)
                ) : (
                  <>
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium tabular-nums">
                      {total.toLocaleString("en")}
                    </span>{" "}
                    contributions · {activeDays} active days
                  </>
                )}
              </p>
              <div className="flex items-center gap-1" aria-hidden="true">
                <span className="mr-1">Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className="activity-cell activity-key"
                    data-level={level}
                  />
                ))}
                <span className="ml-1">More</span>
              </div>
            </div>
          </>
        )}
      </TiltCard>
    </section>
  )
}
