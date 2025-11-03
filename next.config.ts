import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    domains: [
      "i.scdn.co",
      "mosaic.scdn.co",
      "image-cdn-ak.spotifycdn.com",
      "image-cdn-fa.spotifycdn.com",
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ]
  },
}

export default nextConfig
