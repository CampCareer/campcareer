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

    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/roi] request failed:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
