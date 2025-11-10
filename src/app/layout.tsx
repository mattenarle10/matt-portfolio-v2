import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { GlobalStateProvider } from "@/components/context/GlobalStateContext"
import { ThemeProvider as ClientThemeProvider } from "@/components/context/ThemeContext"
import { ChatProvider } from "@/components/chat/chat-provider"
import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://mattenarle.com"),
  title: {
    default: "Matt Enarle | Cloud Engineer & Endurance Athlete",
    template: "%s | Matt Enarle",
  },
  description:
    "hello... Matt here!|. cloud engineer by day, endurance athlete by night, mba + startup in between — the ultimate side quest. also a @heartescaro stan.",
  applicationName: "Matt Enarle",
  alternates: {
    canonical: "https://mattenarle.com",
  },
  verification: {
    google: "googlefde13a6e8c7fdcf6",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        url: "/icon-dark-192.png",
        sizes: "192x192",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon-dark-512.png",
        sizes: "512x512",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      {
        url: "/apple-icon-dark.png",
        sizes: "180x180",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  openGraph: {
    title: "Matt Enarle | Cloud Engineer & Endurance Athlete",
    description:
      "hello... Matt here!|. cloud engineer by day, endurance athlete by night, mba + startup in between — the ultimate side quest.",
    url: "https://mattenarle.com",
    siteName: "Matt Enarle",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "https://mattenarle.com/twitter-img.png",
        alt: "Matt Enarle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matt Enarle | Cloud Engineer & Endurance Athlete",
    description:
      "hello... Matt here!|. cloud engineer by day, endurance athlete by night, mba + startup in between.",
    creator: "@yourtwitterhandle",
    images: ["https://mattenarle.com/twitter-img.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Matt Enarle",
    "Matthew Enarle",
    "Cloud Engineer",
    "Software Engineer",
    "Endurance Athlete",
    "eCloudvalley",
    "Portfolio",
    "Projects",
    "MBA",
    "Startup",
  ],
  authors: [{ name: "Matt Enarle", url: "https://mattenarle.com" }],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const cookieTheme =
    cookieStore.get("theme")?.value === "light" ? "light" : "dark"
  const isDark = cookieTheme === "dark"
  return (
    <html lang="en" className={`scroll-smooth ${isDark ? "dark" : ""}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-200`}
      >
        <ClientThemeProvider initialTheme={cookieTheme}>
          <GlobalStateProvider>
            <Navbar />
            <main className="flex-grow min-h-[60vh]">{children}</main>
            <Footer />
            <Analytics />
            <ChatProvider />
            {/* JSON-LD: Person */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Person",
                  name: "Matt Enarle",
                  url: "https://mattenarle.com",
                  jobTitle: "Cloud Engineer",
                  image: "https://mattenarle.com/about/matt-grad.png",
                  sameAs: [
                    "https://github.com/mattenarle",
                    "https://www.linkedin.com/in/mattenarle",
                  ],
                  description:
                    "Cloud Engineer and endurance athlete. Projects, resume, and contact.",
                }),
              }}
            />
            {/* JSON-LD: WebSite with SearchAction (helps sitelinks search box) */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  name: "Matt Enarle",
                  url: "https://mattenarle.com",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://mattenarle.com/?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                }),
              }}
            />
            {/* JSON-LD: ItemList for main navigation (helps sitelinks) */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  itemListElement: [
                    {
                      "@type": "SiteNavigationElement",
                      position: 1,
                      name: "Home",
                      description:
                        "Cloud engineer by day, endurance athlete by night",
                      url: "https://mattenarle.com/",
                    },
                    {
                      "@type": "SiteNavigationElement",
                      position: 2,
                      name: "About",
                      description: "Experience, education, and hobbies",
                      url: "https://mattenarle.com/about",
                    },
                    {
                      "@type": "SiteNavigationElement",
                      position: 3,
                      name: "Projects",
                      description:
                        "Cloud infrastructure and software engineering projects",
                      url: "https://mattenarle.com/projects",
                    },
                    {
                      "@type": "SiteNavigationElement",
                      position: 4,
                      name: "Contact",
                      description:
                        "Get in touch via email, LinkedIn, GitHub, or book a call",
                      url: "https://mattenarle.com/contact",
                    },
                  ],
                }),
              }}
            />
          </GlobalStateProvider>
        </ClientThemeProvider>
      </body>
    </html>
  )
}
