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
): Promise<{ stars: number; forks: number; downloads: number } | null> {
  try {
    const headers = { Accept: "application/vnd.github+json" }
    const [repoRes, releasesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases?per_page=20`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      ),
    ])
    if (!repoRes.ok) return null
    const data = await repoRes.json()
    const releases = releasesRes.ok ? await releasesRes.json() : []
    const downloads = Array.isArray(releases)
      ? releases.reduce(
          (sum, release) =>
            sum +
            (Array.isArray(release.assets)
              ? release.assets.reduce(
                  (assetSum: number, asset: { download_count?: number }) =>
                    assetSum + (asset.download_count ?? 0),
                  0
                )
              : 0),
          0
        )
      : 0
    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      downloads,
    }
  } catch {
    return null
  }
}
