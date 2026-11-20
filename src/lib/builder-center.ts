const BUILDER_CENTER_URL = "https://builder.aws.com"
const BUILDER_CENTER_CREATOR_ID = "47ef16a1-09b3-4a32-98a4-1128ee93eb68"
const BUILDER_CENTER_ARTICLES_URL = `https://api.builder.aws.com/cs/v2/articles/user/${BUILDER_CENTER_CREATOR_ID}`
const BUILDER_CENTER_ARTICLE_URL = "https://api.builder.aws.com/cs/v2/articles"

type BuilderCenterArticle = {
  articleId?: string
  title?: string
  uri?: string
  description?: string
  heroImageUrl?: string
  status?: string
  createdAt?: number
  lastPublishedAt?: number
}

type BuilderCenterPost = {
  title: string
  url: string
  publishedAt: string
  excerpt: string | null
  imageUrl: string | null
  source: "builder-center"
}

// The article list has no body, so the first inline image comes from the article itself
async function fetchFirstImageUrl(articleId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${BUILDER_CENTER_ARTICLE_URL}?articleId=${encodeURIComponent(articleId)}`,
      { next: { revalidate: 1800 } }
    )
    if (!response.ok) return null

    const data = (await response.json()) as { markdownDescription?: string }
    const markdown = data.markdownDescription ?? ""

    const imageMatch =
      markdown.match(/<Image[^>]*url="([^"]+)"[^>]*>/i) ??
      markdown.match(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/)

    return imageMatch?.[1] ?? null
  } catch {
    return null
  }
}

export async function fetchBuilderCenterMetadata(signal?: AbortSignal) {
  const response = await fetch(BUILDER_CENTER_ARTICLES_URL, {
    next: { revalidate: 1800 },
    signal,
  })
  if (!response.ok) throw new Error("Builder Center feed unavailable")
  const data = (await response.json()) as { articles?: BuilderCenterArticle[] }
  return (data.articles ?? [])
    .filter((article) => article.status === "LIVE")
    .map((article) => {
      const timestamp = article.lastPublishedAt ?? article.createdAt
      return {
        articleId: article.articleId,
        title: article.title?.trim() ?? "",
        url: article.uri ? `${BUILDER_CENTER_URL}${article.uri}` : "",
        publishedAt: timestamp ? new Date(timestamp).toISOString() : "",
        excerpt: article.description?.trim().slice(0, 200) || null,
        imageUrl: article.heroImageUrl || null,
        source: "builder-center" as const,
      }
    })
    .filter((post) => post.title && post.url)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 10)
}

export async function fetchBuilderCenterPosts(): Promise<BuilderCenterPost[]> {
  const posts = await fetchBuilderCenterMetadata()
  return Promise.all(
    posts.map(async ({ articleId, ...post }) => ({
      ...post,
      imageUrl:
        post.imageUrl ||
        (articleId ? await fetchFirstImageUrl(articleId) : null),
    }))
  )
}
