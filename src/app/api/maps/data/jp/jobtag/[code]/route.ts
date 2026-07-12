import { NextResponse } from "next/server"
import { JP_JOBTAG_PROFILES_BY_WAGE_CODE } from "@/data/jp-map-data"

export const revalidate = 86400

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code
  if (!/^[A-Za-z0-9.-]{1,24}$/.test(code)) {
    return NextResponse.json({ error: "Invalid occupation code" }, { status: 400 })
  }
  const profiles = JP_JOBTAG_PROFILES_BY_WAGE_CODE[code] ?? []
  return NextResponse.json(
    { code, profiles },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
      },
    },
  )
}
