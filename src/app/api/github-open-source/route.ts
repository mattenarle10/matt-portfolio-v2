import { NextResponse } from "next/server"
import { fetchOpenSourceContributions } from "@/lib/open-source"

export async function GET() {
  try {
    const data = await fetchOpenSourceContributions()
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Open source contributions are unavailable right now." },
      { status: 503 }
    )
  }
}
