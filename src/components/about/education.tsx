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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="education-item group relative pl-4 border-l border-gray-200 dark:border-gray-800"
            whileHover={!isMobile ? { x: 2 } : undefined}
            onClick={() => handleEduClick(index)}
          >
            <div
              className={`absolute -left-1 top-1 w-2 h-2 rounded-full bg-black dark:bg-white transition-transform duration-300 ${(isMobile && activeEduIndex === index) || (!isMobile && "group-hover:scale-125") ? "scale-125" : ""}`}
            ></div>

            <h3
              className={`text-xs md:text-sm font-light transition-all duration-300 ${(isMobile && activeEduIndex === index) || (!isMobile && "group-hover:tracking-normal") ? "tracking-normal" : "tracking-tight"}`}
            >
              {item.school}
            </h3>
            <div className="flex items-center space-x-1 mt-0.5">
              <p className="text-[10px] md:text-xs font-light opacity-80">
                {item.degree}
              </p>
              <span className="text-[10px] md:text-xs opacity-50">•</span>
              <p className="text-[10px] md:text-xs opacity-70 font-light">
                {item.date}
              </p>
            </div>
            <p
              className={`text-[11px] md:text-xs mt-1 leading-relaxed font-light transition-opacity duration-300 ${(isMobile && activeEduIndex === index) || (!isMobile && "group-hover:opacity-100") ? "opacity-100" : "opacity-70"}`}
            >
              {item.details}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Education
