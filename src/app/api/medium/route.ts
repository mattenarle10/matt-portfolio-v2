import { NextResponse } from "next/server"
import { fetchMediumPosts } from "@/lib/medium"

export const revalidate = 1800

export async function GET() {
  try {
    return NextResponse.json(await fetchMediumPosts())
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Medium feed" },
      { status: 500 }
    )
  }
}
