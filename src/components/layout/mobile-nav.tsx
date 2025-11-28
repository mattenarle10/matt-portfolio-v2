"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "@/components/context/ThemeContext"
import ThemeToggle from "@/components/utils/ThemeToggle"

// Minimal hamburger menu icon component
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="relative w-5 h-5">
      <motion.span
        className={`absolute top-1/2 left-0 w-full h-[1px] ${isOpen ? "bg-white" : "bg-black dark:bg-white"}`}
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 0 : -4,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      <motion.span
        className={`absolute top-1/2 left-0 w-full h-[1px] ${isOpen ? "bg-white" : "bg-black dark:bg-white"}`}
        animate={{
          opacity: isOpen ? 0 : 1,
          x: isOpen ? 8 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      <motion.span
        className={`absolute top-1/2 left-0 w-full h-[1px] ${isOpen ? "bg-white" : "bg-black dark:bg-white"}`}
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? 0 : 4,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
    </div>
  )
}

const MobileNav = () => {
  const { theme } = useTheme()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ]

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <nav className="w-full z-50 bg-transparent transition-colors duration-300 pt-3 pb-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 w-full">
            {/* Logo - different image based on theme */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center h-7 w-21"
                aria-label="Home"
              >
                {theme === "dark" ? (
                  <Image
                    src="/2.png"
                    alt="Matt Enarle Logo"
                    height={28}
                    width={84}
                    style={{ height: 28, width: "auto" }}
                    priority
                  />
                ) : (
                  <Image
                    src="/1.png"
                    alt="Matt Enarle Logo"
                    height={28}
                    width={84}
                    style={{ height: 28, width: "auto" }}
                    priority
                  />
                )}
              </Link>
            </div>

            {/* Menu Button - Only show when menu is closed */}
            {!isOpen && (
              <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <HamburgerIcon isOpen={false} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Close Button - Fixed position when menu is open */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed top-6 right-4 z-50 p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <HamburgerIcon isOpen={true} />
        </button>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm flex flex-col justify-center items-center mobile-menu-overlay"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col space-y-6 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Links */}
              {navLinks.map(({ href, label }, index) => {
                const isActive = pathname === href
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    className="relative px-3 py-1"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-pill"
                        className="absolute inset-0 rounded-xl bg-white/10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <Link
                      href={href}
                      className="px-3 py-3 text-base font-light text-white hover:text-blue-400 relative z-10 transition-all duration-200 ease-out hover:translate-x-0.5"
                    >
                      {label}
                    </Link>
                  </motion.div>
                )
              })}

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.3,
                  delay: 0.1 + navLinks.length * 0.1,
                }}
                className="mt-2"
              >
                <ThemeToggle variant="mobile" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileNav
