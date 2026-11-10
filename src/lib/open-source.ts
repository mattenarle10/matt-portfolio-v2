import { z } from "zod"

const author = "mattenarle10"
const organizations = [
  "aws",
  "awslabs",
  "aws-amplify",
  "aws-ia",
  "aws-samples",
  "awsdocs",
]
const query = `author:${author} is:pr is:public (${organizations.map((org) => `org:${org}`).join(" OR ")})`

export const openSourceSearchUrl = `https://github.com/search?${new URLSearchParams({ q: query, type: "pullrequests" })}`

export const openSourceSchema = z.object({
  contributions: z
    .array(
      z.object({
        repository: z.string(),
        number: z.number().int().positive(),
        title: z.string(),
        url: z.url(),
        status: z.enum(["merged", "open", "draft", "closed"]),
      })
    )
    .max(3),
})

export type OpenSourceContribution = z.infer<
  typeof openSourceSchema
>["contributions"][number]

const searchSchema = z.object({
  items: z.array(
    z.object({
      number: z.number().int().positive(),
      repository_url: z.url(),
      user: z.object({ login: z.string() }),
      title: z.string(),
      state: z.enum(["open", "closed"]),
      draft: z.boolean(),
      pull_request: z.object({ merged_at: z.iso.datetime().nullable() }),
    })
  ),
})

export async function fetchOpenSourceContributions() {
  const options = {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(12000),
  }
  const params = new URLSearchParams({
    q: query,
    sort: "updated",
    order: "desc",
    per_page: "3",
    advanced_search: "true",
  })
  const response = await fetch(
    `https://api.github.com/search/issues?${params}`,
    options
  )
  if (!response.ok) throw new Error("Open source activity unavailable")
  const { items } = searchSchema.parse(await response.json())

  const contributions = items.slice(0, 3).map((item) => {
    const repositoryUrl = new URL(item.repository_url)
    const [, prefix, organization, name] = repositoryUrl.pathname.split("/")
    if (
      repositoryUrl.origin !== "https://api.github.com" ||
      prefix !== "repos" ||
      !organizations.includes(organization) ||
      !name ||
      item.user.login.toLowerCase() !== author
    )
      throw new Error("Unexpected contribution source")

    const repository = `${organization}/${name}`
    return {
      repository,
      number: item.number,
      title: item.title,
      url: `https://github.com/${repository}/pull/${item.number}`,
      status: item.pull_request.merged_at
        ? "merged"
        : item.state === "closed"
          ? "closed"
          : item.draft
            ? "draft"
            : "open",
    }
  })
  return openSourceSchema.parse({ contributions })
}
