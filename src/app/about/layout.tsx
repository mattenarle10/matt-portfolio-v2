import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "About",
  description:
    "Professional experience, education, and background of Matt Enarle. Cloud engineer at eCloudvalley, MBA graduate from DLSU, endurance athlete, and startup founder.",
  alternates: { canonical: "https://mattenarle.com/about" },
  openGraph: {
    title: "About | Matt Enarle",
    description:
      "Professional experience, education, and background of Matt Enarle. Cloud engineer, MBA graduate, and endurance athlete.",
    url: "https://mattenarle.com/about",
    images: [
      { url: "https://mattenarle.com/twitter-img.png", alt: "Matt Enarle" },
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
                item: "https://mattenarle.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: "https://mattenarle.com/about",
              },
            ],
          }),
        }}
      />
    </>
  )
}
