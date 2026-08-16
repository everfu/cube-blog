import { getCachedFriends } from '@/features/friends/aggregate'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const noStoreHeaders = {
  'Cache-Control': 'no-store, max-age=0',
}

const successHeaders = {
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=240',
}

export async function GET() {
  try {
    return Response.json(await getCachedFriends(), { headers: successHeaders })
  } catch {
    return Response.json(
      { error: 'Unable to aggregate friend feeds' },
      { status: 502, headers: noStoreHeaders },
    )
  }
}
