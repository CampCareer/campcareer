import { NextRequest, NextResponse } from 'next/server'
import { fetchRoiData } from '@/lib/roi-query'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  try {
    const result = await fetchRoiData({
      country: searchParams.get('country'),
      state: searchParams.get('state'),
      field: searchParams.get('field'),
      collegeId: searchParams.get('college_id'),
      nfqLevel: searchParams.get('nfq_level'),
      limit: parseInt(searchParams.get('limit') ?? '50', 10),
      sort: searchParams.get('sort'),
      careerStage: searchParams.get('career_stage'),
    })

    // ROI 데이터는 matview 기반이라 자주 안 바뀜 — 동일 쿼리는 CDN에서 1시간
    // 캐시하고, 만료 후 1일간 stale 응답을 즉시 주며 백그라운드 재검증한다.
    // 응답이 사용자별로 다르지 않으므로 공유 캐시(public)가 안전하다.
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('[api/roi] request failed:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
