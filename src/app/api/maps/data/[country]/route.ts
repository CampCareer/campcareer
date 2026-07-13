import { NextResponse } from "next/server"
import {
  getMapData,
  selectMapCountryBundle,
  type MapDataCountry,
} from "@/lib/map-data"

const COUNTRIES = new Set<MapDataCountry>(["AU", "US", "CA", "IE", "UK", "DE", "NL", "BE", "JP", "SG", "KR", "FR", "ES", "NZ"])

export const revalidate = 86400

export async function GET(_request: Request, { params }: { params: Promise<{ country: string }> }) {
  const country = (await params).country.toUpperCase() as MapDataCountry
  if (!COUNTRIES.has(country)) {
    return NextResponse.json({ error: "Unsupported map country" }, { status: 404 })
  }

  const bundle = selectMapCountryBundle(await getMapData(), country)
  const body = JSON.stringify({ country, data: bundle, dataVersion: "map-country-bundle-2026-07-12" })

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "X-Map-Country": country,
      "X-Uncompressed-Bytes": String(Buffer.byteLength(body)),
      "X-Content-Type-Options": "nosniff",
    },
  })
}
