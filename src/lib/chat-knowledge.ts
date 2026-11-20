import { fetchBuilderCenterMetadata } from "./builder-center"
import { fetchMediumPosts } from "./medium"
import { fetchOpenSourceContributions } from "./open-source"

function publicUrl(value: string, hosts: string[]) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" &&
      hosts.includes(url.hostname) &&
      !url.username &&
      !url.password &&
      value.length <= 500
      ? url.href
      : null
  } catch {
    return null
  }
}

export async function getChatKnowledge(signal: AbortSignal) {
  const sourceSignal = AbortSignal.any([signal, AbortSignal.timeout(2000)])
  const [github, medium, builder] = await Promise.allSettled([
    fetchOpenSourceContributions(sourceSignal),
    fetchMediumPosts(sourceSignal),
    fetchBuilderCenterMetadata(sourceSignal),
  ])

  const writing = [
    ...(medium.status === "fulfilled" ? medium.value : []),
    ...(builder.status === "fulfilled" ? builder.value : []),
  ]
    .flatMap((post) => {
      const url = publicUrl(post.url, [
        "medium.com",
        "mattenarle.medium.com",
        "builder.aws.com",
      ])
      if (!url || !Number.isFinite(Date.parse(post.publishedAt))) return []
      return [
        {
          title: post.title.slice(0, 200),
          url,
          publishedAt: post.publishedAt.slice(0, 100),
          excerpt: post.excerpt?.slice(0, 200) ?? null,
        },
      ]
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))

  const seen = new Set<string>()
  return {
    sources: {
      github:
        github.status === "fulfilled"
          ? "available (cached up to 1 hour)"
          : "unavailable",
      medium:
        medium.status === "fulfilled"
          ? "available (cached up to 30 minutes)"
          : "unavailable",
      builderCenter:
        builder.status === "fulfilled"
          ? "available (cached up to 30 minutes)"
          : "unavailable",
    },
    contributions:
      github.status === "fulfilled"
        ? github.value.contributions.map((pr) => ({
            ...pr,
            title: pr.title.slice(0, 200),
          }))
        : [],
    writing: writing
      .filter((post) => {
        if (seen.has(post.url)) return false
        seen.add(post.url)
        return true
      })
      .slice(0, 5),
  }
}
