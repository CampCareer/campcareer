import { getNZMapV2Bundle, getSafeNZMapData, NZ_MAP_V2_VERSION } from "@/lib/nz-map-v2"
import { buildMapDataEnvelope } from "../contract"

export const revalidate = 86400

export function GET() {
  const v2 = getNZMapV2Bundle()
  const envelope = buildMapDataEnvelope(
    "NZ",
    getSafeNZMapData(),
    NZ_MAP_V2_VERSION,
    Object.values(v2.notices),
  )
  const body = JSON.stringify(envelope)

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "X-Map-Country": envelope.country,
      "X-Map-Data-Version": envelope.dataVersion,
      "X-Uncompressed-Bytes": String(Buffer.byteLength(body)),
      "X-Content-Type-Options": "nosniff",
    },
  })
}
