"use client"

import { animate, useMotionValue } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useMediumPosts } from "@/hooks"

const MEDIUM_RSS_CAP = 10

function AnimatedCount({ value }: { value: number }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
    // mv is a stable framer-motion ref; only `value` should trigger re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <>{display}</>
}

const RecentMediumPosts = () => {
  const { posts, total, isLoading, error } = useMediumPosts(3)

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
        <h2 className="text-base md:text-lg font-light text-black dark:text-white flex items-center gap-2">
          Writing
          {!isLoading && !error && hasPosts && (
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-black/30 dark:bg-white/30 animate-pulse"
            />
          )}
        </h2>
        {!isLoading && !error && hasPosts && (
          <Link
            href="/writing"
            className="text-xs text-black dark:text-white/70 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-sm transition-all duration-200 ease-out hover:translate-x-0.5"
          >
            See all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      <div
        data-pet-anchor
        className="overflow-hidden rounded-md border border-black/[0.08] dark:border-white/[0.08]"
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
            <>
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
                        <div className="h-10 w-10 md:h-11 md:w-11 flex-shrink-0 overflow-hidden rounded-sm border border-black/[0.08] dark:border-white/[0.10] bg-black/5">
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
                        <p className="text-sm md:text-base font-light text-black dark:text-white truncate group-hover:underline group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
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

              <Link
                href="/writing"
                className="group mt-2 -mx-2.5 md:-mx-3 -mb-2.5 md:-mb-3 px-2.5 md:px-3 py-2 flex items-center justify-center gap-1.5 border-t border-black/[0.06] dark:border-white/[0.06] text-xs font-light text-black/70 dark:text-white/70 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 transition-colors duration-200"
              >
                <span>View all</span>
                <span className="font-mono tabular-nums">
                  <AnimatedCount value={total} />
                  {total >= MEDIUM_RSS_CAP && "+"}
                </span>
                <span>articles</span>
                <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
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
