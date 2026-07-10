import { NextResponse } from "next/server"

export const revalidate = 86400

// The data.go.kr service key is kept server-side. Set KR_SIDO_BOUNDARY_URL to
// the approved legal-boundary endpoint. The URL may contain {serviceKey}; this
// avoids baking a provider-specific parameter name into the client or repo.
export async function GET() {
  const sourceUrl = process.env.KR_SIDO_BOUNDARY_URL
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY
  if (!sourceUrl || !serviceKey) {
    return NextResponse.json({ error: "Korea boundary source is not configured." }, { status: 503 })
  }

  const url = sourceUrl.replace("{serviceKey}", encodeURIComponent(serviceKey))
  const response = await fetch(url, {
    headers: { "user-agent": "CampCareer Korea Maps boundary proxy/1.0 (+https://www.campcareer.com)" },
    next: { revalidate: 86400 },
  })
  if (!response.ok) return NextResponse.json({ error: `Boundary source failed: ${response.status}` }, { status: 502 })

  const body = await response.json()
  if (!body || typeof body !== "object" || !("type" in body) || (body as { type?: string }).type !== "FeatureCollection") {
    return NextResponse.json({ error: "Boundary source did not return GeoJSON FeatureCollection." }, { status: 502 })
  }
  return NextResponse.json(body, { headers: { "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800" } })
}
