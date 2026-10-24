"use client"

import { useEffect, useState } from "react"
import { parseRepo } from "@/lib/github"
import type { Project } from "@/schemas"

type LiveStats = { stars: number; forks: number; downloads?: number } | null

export function ProjectStatsRow({ project }: { project: Project }) {
  const [live, setLive] = useState<LiveStats>(null)

  useEffect(() => {
    if (!project.github) return
    const parsed = parseRepo(project.github)
    if (!parsed) return
    let cancelled = false
    fetch(`/api/github-stats?repo=${parsed.owner}/${parsed.repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: LiveStats) => {
        if (!cancelled && data) setLive(data)
      })
      .catch(() => {
        /* silent — no row, no fuss */
      })
    return () => {
      cancelled = true
    }
  }, [project.github])

  const hasLive = live !== null
  const hasStatic = (project.stats?.length ?? 0) > 0
  if (!hasLive && !hasStatic) return null

  return (
    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-[var(--muted)] transition-opacity leading-relaxed">
      {live && live.stars > 0 && (
        <span className="whitespace-nowrap">
          <span aria-hidden>★</span> {formatNum(live.stars)} <span>stars</span>
        </span>
      )}
      {live && live.forks > 0 && (
        <span className="whitespace-nowrap">
          <span aria-hidden>⑂</span> {formatNum(live.forks)} <span>forks</span>
        </span>
      )}
      {live && (live.downloads ?? 0) > 0 && (
        <span className="whitespace-nowrap">
          <span aria-hidden>⇣</span> {formatNum(live.downloads ?? 0)}
          <span> downloads</span>
        </span>
      )}
      {project.stats?.map((s) => (
        <span key={`${s.label}-${s.value}`} className="whitespace-nowrap">
          {s.icon && (
            <span aria-hidden className="mr-0.5">
              {s.icon}
            </span>
          )}
          {s.value} <span>{s.label}</span>
        </span>
      ))}
    </div>
  )
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
