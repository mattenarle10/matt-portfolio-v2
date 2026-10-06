"use client"

import { useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"
import { TiltCard } from "@/components/ui/tilt-card"

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

export default function Gallery() {
  const scroller = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  function scroll(direction: number) {
    scroller.current?.scrollBy({
      left: direction * scroller.current.clientWidth * 0.7,
      behavior: reducedMotion ? "instant" : "smooth",
    })
  }

  return (
    <section className="my-7 mb-10" aria-label="A few moments from my life">
      <div ref={scroller} className="gallery-grid">
        {images.map((image) => (
          <figure key={image.src} className="gallery-photo">
            <TiltCard
              strength={2}
              className="surface-card aspect-[4/5] overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 44vw, 160px"
                className="object-cover"
              />
            </TiltCard>
            <figcaption className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              {image.description}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-2 sm:hidden">
        <button
          type="button"
          className="icon-button"
          onClick={() => scroll(-1)}
          aria-label="Previous photos"
        >
          <ArrowLeft size={15} />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => scroll(1)}
          aria-label="Next photos"
        >
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  )
}
