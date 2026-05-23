import { NextResponse } from "next/server"
import { fetchStats } from "@/lib/github"

// Cache per (owner/repo) query for 1 hr — keeps us under GitHub's 60 req/hr unauth limit.
export const revalidate = 3600

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const repoParam = searchParams.get("repo") ?? ""
  const [owner, repo] = repoParam.split("/")
  if (!owner || !repo) {
    return NextResponse.json({ error: "missing repo" }, { status: 400 })
  }
  const stats = await fetchStats(owner, repo)
  if (!stats) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }
  return NextResponse.json(stats)
}
