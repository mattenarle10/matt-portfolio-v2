"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks"

export default function Certifications() {
  const isMobile = useIsMobile()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".cert-item")) {
        setIsActive(false)
      }
    }

    if (isMobile) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobile])

  const handleClick = () => {
    if (isMobile) {
      setIsActive(!isActive)
    }
  }

  return (
    <section className="mb-10">
      <h2 className="text-base font-medium mb-3 tracking-wide">
        Certifications
      </h2>
      <div className="space-y-2">
        <motion.div
          className="cert-item group relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            x: isMobile && isActive ? 2 : 0,
          }}
          whileHover={!isMobile ? { x: 2 } : undefined}
          onClick={handleClick}
        >
          <div
            className={`flex items-start justify-between gap-4 p-3 rounded-sm border border-black/[0.08] dark:border-black/[0.25] transition-all duration-300 ${(isMobile && isActive) || (!isMobile && "group-hover:border-black/[0.15] dark:group-hover:border-black/[0.35]") ? "border-black/[0.15] dark:border-black/[0.35]" : ""}`}
          >
            <div className="flex-1">
              <h3
                className={`text-sm font-medium transition-all duration-300 ${(isMobile && isActive) || (!isMobile && "group-hover:tracking-normal") ? "tracking-normal" : "tracking-tight"}`}
              >
                AWS Certified Cloud Practitioner
              </h3>
              <p className="text-xs opacity-60 mt-1">
                Amazon Web Services Training and Certification
              </p>
              <p className="text-[10px] opacity-50 mt-2">
                Issued: November 02, 2025 • Expires: November 02, 2028
              </p>
            </div>
            <a
              href="https://www.credly.com/badges/d70e4cfb-6e4e-4274-8e94-9d2e03c65871/public_url"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] opacity-60 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
              title="View Certification"
            >
              <svg
                className="w-4 h-4"
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
        </motion.div>
      </div>
    </section>
  )
}
