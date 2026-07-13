import { NextResponse } from "next/server"
import { getNZMapV2Bundle } from "@/lib/nz-map-v2"

export const revalidate = 86400

export function GET() {
  const body = JSON.stringify(getNZMapV2Bundle())
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "X-Map-Country": "NZ",
      "X-Map-Data-Version": "nz-map-v2-2026-07-13",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
