import { NextResponse } from "next/server"
import { contributionSchema } from "@/lib/contributions"

export async function GET() {
  try {
    // Public data from the API maintained by React GitHub Calendar's author.
    const response = await fetch(
      "https://github-contributions-api.jogruber.de/v4/mattenarle10?y=last",
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) }
    )
    if (!response.ok) throw new Error("GitHub activity unavailable")
    const data = contributionSchema.parse(await response.json())
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "GitHub activity is unavailable right now." },
      { status: 503 }
    )
  }
}
