'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, MapPin } from 'lucide-react';

type StravaActivity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  map: {
    summary_polyline: string;
  };
  average_speed: number;
};

const StravaActivities = () => {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/strava');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch Strava activities');
        }
        
        const data = await response.json();
        setActivities(data); // Show 3 most recent activities
      } catch (err: any) {
        console.error('Error fetching Strava activities:', err);
        setError(err.message || 'Could not load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    
    // Refresh activities every 30 minutes
    const intervalId = setInterval(fetchActivities, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Format distance from meters to kilometers/miles
  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };

  // Format time from seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours > 0 ? hours : null,
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="pt-8 pb-12">
      <div className="text-left">
        <motion.h2 
          className="text-2xl md:text-3xl font-light mb-4 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Recent Activities
        </motion.h2>
        
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400 font-light text-base">
            Loading activities...
          </div>
        ) : error ? (
          <div className="text-gray-600 dark:text-gray-300 font-light text-base">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-light text-base text-gray-900 dark:text-gray-100">
                    {activity.name}
                  </h3>
                  <span className="text-xs font-light px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                    {activity.type}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  <span className="font-light">
                    {new Date(activity.start_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Distance</span>
                    <span className="font-light">{formatDistance(activity.distance)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Time</span>
                    <span className="font-light">{formatTime(activity.moving_time)}</span>
                  </div>
                </div>
                
                <a 
                  href={`https://www.strava.com/activities/${activity.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-light"
                >
                  View on Strava
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StravaActivities;