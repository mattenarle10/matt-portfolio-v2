import { NextResponse } from 'next/server';
import { getRecentActivities } from '@/lib/strava';

export async function GET() {
  try {
    // Get recent activities from Strava
    const activities = await getRecentActivities(3);
    
    return NextResponse.json(activities);
  } catch (error: any) {
    console.error('Error in Strava API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Strava activities' },
      { status: 500 }
    );
  }
}
