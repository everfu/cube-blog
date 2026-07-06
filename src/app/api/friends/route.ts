import { getFriendsSnapshot } from '@/server/friends/adapters/page'

export async function GET() {
  try {
    const response = await getFriendsSnapshot()

    return Response.json(response, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return Response.json({
      items: [],
      sources: [],
      generatedAt: new Date().toISOString(),
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  }
}
