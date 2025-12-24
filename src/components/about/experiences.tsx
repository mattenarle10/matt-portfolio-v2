"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks"

const Experiences = () => {
  const isMobile = useIsMobile()
  const [activeExpIndex, setActiveExpIndex] = useState<number | null>(null)

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
        "Gained hands-on experience with AWS services and cloud infrastructure through an intensive training program; Top Cloud Intern and Best Group Project.",
    },
    {
      company: "Software Engineer Intern",
      dates: "February 2025 - May 2025",
      location: "Spring Valley Tech Corp, Bago City",
      description:
        "Participated in immersive on-the-job training designed for real-world client project readiness; Most awarded intern (Top Geek, OJT Excellence).",
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
    <div className="mt-16 mb-12">
      <h2 className="text-base font-medium mb-4 tracking-wide">Experience</h2>
      <div className="space-y-4 md:space-y-5">
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
            <div className="pb-2">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-0.5">
                <h3
                  className={`font-light text-xs md:text-sm transition-all duration-300 ${(isMobile && activeExpIndex === index) || (!isMobile && "group-hover:tracking-normal") ? "tracking-normal" : "tracking-tight"}`}
                >
                  {experience.company}
                </h3>
                <span className="text-[10px] md:text-[11px] font-light opacity-70">{experience.dates}</span>
              </div>
              <div className="text-[10px] md:text-xs mb-1 font-light opacity-60">
                <span>{experience.location}</span>
              </div>
              <div className="flex">
                <span
                  className={`mr-2 mt-1 rounded-full bg-black dark:bg-white transition-all duration-300 ${(isMobile && activeExpIndex === index) || (!isMobile && "group-hover:w-1 group-hover:h-1") ? "w-1 h-1" : "w-0.5 h-0.5"}`}
                ></span>
                <p
                  className={`text-[11px] md:text-xs font-light leading-relaxed transition-opacity duration-300 ${(isMobile && activeExpIndex === index) || (!isMobile && "group-hover:opacity-100") ? "opacity-100" : "opacity-70"}`}
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
