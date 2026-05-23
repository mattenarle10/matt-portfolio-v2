"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks"

const Education = () => {
  const isMobile = useIsMobile()
  const [activeEduIndex, setActiveEduIndex] = useState<number | null>(null)

  // Handle click outside to reset active education item
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".education-item")) {
        setActiveEduIndex(null)
      }
    }

    if (isMobile) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobile])

  // Handle education item click for mobile
  const handleEduClick = (index: number) => {
    if (isMobile) {
      setActiveEduIndex(activeEduIndex === index ? null : index)
    }
  }
  const education = [
    {
      school: "University of St. La Salle",
      degree: "Master of Business Administration (MBA), student",
      date: "In progress",
      details: "with Thesis",
    },
    {
      school: "West Visayas State University",
      degree: "Bachelor's degree, Computer Science",
      date: "2021 - 2025",
      details: "Grade: 1.34 (Magna Cum Laude)",
    },
    {
      school: "University of St. La Salle",
      degree: "High School Diploma",
      date: "2008 - 2020",
      details: "That fun, High-School Life",
    },
  ]

  return (
    <div className="mt-12 mb-12">
      <h2 className="text-base font-medium mb-4 tracking-wide">Education</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {education.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              x: isMobile && activeEduIndex === index ? 2 : 0,
            }}
            transition={{ delay: index * 0.1 }}
            className="education-item group"
            whileHover={!isMobile ? { x: 2 } : undefined}
            onClick={() => handleEduClick(index)}
          >
            <div className="p-3 md:p-4 rounded-sm border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.10] dark:hover:border-white/[0.10] transition-all duration-300">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  className={`text-xs md:text-sm font-light transition-all duration-300 ${(isMobile && activeEduIndex === index) || (!isMobile && "group-hover:tracking-normal") ? "tracking-normal" : "tracking-tight"}`}
                >
                  {item.school}
                </h3>
                <span className="text-[9px] md:text-[10px] opacity-60 font-light whitespace-nowrap">
                  {item.date}
                </span>
              </div>
              <p className="text-[10px] md:text-xs font-light opacity-70 mb-1">
                {item.degree}
              </p>
              <p
                className={`text-[10px] md:text-xs font-light leading-relaxed transition-opacity duration-300 ${(isMobile && activeEduIndex === index) || (!isMobile && "group-hover:opacity-100") ? "opacity-100" : "opacity-60"}`}
              >
                {item.details}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Education
