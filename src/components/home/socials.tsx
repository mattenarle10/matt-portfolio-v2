import { Github, Instagram, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

type SocialItem = {
  label: string
  href: string
  icon: React.ReactElement
  subtext: string
}

const InstagramIcon = (
  <Instagram className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
)
const LinkedinIcon = (
  <Linkedin className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
)
const GithubIcon = (
  <Github className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
)
const MailIcon = <Mail className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />

const socials: SocialItem[] = [
  {
    label: "Email Me",
    href: "mailto:matthew.enarle@outlook.com",
    icon: MailIcon,
    subtext: "Tap to email",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/mattenarle",
    icon: InstagramIcon,
    subtext: "@mattenarle",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/matthew-enarle",
    icon: LinkedinIcon,
    subtext: "/matthew-enarle",
  },
  {
    label: "GitHub",
    href: "https://github.com/mattenarle10",
    icon: GithubIcon,
    subtext: "/mattenarle10",
  },
]

export default function Socials() {
  return (
    <section>
      <div className="mb-2 md:mb-3 flex items-center justify-between">
        <h2 className="text-base md:text-lg font-light text-black dark:text-white">
          Contact
        </h2>
      </div>
      <div className="overflow-hidden rounded-md border border-black/[0.08] dark:border-white/[0.08]">
        <div className="p-2.5 md:p-3">
          <div className="grid grid-cols-2 gap-2 md:gap-3 w-full">
            {socials.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 md:gap-3 rounded-sm px-2 py-2 md:px-3 md:py-2.5 -mx-2 -my-2 outline-none focus:outline-none focus:ring-0 transition-all duration-200 ease-out hover:translate-x-0.5"
                aria-label={item.label}
                title={item.label}
              >
                <span className="text-black dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
                  {item.icon}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm md:text-base font-light text-black dark:text-white group-hover:underline">
                    {item.label}
                  </span>
                  <span className="text-[11px] md:text-xs text-black dark:text-white/70">
                    {item.subtext}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
