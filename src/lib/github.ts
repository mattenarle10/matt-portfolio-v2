// Lightweight GitHub repo stats helper.
// No auth — uses public API (60 req/hr per IP). Cached via Next route handler.

export function parseRepo(
  url: string | string[]
): { owner: string; repo: string } | null {
  const u = Array.isArray(url) ? url[0] : url
  if (!u) return null
  const m = u.match(/github\.com\/([^/]+)\/([^/?#]+)/i)
  if (!m) return null
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") }
}

export async function fetchStats(
  owner: string,
  repo: string
): Promise<{ stars: number; forks: number } | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
    }
  } catch {
    return null
  }
}
