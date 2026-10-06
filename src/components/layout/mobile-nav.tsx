"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui"
import { useTheme } from "@/context"
import { CommandTrigger } from "./command-menu"

export default function MobileNav() {
  const { theme } = useTheme()
  const pathname = usePathname()
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/writing", label: "Writing" },
  ]

  return (
    <header className="px-4 sm:px-6 pt-3 pb-1">
      <div className="flex items-center justify-between h-12">
        <Link href="/" aria-label="Home" className="flex items-center h-8">
          <Image
            src={theme === "dark" ? "/2.png" : "/1.png"}
            alt="Matt Enarle Logo"
            width={84}
            height={28}
            style={{ height: 28, width: "auto" }}
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          <CommandTrigger compact />
          <ThemeToggle />
        </div>
      </div>
      <nav aria-label="Main navigation" className="mobile-links">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className="relative py-2.5 text-center text-xs"
          >
            {pathname === href && (
              <motion.span
                layoutId="mobile-active-link"
                className="nav-active-surface absolute inset-0 rounded-md"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{label}</span>
          </Link>
        ))}
      </nav>
    </header>
  )
}
