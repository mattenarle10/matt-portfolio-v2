import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "About",
  description:
    "matthew enarle, basically — cloud engineer at eCloudvalley, endurance athlete, and startup enthusiast. Experience, education, and hobbies.",
  alternates: { canonical: "https://www.mattenarle.com/about" },
  openGraph: {
    title: "About | Matt Enarle",
    description:
      "matthew enarle, basically — cloud engineer at eCloudvalley, DLSU alum, endurance athlete, and startup enthusiast.",
    url: "https://www.mattenarle.com/about",
    images: [
      { url: "https://www.mattenarle.com/twitter-img.png", alt: "Matt Enarle" },
    ],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.mattenarle.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: "https://www.mattenarle.com/about",
              },
            ],
          }),
        }}
      />
    </>
  )
}
