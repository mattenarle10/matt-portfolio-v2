"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { TiltCard } from "@/components/ui/tilt-card"
import { useIsMobile } from "@/hooks"

type VolunteerRole = {
  title: string
  organization: string
  period: string
  image: string
  url: string
}

const volunteering: VolunteerRole[] = [
  {
    title: "AWS Community Builder",
    organization: "Amazon Web Services",
    period: "Mar 2026 - Present",
    image: "/about/aws-community-builder.png",
    url: "https://aws.amazon.com/developer/community/community-builders/",
  },
  {
    title: "Founder",
    organization: "BetterBacolod.org",
    period: "Jan 2026 - Present",
    image: "/about/betterbacolod.png",
    url: "https://betterbacolod.org",
  },
]

export default function Volunteering() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".volunteer-item")) {
        setActiveIndex(null)
      }
    }

    if (isMobile) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobile])

  const handleClick = (index: number) => {
    if (isMobile) {
      setActiveIndex(activeIndex === index ? null : index)
    }
  }

  return (
    <section className="mb-10">
      <h2 className="text-base font-medium mb-4 tracking-wide">Volunteering</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {volunteering.map((role, index) => {
          const isActive = isMobile && activeIndex === index
          return (
            <motion.div
              key={role.title}
              className="volunteer-item group relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                x: isActive ? 2 : 0,
              }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleClick(index)}
            >
              <TiltCard className="surface-card about-card flex items-center gap-3 p-4">
                <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0">
                  <Image
                    src={role.image}
                    alt={role.title}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-light transition-all duration-300 ${isActive || (!isMobile && "group-hover:tracking-normal") ? "tracking-normal" : "tracking-tight"}`}
                      >
                        {role.title}
                      </h3>
                      <p className="text-xs opacity-60 mt-0.5 font-light">
                        {role.organization}
                      </p>
                    </div>
                    <a
                      href={role.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="icon-button text-neutral-500 dark:text-neutral-400 shrink-0"
                      title="Open link"
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
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15,3 21,3 21,9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                  <p className="text-[10px] opacity-50 font-light mt-1">
                    {role.period}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
