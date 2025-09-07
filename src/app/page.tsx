import Hello from "@/components/home/hello";
import SpotifyRecentlyPlayed from "@/components/home/spotify";
import { StravaActivity } from "@/components/home/strava";
import FadeIn from "@/components/utils/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Cloud Engineer — projects, work, and ways to get in touch.",
};

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 transition-theme">
      {/* Hero Section */}
      <Hello />
      
      {/* Strava Activities Section - Animated with faster delay */}
      <FadeIn delay={1.2} y={24} duration={0.5}>
        <div className="mt-6">
          <StravaActivity />
        </div>
      </FadeIn>
      
      {/* Spotify Recently Played Section - Animated with faster delay */}
      <FadeIn delay={1.5} y={24} duration={0.5}>
        <div className="mt-8 md:mt-6">
          <SpotifyRecentlyPlayed />
        </div>
      </FadeIn>
    </div>
  );
}
