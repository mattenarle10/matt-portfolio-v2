import { NextResponse } from "next/server"

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

export const revalidate = 1800

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

async function parseBuilderCenterArticles(
  articles: BuilderCenterArticle[]
): Promise<BuilderCenterPost[]> {
  const posts: BuilderCenterPost[] = await Promise.all(
    articles
      .filter((article) => article.status === "LIVE")
      .slice(0, 10)
      .map(async (article): Promise<BuilderCenterPost> => {
        const timestamp = article.lastPublishedAt ?? article.createdAt
        const description = article.description?.trim()
        const imageUrl =
          article.heroImageUrl ||
          (article.articleId
            ? await fetchFirstImageUrl(article.articleId)
            : null)

        return {
          title: article.title?.trim() ?? "",
          url: article.uri ? `${BUILDER_CENTER_URL}${article.uri}` : "",
          publishedAt: timestamp ? new Date(timestamp).toISOString() : "",
          excerpt: description ? description.slice(0, 200) : null,
          imageUrl,
          source: "builder-center",
        }
      })
  )

  const validPosts = posts.filter((post) => post.title && post.url)

  validPosts.sort((a, b) => {
    const aTime = new Date(a.publishedAt).getTime()
    const bTime = new Date(b.publishedAt).getTime()
    return bTime - aTime
  })

  return validPosts.slice(0, 10)
}

export async function GET() {
  try {
    const response = await fetch(BUILDER_CENTER_ARTICLES_URL, {
      next: { revalidate: 1800 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch Builder Center posts: ${response.status}` },
        { status: 500 }
      )
    }

    const data = (await response.json()) as {
      articles?: BuilderCenterArticle[]
    }
    const posts = await parseBuilderCenterArticles(data.articles ?? [])

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error in Builder Center API:", error)
    return NextResponse.json(
      { error: "Failed to fetch Builder Center posts" },
      { status: 500 }
    )
  }
}
