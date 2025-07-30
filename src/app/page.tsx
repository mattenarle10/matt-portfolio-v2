import Hello from "@/components/home/hello";
import StravaActivities from "@/components/home/strava";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> {/* Reduced vertical padding */}
      {/* Hero Section */}
      <Hello />
      
      {/* Strava Activities Section */}
      <StravaActivities />
    </div>
  );
}
