"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { CodeIcon, CoffeeIcon, FitnessIcon, YoutubeIcon } from "@/styles/icons"

const Hobbies = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [activeHobbyIndex, setActiveHobbyIndex] = useState<number | null>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle click outside to reset active hobby
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".hobby-item")) {
        setActiveHobbyIndex(null)
      }
    }

    if (isMobile) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobile])

  // Handle hobby click for mobile
  const handleHobbyClick = (index: number) => {
    if (isMobile) {
      setActiveHobbyIndex(activeHobbyIndex === index ? null : index)
    }
  }
  const hobbies = [
    {
      title: "Brain-Rot",
      description:
        "YouTube fitness gurus 💪, Netflix tech docs 📺, and K-drama marathons 🇰🇷",
      icon: <YoutubeIcon className="text-red-500" />,
      iconColor: "text-red-500",
    },
    {
      title: "Hybrid Training!",
      description:
        "Crushing PRs with running 🏃‍♂️ + strength training combos 🏋️‍♂️",
      icon: <FitnessIcon className="text-blue-500" />,
      iconColor: "text-blue-500",
    },
    {
      title: "Shipping Code (trying)",
      description:
        "Building slick web/mobile apps with React ⚛️ & Next.js magic ✨",
      icon: <CodeIcon className="text-green-500" />,
      iconColor: "text-green-500",
    },
    {
      title: "Caffeine Explorer",
      description:
        "Hunting for the perfect matcha latte 🍵 and pour-over coffee ☕",
      icon: <CoffeeIcon className="text-amber-500" />,
      iconColor: "text-amber-500",
    },
  ]

  return (
    <div className="mt-12 mb-12">
      <h2 className="text-base font-medium mb-6 tracking-wide">Hobbies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hobbies.map((hobby, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: isMobile && activeHobbyIndex === index ? 1.02 : 1,
              x: isMobile && activeHobbyIndex === index ? 2 : 0,
            }}
            transition={{ delay: index * 0.1 }}
            className="hobby-item group relative pl-8"
            whileHover={!isMobile ? { scale: 1.02, x: 2 } : undefined}
            onClick={() => handleHobbyClick(index)}
          >
            {/* Icon */}
            <div
              className={`absolute left-0 top-0.5 transition-transform duration-300 ${(isMobile && activeHobbyIndex === index) || (!isMobile && "group-hover:scale-110")}`}
            >
              {hobby.icon}
            </div>

            {/* Content */}
            <div>
              <h3
                className={`font-medium text-sm transition-colors duration-300 ${(isMobile && activeHobbyIndex === index) || (!isMobile && "group-hover:") ? hobby.iconColor : ""}`}
              >
                {hobby.title}
              </h3>
              <p
                className={`text-xs font-light mt-1 transition-all duration-300 ${(isMobile && activeHobbyIndex === index) || (!isMobile && "group-hover:opacity-100") ? "opacity-100" : "opacity-80"}`}
              >
                {hobby.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Hobbies
