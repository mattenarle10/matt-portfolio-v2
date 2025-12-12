"use client"

interface SpotifyEmbedProps {
  link: string
  width?: string | number
  height?: string | number
  className?: string
}

export function SpotifyEmbed({
  link,
  width = "100%",
  height = "352",
  className = "",
}: SpotifyEmbedProps) {
  // Convert Spotify URL to embed URL
  const getEmbedUrl = (url: string) => {
    // Handle different Spotify URL formats
    // https://open.spotify.com/track/[id] -> https://open.spotify.com/embed/track/[id]
    if (url.includes("open.spotify.com")) {
      return url.replace("open.spotify.com", "open.spotify.com/embed")
    }
    return url
  }

  const embedUrl = getEmbedUrl(link)

  return (
    <iframe
      src={embedUrl}
      width={width}
      height={height}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className={className}
      title="Spotify player"
    />
  )
}

