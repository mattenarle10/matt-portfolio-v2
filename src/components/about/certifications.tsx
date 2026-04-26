"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks"

type Certification = {
  title: string
  issuer: string
  period: string
  image: string
  url: string
}

const certifications: Certification[] = [
  {
    title: "AWS Community Builder",
    issuer: "Amazon Web Services",
    period: "Mar 2026 - Present",
    image: "/about/aws-community-builder.png",
    url: "https://aws.amazon.com/developer/community/community-builders/",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    period: "Issued: Nov 2025 • Expires: Nov 2028",
    image: "/about/aws-cloud-practitioner.png",
    url: "https://www.credly.com/badges/d70e4cfb-6e4e-4274-8e94-9d2e03c65871/public_url",
  },
]

export default function Certifications() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".cert-item")) {
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
      <h2 className="text-base font-medium mb-4 tracking-wide">
        Certifications
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {certifications.map((cert, index) => {
          const isActive = isMobile && activeIndex === index
          return (
            <motion.div
              key={cert.title}
              className="cert-item group relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                x: isActive ? 2 : 0,
              }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isMobile ? { x: 2 } : undefined}
              onClick={() => handleClick(index)}
            >
              <div
                data-pet-anchor
                className={`flex items-center gap-3 p-3 md:p-4 rounded-sm border border-black/[0.08] dark:border-black/[0.25] transition-all duration-300 h-full ${isActive || (!isMobile && "group-hover:border-black/[0.15] dark:group-hover:border-black/[0.35]") ? "border-black/[0.15] dark:border-black/[0.35]" : ""}`}
              >
                <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-xs md:text-sm font-light transition-all duration-300 ${isActive || (!isMobile && "group-hover:tracking-normal") ? "tracking-normal" : "tracking-tight"}`}
                      >
                        {cert.title}
                      </h3>
                      <p className="text-[10px] md:text-xs opacity-60 mt-0.5 font-light">
                        {cert.issuer}
                      </p>
                    </div>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                      title="View Certification"
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
                    {cert.period}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
