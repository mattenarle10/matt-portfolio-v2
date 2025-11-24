import { NextResponse } from "next/server"

const MEDIUM_FEED_URL = "https://medium.com/feed/@mattenarle"

type MediumPost = {
  title: string
  url: string
  publishedAt: string
  excerpt: string | null
  imageUrl: string | null
}

export const revalidate = 1800

function extractTag(content: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i")
  const match = content.match(regex)
  if (!match || match.length < 2) return null
  return match[1].trim()
}

function stripCdata(value: string | null): string {
  if (!value) return ""
  return value.replace("<![CDATA[", "").replace("]]>", "").trim()
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function extractImageUrl(itemXml: string, htmlSource: string): string | null {
  const mediaMatch = itemXml.match(
    /<media:(?:thumbnail|content)[^>]*url="([^"]+)"[^>]*>/i
  )
  if (mediaMatch && mediaMatch[1]) {
    return mediaMatch[1]
  }

  const imgMatch = htmlSource.match(/<img[^>]*src="([^"]+)"[^>]*>/i)
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1]
  }

  const dataSrcMatch = htmlSource.match(/<img[^>]*data-src="([^"]+)"[^>]*>/i)
  if (dataSrcMatch && dataSrcMatch[1]) {
    return dataSrcMatch[1]
  }

  return null
}

function parseMediumFeed(xml: string): MediumPost[] {
  const segments = xml.split("<item>").slice(1)
  const posts: MediumPost[] = segments.map((segment) => {
    const item = segment.split("</item>")[0]

    const rawTitle = extractTag(item, "title")
    const rawLink = extractTag(item, "link")
    const rawPubDate = extractTag(item, "pubDate")
    const rawDescription = extractTag(item, "description")
    const rawContent = extractTag(item, "content:encoded")

    const title = stripCdata(rawTitle)
    const url = stripCdata(rawLink)
    const publishedAt = stripCdata(rawPubDate)

    const contentForExcerptSource = stripCdata(
      rawDescription || rawContent || ""
    )
    const cleanedDescription = stripHtml(contentForExcerptSource)
    const excerpt = cleanedDescription ? cleanedDescription.slice(0, 200) : null

    const htmlForImage = stripCdata(rawContent || rawDescription || "")
    const imageUrl = extractImageUrl(item, htmlForImage)

    return {
      title,
      url,
      publishedAt,
      excerpt,
      imageUrl,
    }
  })

  const validPosts = posts.filter((post) => post.title && post.url)

  validPosts.sort((a, b) => {
    const aTime = new Date(a.publishedAt).getTime()
    const bTime = new Date(b.publishedAt).getTime()
    return bTime - aTime
  })

  return validPosts.slice(0, 5)
}

export async function GET() {
  try {
    const response = await fetch(MEDIUM_FEED_URL, {
      next: { revalidate: 1800 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch Medium feed: ${response.status}` },
        { status: 500 }
      )
    }

    const xml = await response.text()
    const posts = parseMediumFeed(xml)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error in Medium feed API:", error)
    return NextResponse.json(
      { error: "Failed to fetch Medium feed" },
      { status: 500 }
    )
  }
}
