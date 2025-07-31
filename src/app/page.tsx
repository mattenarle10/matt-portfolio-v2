import Hello from "@/components/home/hello";
import SpotifyRecentlyPlayed from "@/components/home/spotify";
import { StravaActivity } from "@/components/home/strava";
import FadeIn from "@/components/utils/FadeIn";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 transition-theme">
      {/* Hero Section */}
      <Hello />
      
      {/* Strava Activities Section - Animated with delay */}
      <FadeIn delay={2.6} y={30}>
        <div className="mt-6">
          <StravaActivity />
        </div>
      </FadeIn>
      
      {/* Spotify Recently Played Section - Animated with longer delay */}
      <FadeIn delay={3.0} y={30}>
        <div className="mt-6">
          <SpotifyRecentlyPlayed />
        </div>
      </FadeIn>
    </div>
  );
}
