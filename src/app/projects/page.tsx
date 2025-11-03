"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { projectData } from "@/lib/data"
import type { Project } from "@/lib/project"

export default function Projects() {
  const [showAll, setShowAll] = useState(false)
  const [magnifyPosition, setMagnifyPosition] = useState({
    x: 0,
    y: 0,
    show: false,
  })
  const [activeImageSrc, setActiveImageSrc] = useState<string>("")
  const [isHoveringLink, setIsHoveringLink] = useState(false)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    show: boolean
    text: string
  }>({ x: 0, y: 0, show: false, text: "" })

  // Sort projects by date (newest first)
  const sortedProjects = [...projectData].sort((a, b) => {
    // Extract years for comparison
    const yearA = parseInt(a.date.match(/\d{4}/)![0], 10)
    const yearB = parseInt(b.date.match(/\d{4}/)![0], 10)

    // Sort by year descending
    return yearB - yearA
  })

  // Limit to 5 projects if not showing all
  const displayedProjects = showAll
    ? sortedProjects
    : sortedProjects.slice(0, 5)

  const handleMouseMove = (e: React.MouseEvent, imageSrc: string) => {
    if (isHoveringLink) return
    // Only show magnifying effect on desktop (768px and above)
    if (window.innerWidth < 768) return
    // Calculate position for the magnifying bubble
    setMagnifyPosition({
      x: e.clientX,
      y: e.clientY,
      show: true,
    })
    setActiveImageSrc(imageSrc)
  }

  const handleMouseLeave = () => {
    setMagnifyPosition((prev) => ({ ...prev, show: false }))
    setIsHoveringLink(false)
    setTooltip((prev) => ({ ...prev, show: false }))
  }

  const computeTooltipPosition = (e: React.MouseEvent, text?: string) => {
    const margin = 12
    const estimatedWidth = 160
    const estimatedHeight = 28
    const vw = window.innerWidth
    const vh = window.innerHeight

    let x = e.clientX + margin
    let y = e.clientY + margin

    // If overflowing right edge, place on the left side of the cursor
    if (x + estimatedWidth > vw - 8)
      x = Math.max(8, e.clientX - estimatedWidth - margin)
    // If overflowing bottom edge, place above the cursor
    if (y + estimatedHeight > vh - 8)
      y = Math.max(8, e.clientY - estimatedHeight - margin)

    return { x, y, text }
  }

  const showTooltip = (e: React.MouseEvent, text: string) => {
    setIsHoveringLink(true)
    const pos = computeTooltipPosition(e, text)
    setTooltip({ x: pos.x, y: pos.y, show: true, text: pos.text ?? text })
  }

  const updateTooltip = (e: React.MouseEvent) => {
    const pos = computeTooltipPosition(e)
    setTooltip((prev) => ({ ...prev, x: pos.x, y: pos.y }))
  }

  const hideTooltip = () => {
    setIsHoveringLink(false)
    setTooltip((prev) => ({ ...prev, show: false }))
  }

  const getDemoLabel = (href: string) => {
    try {
      const url = new URL(href)
      const host = url.hostname
      if (host.includes("sites.google.com") || host.includes("amplifyapp.com"))
        return "Open site"
      return "Open demo"
    } catch {
      return "Open demo"
    }
  }

  return (
    <div className="relative">
      {/* Magnifying bubble that follows cursor */}
      {magnifyPosition.show && !isHoveringLink && (
        <motion.div
          className="fixed w-32 h-32 rounded-full overflow-hidden pointer-events-none border border-black/[0.08] dark:border-black/[0.25] z-50 shadow-sm ring-0 outline-none"
          initial={{
            opacity: 0,
            scale: 0.8,
            x: magnifyPosition.x - 64,
            y: magnifyPosition.y - 64,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: magnifyPosition.x - 64, // Center the bubble on cursor
            y: magnifyPosition.y - 64, // Center the bubble on cursor
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="relative w-full h-full">
            <Image
              src={activeImageSrc}
              alt="Magnified preview"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        </motion.div>
      )}

      {/* Tooltip for action icons */}
      {tooltip.show && (
        <motion.div
          className="fixed z-50 pointer-events-none px-2 py-1 text-[10px] rounded-sm border border-black/[0.08] dark:border-black/[0.25] bg-white/80 dark:bg-black/60 backdrop-blur-sm shadow-sm whitespace-nowrap max-w-[200px] ring-0 outline-none"
          style={{ left: tooltip.x, top: tooltip.y }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.2,
          }}
        >
          {tooltip.text}
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-2xl md:text-2xl font-bold mb-1">Projects</h1>
        <p className="font-light mb-6">things I&apos;ve built</p>

        <div className="space-y-10">
          {displayedProjects.map((project: Project, index: number) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative md:cursor-zoom-in"
              whileHover={{ y: -1 }}
              onMouseMove={(e) => handleMouseMove(e, project.image)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Project card with hover effect */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image - larger on mobile, smaller on desktop */}
                <div className="relative w-full h-40 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-sm border border-black/[0.08] dark:border-black/[0.25] group-hover:border-black/[0.15] dark:group-hover:border-black/[0.35] transition-all duration-300 ring-0 outline-none">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-300"
                    sizes="(max-width: 768px) 100vw, 80px"
                  />
                </div>

                {/* Content */}
                <div className="w-full md:flex-1 relative">
                  {/* Links - positioned differently on mobile vs desktop */}
                  <div className="hidden md:flex absolute -top-1 right-0 gap-2">
                    {project.github &&
                      (Array.isArray(project.github) ? (
                        <div className="flex gap-1">
                          {project.github.map((link: string, i: number) => (
                            <Link
                              key={i}
                              href={link}
                              target="_blank"
                              className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                              onMouseEnter={(e) =>
                                showTooltip(e, "Open project in GitHub")
                              }
                              onMouseMove={updateTooltip}
                              onMouseLeave={hideTooltip}
                              title={`GitHub Repository ${i + 1}`}
                            >
                              <svg
                                className="w-3 h-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                              </svg>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          href={project.github}
                          target="_blank"
                          className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                          onMouseEnter={(e) =>
                            showTooltip(e, "Open project in GitHub")
                          }
                          onMouseMove={updateTooltip}
                          onMouseLeave={hideTooltip}
                          title="GitHub Repository"
                        >
                          <svg
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                          </svg>
                        </Link>
                      ))}

                    {project.demo && (
                      <Link
                        href={project.demo}
                        target="_blank"
                        className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onMouseEnter={(e) =>
                          showTooltip(e, getDemoLabel(project.demo as string))
                        }
                        onMouseMove={updateTooltip}
                        onMouseLeave={hideTooltip}
                        title="Live Demo"
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polygon points="10 8 16 12 10 16 10 8"></polygon>
                        </svg>
                      </Link>
                    )}

                    {project.pdf && (
                      <Link
                        href={project.pdf}
                        target="_blank"
                        className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onMouseEnter={(e) => showTooltip(e, "Open PDF")}
                        onMouseMove={updateTooltip}
                        onMouseLeave={hideTooltip}
                        title="PDF Document"
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </Link>
                    )}

                    {project.manual && (
                      <Link
                        href={project.manual}
                        target="_blank"
                        className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onMouseEnter={(e) => showTooltip(e, "Open manual")}
                        onMouseMove={updateTooltip}
                        onMouseLeave={hideTooltip}
                        title="Manual"
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                      </Link>
                    )}
                  </div>

                  {/* Title and date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h2 className="text-sm font-medium tracking-tight group-hover:tracking-normal transition-all duration-300">
                        {project.title}
                      </h2>
                      <span className="text-[10px] opacity-60">
                        {project.date}
                      </span>
                    </div>

                    {/* Mobile action links - shown on mobile only */}
                    <div className="flex md:hidden gap-2 flex-shrink-0">
                      {project.github &&
                        (Array.isArray(project.github) ? (
                          <div className="flex gap-1.5">
                            {project.github.map((link: string, i: number) => (
                              <Link
                                key={i}
                                href={link}
                                target="_blank"
                                className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                title={`GitHub Repository ${i + 1}`}
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link
                            href={project.github}
                            target="_blank"
                            className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            title="GitHub Repository"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                          </Link>
                        ))}

                      {project.demo && (
                        <Link
                          href={project.demo}
                          target="_blank"
                          className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                          title="Live Demo"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                          </svg>
                        </Link>
                      )}

                      {project.pdf && (
                        <Link
                          href={project.pdf}
                          target="_blank"
                          className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                          title="PDF Document"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </Link>
                      )}

                      {project.manual && (
                        <Link
                          href={project.manual}
                          target="_blank"
                          className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                          title="Manual"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>

                  <p className="text-xs mt-2 opacity-80 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="text-[10px] px-1.5 py-0.5 rounded-full ring-0 outline-none transition-colors border border-black/[0.12] dark:border-black/[0.36] group-hover:border-black/[0.20] dark:group-hover:border-black/[0.44] dark:bg-white/[0.04] dark:hover:bg-white/[0.07] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* See More / See Less button */}
      {projectData.length > 5 && (
        <div className="mt-12 flex justify-center">
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="text-xs border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-sm transition-all duration-300"
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
          >
            {showAll ? "See Less" : "See More"}
          </motion.button>
        </div>
      )}
    </div>
  )
}
