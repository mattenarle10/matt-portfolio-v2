import { NextResponse } from "next/server"
import { fetchBuilderCenterPosts } from "@/lib/builder-center"

export const revalidate = 1800

export async function GET() {
  try {
    return NextResponse.json(await fetchBuilderCenterPosts())
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Builder Center posts" },
      { status: 500 }
    )
  }
}
