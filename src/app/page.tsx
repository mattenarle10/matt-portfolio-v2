import GitHubActivity from "@/components/home/github-activity"
import Hello from "@/components/home/hello"
import RecentMediumPosts from "@/components/home/medium"
import { QuickActions } from "@/components/home/quick-actions"
import Socials from "@/components/home/socials"
// import { StravaActivity } from "@/components/home/strava"
import { FadeIn } from "@/components/ui"

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 transition-theme">
      {/* Hero Section */}
      <Hello />
      <QuickActions />

      <FadeIn delay={0.1} y={12} duration={0.4}>
        <div className="mt-8">
          <GitHubActivity />
        </div>
      </FadeIn>

      <FadeIn delay={0.15} y={12} duration={0.4}>
        <div className="mt-7">
          <RecentMediumPosts />
        </div>
      </FadeIn>

      {/* Strava is disabled while API access is subscriber-only. */}
      {/* <FadeIn delay={1.2} y={24} duration={0.5}>
        <div className="mt-6 md:mt-6">
          <StravaActivity />
        </div>
      </FadeIn> */}

      {/* Contact Section */}
      <FadeIn delay={0.2} y={12} duration={0.4}>
        <div className="mt-7">
          <Socials />
        </div>
      </FadeIn>
    </div>
  )
}
