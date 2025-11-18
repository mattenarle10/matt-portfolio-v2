import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Matt Enarle for consulting, collaboration, or networking opportunities. Connect via email, LinkedIn, GitHub, or schedule a call directly.",
  alternates: { canonical: "https://mattenarle.com/contact" },
  openGraph: {
    title: "Contact | Matt Enarle",
    description:
      "Get in touch with Matt Enarle via email, LinkedIn, GitHub, or schedule a call for consulting and collaboration opportunities.",
    url: "https://mattenarle.com/contact",
    images: [
      { url: "https://mattenarle.com/twitter-img.png", alt: "Matt Enarle" },
    ],
  },
}

export default function ContactLayout({
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
                name: "Contact",
                item: "https://mattenarle.com/contact",
              },
            ],
          }),
        }}
      />
    </>
  )
}
