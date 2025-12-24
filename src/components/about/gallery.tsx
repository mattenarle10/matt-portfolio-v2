"use client"

import { motion, useMotionValue } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks"

const Gallery = () => {
  const isMobile = useIsMobile()
  const scrollRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)

  const images = [
    {
      src: "/about/matt-grad.png",
      alt: "Matt at graduation",
      description: "Graduation day",
    },
    {
      src: "/about/matt-heart.png",
      alt: "Matt with Heart",
      description: "Quality time",
    },
    {
      src: "/about/matt-run.png",
      alt: "Matt running",
      description: "Finding peace",
    },
    {
      src: "/about/matt-work.png",
      alt: "Matt at work",
      description: "Making a difference",
    },
  ]

  // Duplicate images for infinite scroll effect
  const duplicatedImages = [...images, ...images, ...images]

  // Auto-scroll effect - moves to the right, stops on hover
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current
      let animationFrameId: number
      let isHovered = false

      const scroll = () => {
        if (scrollContainer && !isHovered) {
          const maxScroll =
            scrollContainer.scrollWidth - scrollContainer.clientWidth
          const currentScroll = scrollContainer.scrollLeft

          // Reset to beginning when reaching the end for infinite effect
          if (currentScroll >= maxScroll / 2) {
            scrollContainer.scrollLeft = 0
          } else {
            scrollContainer.scrollLeft += 0.5
          }
        }
        animationFrameId = requestAnimationFrame(scroll)
      }

      const handleMouseEnter = () => {
        isHovered = true
      }

      const handleMouseLeave = () => {
        isHovered = false
      }

      animationFrameId = requestAnimationFrame(scroll)

      scrollContainer.addEventListener("mouseenter", handleMouseEnter)
      scrollContainer.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        cancelAnimationFrame(animationFrameId)
        scrollContainer.removeEventListener("mouseenter", handleMouseEnter)
        scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className="my-6 mb-10">
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 overflow-x-auto pb-3 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {duplicatedImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex-shrink-0 group cursor-pointer"
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="relative w-[140px] h-[180px] md:w-[160px] md:h-[200px] rounded-md overflow-hidden border border-black/[0.08] dark:border-black/[0.25] group-hover:border-black/[0.15] dark:group-hover:border-black/[0.35] transition-all duration-300">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 140px, 160px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                <p className="text-white text-[10px] font-light">
                  {image.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Gallery
