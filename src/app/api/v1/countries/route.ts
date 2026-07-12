import { NextRequest, NextResponse } from "next/server"
import { getCountryOptions } from "@/lib/study-product/countries"

export const revalidate = 86400

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "ko-KR" ? "ko-KR" : "en"
  return NextResponse.json(
    { countries: getCountryOptions(locale) },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  )
}
