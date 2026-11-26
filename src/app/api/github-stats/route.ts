import { NextResponse } from "next/server"
import { projectData } from "@/constants/projects"
import { fetchStats, parseRepo } from "@/lib/github"

// Cache per (owner/repo) query for 1 hr — keeps us under GitHub's 60 req/hr unauth limit.
export const revalidate = 3600

const publicRepos = projectData.flatMap((project) => {
  if (!project.github) return []
  const repo = parseRepo(project.github)
  return repo ? [repo] : []
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const repoParam = searchParams.get("repo") ?? ""
  if (!repoParam) {
    return NextResponse.json({ error: "missing repo" }, { status: 400 })
  }
  const projectRepo = publicRepos.find(
    ({ owner, repo }) => `${owner}/${repo}` === repoParam
  )
  if (!projectRepo) {
    return NextResponse.json(
      { error: "Unknown portfolio repository" },
      { status: 404 }
    )
  }
  const stats = await fetchStats(projectRepo.owner, projectRepo.repo)
  if (!stats) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }
  return NextResponse.json(stats)
}
