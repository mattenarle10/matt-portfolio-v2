"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { FadeIn } from "@/components/ui"
import { useMediumPosts } from "@/hooks"

const formatDate = (value: string) => {
  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  } catch {
    return ""
  }
}

export default function WritingPage() {
  const { posts, isLoading, error } = useMediumPosts()
  const hasPosts = posts.length > 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 transition-theme">
      <FadeIn delay={0} y={16} duration={0.5}>
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-black dark:text-white">
            Writing
          </h1>
          <p className="mt-1 text-sm font-light text-black/70 dark:text-white/70">
            Notes, ideas, and learnings.
          </p>
        </header>
      </FadeIn>

      <FadeIn delay={0.1} y={16} duration={0.5}>
        <section
          className="overflow-hidden rounded-md border border-black/[0.08] dark:border-white/[0.08]"
          style={{ background: "var(--color-background)" }}
        >
          <div className="p-3 md:p-4">
            {isLoading && (
              <ul className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-12 w-12 md:h-14 md:w-14 flex-shrink-0 rounded-sm bg-gray-100 dark:bg-black/80 animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 bg-gray-100 dark:bg-black/80 rounded-sm w-5/6 animate-pulse" />
                      <div className="h-3 bg-gray-100 dark:bg-black/80 rounded-sm w-2/6 animate-pulse" />
                      <div className="h-3 bg-gray-100 dark:bg-black/80 rounded-sm w-4/6 animate-pulse" />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {error && !isLoading && (
              <p className="text-xs text-gray-400 font-light">
                Couldn&apos;t load Medium posts right now.
              </p>
            )}

            {!isLoading && !error && hasPosts && (
              <ul className="space-y-1">
                {posts.map((post, index) => (
                  <motion.li
                    key={post.url}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-sm px-2 py-2.5 -mx-2 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors duration-200"
                    >
                      {post.imageUrl && (
                        <div className="h-12 w-12 md:h-14 md:w-14 flex-shrink-0 overflow-hidden rounded-sm border border-black/[0.08] dark:border-white/[0.10] bg-black/5">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-light text-black dark:text-white group-hover:underline group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                          {post.title}
                        </p>
                        <p className="mt-0.5 text-[11px] md:text-xs text-black/60 dark:text-white/60">
                          {formatDate(post.publishedAt)}
                        </p>
                        {post.excerpt && (
                          <p className="mt-1 text-xs md:text-sm font-light text-black/70 dark:text-white/70 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </a>
                  </motion.li>
                ))}
              </ul>
            )}

            {!isLoading && !error && !hasPosts && (
              <p className="text-xs text-gray-400 font-light">
                No Medium posts found.
              </p>
            )}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.2} y={16} duration={0.5}>
        <div className="mt-4 md:mt-6 flex justify-end">
          <a
            href="https://medium.com/@mattenarle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-black/70 dark:text-white/70 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-sm transition-all duration-200 ease-out hover:translate-x-0.5"
          >
            Read more on Medium
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </FadeIn>
    </div>
  )
}
