import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Articles, notes, and learnings by Matt Enarle on cloud, software engineering, and endurance training.",
  alternates: { canonical: "https://mattenarle.com/writing" },
  openGraph: {
    title: "Writing | Matt Enarle",
    description:
      "Articles, notes, and learnings by Matt Enarle on cloud, software engineering, and endurance training.",
    url: "https://mattenarle.com/writing",
    images: [
      { url: "https://mattenarle.com/twitter-img.png", alt: "Matt Enarle" },
    ],
  },
}

export default function WritingLayout({
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
                item: "https://mattenarle.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Writing",
                item: "https://mattenarle.com/writing",
              },
            ],
          }),
        }}
      />
    </>
  )
}
