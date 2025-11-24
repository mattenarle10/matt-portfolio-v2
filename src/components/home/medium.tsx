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

  const hasPosts = posts.length > 0
  const [featuredPost, ...secondaryPosts] = posts

  return (
    <section>
      <div
        className="overflow-hidden rounded-md border border-black/10 dark:border-black/20 shadow-sm"
        style={{ background: "var(--color-background)" }}
      >
        <div className="p-2.5 md:p-3">
          <div className="mb-1.5 md:mb-2 flex items-center justify-between">
            <h2 className="text-base md:text-lg font-light text-black dark:text-white">
              Writing
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

          {!isLoading && !error && hasPosts && featuredPost && (
            <div className="mt-1 grid gap-1.5 md:gap-3 md:grid-cols-2">
              <a
                href={featuredPost.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row gap-2.5 md:gap-3 rounded-sm px-1.5 py-1.5 -mx-1.5 hover:bg-white/95 dark:hover:bg-black/70 transition-all duration-200 outline-none focus:outline-none focus:ring-0"
              >
                {featuredPost.imageUrl && (
                  <div className="h-20 w-full md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-sm border border-black/10 dark:border-black/30 bg-black/5">
                    <img
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-light text-black dark:text-white line-clamp-2 group-hover:underline group-hover:translate-x-0.5 transition-transform duration-150">
                    {featuredPost.title}
                  </p>
                  <p className="mt-0.5 text-[11px] md:text-xs text-black/60 dark:text-white/60">
                    {formatDate(featuredPost.publishedAt)}
                  </p>
                  {featuredPost.excerpt && (
                    <p className="mt-0.5 text-[11px] md:text-xs text-black/60 dark:text-white/60 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  )}
                </div>
              </a>

              {secondaryPosts.length > 0 && (
                <div className="flex flex-col gap-1.5 md:gap-2">
                  {secondaryPosts.map((post) => (
                    <a
                      key={post.url}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2.5 rounded-sm px-1.5 py-1.5 -mx-1.5 hover:bg-white/95 dark:hover:bg-black/70 transition-all duration-200 outline-none focus:outline-none focus:ring-0"
                    >
                      {post.imageUrl && (
                        <div className="h-10 w-10 md:h-11 md:w-11 flex-shrink-0 overflow-hidden rounded-sm border border-black/10 dark:border-black/30 bg-black/5">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-light text-black dark:text-white truncate group-hover:underline group-hover:translate-x-0.5 transition-transform duration-150">
                          {post.title}
                        </p>
                        <p className="mt-0.5 text-[11px] md:text-xs text-black/60 dark:text-white/60">
                          {formatDate(post.publishedAt)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
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
