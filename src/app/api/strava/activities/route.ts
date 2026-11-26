import { NextResponse } from "next/server"
import { z } from "zod"

// Load environment variables
const CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN

const publicActivity = z.object({
  visibility: z.literal("everyone"),
  id: z.number(),
  name: z.string(),
  type: z.string(),
  start_date: z.string(),
  distance: z.number(),
  moving_time: z.number(),
  total_elevation_gain: z.number(),
  average_heartrate: z.number().nullish(),
})

// Function to get a new access token
async function refreshAccessToken() {
  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN!,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error refreshing access token:", error)
    throw error
  }
}

// Route handler for GET /api/strava/activities
export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const perPage = Number(url.searchParams.get("per_page") ?? 3)
    if (!Number.isInteger(perPage) || perPage < 1 || perPage > 10) {
      return NextResponse.json(
        { error: "Invalid activity limit" },
        { status: 400 }
      )
    }

    // Get new access token
    const accessToken = await refreshAccessToken()

    // Fetch activities using the access token
    const response = await fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=10",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.status}`)
    }

    const activities = z.array(z.unknown()).parse(await response.json())
    const publishedActivities = activities.flatMap((activity) => {
      const result = publicActivity.safeParse(activity)
      if (!result.success) return []
      const { visibility: _visibility, ...fields } = result.data
      return [fields]
    })
    return NextResponse.json(publishedActivities.slice(0, perPage))
  } catch (error) {
    console.error("Error in activities endpoint:", error)
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    )
  }
}
