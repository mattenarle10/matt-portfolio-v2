'use client';

import { useStrava } from '@/app/api/strava/useStrava';

export function StravaActivity() {
  const { activities, stats, isLoading, statsLoading, error, statsError } = useStrava();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (e) {
      return 'recently';
    }
  };

  // Get most recent activity
  const recentActivity = activities && activities.length > 0 ? activities[0] : null;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-orange-500" fill="currentColor">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
        </svg>
        <h2 className="text-base font-light text-gray-700 dark:text-gray-300">Strava</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Stats card */}
        <div className="overflow-hidden rounded-md border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm md:col-span-1">
          <div className="p-3">
            {statsLoading ? (
              <>
                <div className="font-light text-sm text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2">Run Stats</div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                {statsError ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                    Unable to load stats
                  </p>
                ) : (
                  stats && (
                    <>
                      <h3 className="font-light text-sm text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2">
                        Run Stats
                      </h3>

                      <div className="space-y-1 text-xs font-light">
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="text-gray-500 dark:text-gray-400">4 weeks:</span> {stats.recentRuns.distance.toFixed(1)} km
                            <span className="text-gray-400 dark:text-gray-500 ml-1">({stats.recentRuns.count} runs)</span>
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="text-gray-500 dark:text-gray-400">2025:</span> {stats.ytdRuns.distance.toFixed(1)} km
                            <span className="text-gray-400 dark:text-gray-500 ml-1">({stats.ytdRuns.count} runs)</span>
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="text-gray-500 dark:text-gray-400">All-time:</span> {stats.allTimeRuns.distance.toFixed(1)} km
                            <span className="text-gray-400 dark:text-gray-500 ml-1">({stats.allTimeRuns.count} runs)</span>
                          </p>
                        </div>
                      </div>
                    </>
                  )
                )}
              </>
            )}
          </div>
        </div>

        {/* Recent activities */}
        <div className="overflow-hidden rounded-md border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm md:col-span-2">
          <div className="p-3">
            {isLoading ? (
              <>
                <div className="font-light text-sm text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2">Recent Activities</div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                {error ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                    Unable to load activities
                  </p>
                ) : (
                  activities.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="font-light text-sm text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-1 mb-2">
                        Recent Activities
                      </h3>
                      
                      {activities.map((activity) => (
                        <div key={activity.id} className="border-b last:border-b-0 border-gray-100 dark:border-gray-800 pb-3 last:pb-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-light text-sm text-gray-800 dark:text-gray-100">
                              {activity.name}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                              {formatDate(activity.date)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-light mt-1">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <span>{activity.distance.toFixed(1)} km</span>
                            </div>

                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <span>• {activity.movingTime} min</span>
                            </div>

                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <span>• {activity.elevationGain} m</span>
                            </div>

                            {activity.averageHeartrate && (
                              <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <span>• {Math.round(activity.averageHeartrate)} bpm</span>
                              </div>
                            )}
                          </div>

                          {/* Removed map display for now */}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                      No recent activities found
                    </p>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}