import { getNOMapV2Bundle } from "@/lib/no-map-v2"

export const revalidate = 86400

export function GET() {
  const body = JSON.stringify(getNOMapV2Bundle())
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "X-Map-Country": "NO",
      "X-Map-Data-Version": "no-map-v2-2026-07-13",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
