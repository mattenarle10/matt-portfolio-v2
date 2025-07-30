import Hello from "@/components/home/hello";
import SpotifyRecentlyPlayed from "@/components/home/spotify";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-theme"> {/* Reduced vertical padding */}
      {/* Hero Section */}
      <Hello />
      
      {/* Spotify Recently Played Section */}
      <SpotifyRecentlyPlayed />
      
      {/* Strava Activities Section */}

    </div>
  );
}
