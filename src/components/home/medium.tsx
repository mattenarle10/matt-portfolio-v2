"use client"

import { ArrowUpRight } from "lucide-react"
import { useMediumPosts } from "@/app/api/medium/useMediumPosts"

const RecentMediumPosts = () => {
  const { posts, isLoading, error } = useMediumPosts(3)

  const formatDate = (value: string) => {
    try {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return ""
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date)
    } catch {
      return ""
    }
  }

  return (
    <section>
      <div className="mb-2 md:mb-3 flex items-center justify-between">
        <h2 className="text-base md:text-lg font-light text-black dark:text-white">
          Recent on Medium
        </h2>
        <a
          href="https://medium.com/@mattenarle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-black dark:text-white/70 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 outline-none focus:outline-none focus:ring-0"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>

      {isLoading && (
        <div className="space-y-1.5 md:space-y-2">
          <div className="h-4 bg-gray-100 dark:bg-black/80 rounded-sm w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-100 dark:bg-black/80 rounded-sm w-4/6 animate-pulse" />
          <div className="h-4 bg-gray-100 dark:bg-black/80 rounded-sm w-3/6 animate-pulse" />
        </div>
      )}

      {error && !isLoading && (
        <p className="text-xs text-gray-400 font-light mt-1">
          Couldn&apos;t load Medium posts right now.
        </p>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <ul className="space-y-1.5 md:space-y-2 mt-1">
          {posts.map((post) => (
            <li key={post.url}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-1.5 px-1 -mx-1 rounded-sm border-b border-black/10 dark:border-black/40 hover:border-black/30 dark:hover:border-black/60 transition-all duration-200 outline-none focus:outline-none focus:ring-0"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm md:text-base font-light text-black dark:text-white truncate group-hover:underline group-hover:translate-x-0.5 transition-transform duration-150">
                    {post.title}
                  </p>
                  <span className="text-[10px] text-black/60 dark:text-white/60 whitespace-nowrap">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                {post.excerpt && (
                  <p className="mt-0.5 text-[11px] md:text-xs text-black/60 dark:text-white/60">
                    {post.excerpt}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <p className="text-xs text-gray-400 font-light mt-1">
          No Medium posts found.
        </p>
      )}
    </section>
  )
}

export default RecentMediumPosts
