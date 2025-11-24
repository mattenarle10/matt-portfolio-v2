"use client"

import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
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

  const hasPosts = posts.length > 0

  return (
    <section>
      <div className="mb-2 md:mb-3 flex items-center justify-between">
        <h2 className="text-base md:text-lg font-light text-black dark:text-white">
          Writing
        </h2>
        <a
          href="https://medium.com/@mattenarle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-black dark:text-white/70 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 outline-none focus:outline-none focus:ring-0"
        >
          View on Medium
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>

      <div
        className="overflow-hidden rounded-md border border-black/10 dark:border-black/20"
        style={{ background: "var(--color-background)" }}
      >
        <div className="p-2.5 md:p-3">
          {isLoading && (
            <div className="space-y-1.5 md:space-y-2 mt-1">
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

          {!isLoading && !error && hasPosts && (
            <ul className="mt-1 space-y-1.5 md:space-y-2">
              {posts.map((post) => (
                <li key={post.url}>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2.5 rounded-sm px-1.5 py-1.5 -mx-1.5 outline-none focus:outline-none focus:ring-0"
                  >
                    {post.imageUrl && (
                      <div className="h-10 w-10 md:h-11 md:w-11 flex-shrink-0 overflow-hidden rounded-sm border border-black/10 dark:border-black/30 bg-black/5">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-light text-black dark:text-white truncate group-hover:underline group-hover:translate-x-0.5 transition-transform duration-150">
                        {post.title}
                      </p>
                      <p className="mt-0.5 text-[11px] md:text-xs text-black dark:text-white/70">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && !error && !hasPosts && (
            <p className="text-xs text-gray-400 font-light mt-1">
              No Medium posts found.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default RecentMediumPosts
