import Hello from "@/components/home/hello"
import RecentMediumPosts from "@/components/home/medium"
import Socials from "@/components/home/socials"
import { StravaActivity } from "@/components/home/strava"
import { FadeIn } from "@/components/ui"

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 transition-theme">
      {/* Hero Section */}
      <Hello />

      <FadeIn delay={1} y={24} duration={0.5}>
        <div className="mt-6">
          <RecentMediumPosts />
        </div>
      </FadeIn>

      {/* Strava Activities Section - Animated with faster delay */}
      <FadeIn delay={1.2} y={24} duration={0.5}>
        <div className="mt-6 md:mt-6">
          <StravaActivity />
        </div>
      </FadeIn>

      {/* Contact Section */}
      <FadeIn delay={1.4} y={24} duration={0.5}>
        <div className="mt-6 md:mt-6">
          <Socials />
        </div>
      </FadeIn>
    </div>
  )
}
