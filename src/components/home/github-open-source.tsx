"use client"

import { ArrowUpRight, GitMerge, GitPullRequest } from "lucide-react"
import { useEffect, useState } from "react"
import {
  type OpenSourceContribution,
  openSourceSchema,
  openSourceSearchUrl,
} from "@/lib/open-source"

const statusLabels = {
  merged: "Merged",
  open: "Open",
  draft: "Draft",
  closed: "Closed",
}

export default function GitHubOpenSource() {
  const [contributions, setContributions] = useState<OpenSourceContribution[]>(
    []
  )
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch("/api/github-open-source", {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Contributions unavailable")
        const data = openSourceSchema.parse(await response.json())
        setContributions(data.contributions)
        setState("ready")
      } catch {
        if (!controller.signal.aborted) setState("error")
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  if (state === "ready" && !contributions.length) return null

  return (
    <section
      aria-labelledby="open-source-heading"
      className="mt-3 border-t border-[var(--surface-border)] pt-2"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="open-source-heading" className="text-xs font-medium">
          Recent activity
        </h3>
        <a
          href={openSourceSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="quiet-link text-xs"
          aria-label="View all of Matt's AWS pull requests on GitHub"
        >
          View all <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
      {state === "ready" ? (
        <ul className="space-y-0.5">
          {contributions.map((contribution) => {
            const StatusIcon =
              contribution.status === "merged" ? GitMerge : GitPullRequest
            return (
              <li key={contribution.url}>
                <a
                  href={contribution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-2 grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-0.5 rounded px-2 py-1.5 transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <span className="min-w-0 font-mono text-xs text-[var(--muted)] [overflow-wrap:anywhere]">
                    {contribution.repository} #{contribution.number}
                  </span>
                  <span className="col-span-2 row-start-2 text-[0.8125rem] leading-snug [overflow-wrap:anywhere]">
                    {contribution.title}
                  </span>
                  <span
                    className={`col-start-2 row-start-1 inline-flex items-center gap-1 text-xs ${contribution.status === "merged" ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
                  >
                    <StatusIcon size={12} aria-hidden="true" />
                    {statusLabels[contribution.status]}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="py-2 text-xs text-[var(--muted)]" role="status">
          {state === "loading"
            ? "Loading contributions..."
            : "Contributions are available on GitHub."}
        </p>
      )}
    </section>
  )
}
