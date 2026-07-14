import { NextResponse } from "next/server"
import { isLaunchCountry } from "@/data/launch-countries"
import type { MapData, MapDataCountry } from "@/lib/map-data"
import { getNZMapV2Bundle, getSafeNZMapData } from "@/lib/nz-map-v2"
import {
  buildMapsV1Envelope,
  getCountryBundleEvidence,
  getMapBundleAsOf,
  MAP_COUNTRY_BUNDLE_VERSION,
  type MapEvidenceReference,
} from "@/lib/maps-v1-contract"

export const revalidate = 86400

type RouteContext = { params: Promise<{ country: string }> }

function getNewZealandEvidence(): MapEvidenceReference[] {
  const v2 = getNZMapV2Bundle()
  const asOf = getMapBundleAsOf(v2.version)

  return [
    ["Stats NZ regional council boundaries", v2.sources.boundary],
    ["New Zealand Ministry of Education tertiary-provider directory", v2.sources.providers],
    ["New Zealand Tenancy Services rental data", v2.sources.rent],
    ["Stats NZ occupation data", v2.sources.occupations],
    ["Immigration New Zealand Green List", v2.sources.pathways],
  ].map(([sourceName, sourceUrl]) => ({
    status: "needs_review" as const,
    sourceName,
    sourceUrl,
    asOf,
    lastVerifiedAt: asOf,
    note: "The NZ v2 map bundle exposes geography and provider references only. Rent, wage, shortage, and pathway claims remain hidden until their source rows are approved.",
  }))
}

/**
 * Versioned Maps API. `/api/maps/data/*` remains a compatibility adapter for
 * older clients while all lazy country loads move to this transparent envelope.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const country = (await params).country.toUpperCase()

  if (!isLaunchCountry(country)) {
    return NextResponse.json({ error: "Unsupported map country" }, { status: 404 })
  }

  const envelope = country === "NZ"
    ? buildMapsV1Envelope({
        country,
        data: getSafeNZMapData(),
        dataVersion: getNZMapV2Bundle().version,
        evidence: getNewZealandEvidence(),
      })
    : await buildStandardCountryEnvelope(country)

  return NextResponse.json(envelope, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "X-Map-Country": envelope.country,
      "X-Map-Data-Version": envelope.dataVersion,
      "X-Map-Methodology-Version": envelope.methodologyVersion,
      "X-Content-Type-Options": "nosniff",
    },
  })
}

async function buildStandardCountryEnvelope(country: string) {
  // Keep the server-only map-data module out of the NZ code path. The static
  // NZ projection is deliberately testable without credentials and does not
  // need the aggregate database-backed bundle at all.
  const { getMapData, selectMapCountryBundle } = await import("@/lib/map-data")

  return buildMapsV1Envelope<Partial<MapData>>({
    country,
    data: selectMapCountryBundle(await getMapData(), country as MapDataCountry),
    dataVersion: MAP_COUNTRY_BUNDLE_VERSION,
    evidence: getCountryBundleEvidence(MAP_COUNTRY_BUNDLE_VERSION),
  })
}
