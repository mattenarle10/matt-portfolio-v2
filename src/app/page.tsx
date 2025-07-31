import Hello from "@/components/home/hello";
import SpotifyRecentlyPlayed from "@/components/home/spotify";
import { StravaActivity } from "@/components/home/strava";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 transition-theme">
      {/* Hero Section */}
      <Hello />
      
      {/* Strava Activities Section */}
      <div className="mt-6">
        <StravaActivity />
      </div>
      
      {/* Spotify Recently Played Section */}
      <div className="mt-6">
        <SpotifyRecentlyPlayed />
      </div>

    </div>
  );
}
