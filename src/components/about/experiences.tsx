"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const Experiences = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [activeExpIndex, setActiveExpIndex] = useState<number | null>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle click outside to reset active experience
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".experience-item")) {
        setActiveExpIndex(null)
      }
    }

    if (isMobile) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobile])

  // Handle experience click for mobile
  const handleExpClick = (index: number) => {
    if (isMobile) {
      setActiveExpIndex(activeExpIndex === index ? null : index)
    }
  }
  const experiences = [
    {
      company: "Junior Cloud Engineer",
      dates: "July 2025 - Present",
      location: "eCloudvalley Philippines, Hybrid",
      description:
        "Contributing to the development and deployment of cloud-based solutions in a collaborative team environment.",
    },
    {
      company: "Cloud Engineer Intern",
      dates: "April 2025 - May 2025",
      location: "eCloudvalley Philippines, Remote",
      description:
        "Gained hands-on experience with AWS services and cloud infrastructure through intensive training program.",
    },
    {
      company: "Software Engineer Intern",
      dates: "February 2025 - May 2025",
      location: "Spring Valley Tech Corp, Bago City",
      description:
        "Participated in immersive on-the-job training designed for real-world client project readiness.",
    },
    {
      company: "Freelance Software Developer",
      dates: "October 2022 - Present",
      location: "Various clients (Remote)",
      description:
        "Developed diverse projects for schools, students, and private clients, showcasing expertise in web and mobile development.",
    },
  ]

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-base font-medium mb-6 tracking-wide">Experience</h2>
      <div className="space-y-6 md:space-y-6 space-y-0">
        {experiences.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              x: isMobile && activeExpIndex === index ? 4 : 0,
            }}
            transition={{ delay: index * 0.1 }}
            className="experience-item group relative pl-6 md:pl-8"
            whileHover={!isMobile ? { x: 4 } : undefined}
            onClick={() => handleExpClick(index)}
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-0 top-1.5 w-2 h-2 rounded-full bg-black dark:bg-white transition-transform duration-300 ${(isMobile && activeExpIndex === index) || (!isMobile && "group-hover:scale-150") ? "scale-150" : ""}`}
            ></div>

            {/* Content */}
            <div className="pb-4">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                <h3
                  className={`font-medium text-sm transition-all duration-300 ${(isMobile && activeExpIndex === index) || (!isMobile && "group-hover:tracking-wide") ? "tracking-wide" : "tracking-tight"}`}
                >
                  {experience.company}
                </h3>
                <span className="text-xs font-light">{experience.dates}</span>
              </div>
              <div className="text-xs mb-2 font-light">
                <span>{experience.location}</span>
              </div>
              <div className="flex">
                <span
                  className={`mr-2 mt-1.5 rounded-full bg-black dark:bg-white transition-all duration-300 ${(isMobile && activeExpIndex === index) || (!isMobile && "group-hover:w-1.5 group-hover:h-1.5") ? "w-1.5 h-1.5" : "w-1 h-1"}`}
                ></span>
                <p
                  className={`text-xs font-light transition-opacity duration-300 ${(isMobile && activeExpIndex === index) || (!isMobile && "group-hover:opacity-100") ? "opacity-100" : "opacity-80"}`}
                >
                  {experience.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Experiences
